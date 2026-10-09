export const formatLocalDateInput = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getTodayInputValue = () => formatLocalDateInput();

export const getLocalTimeInputValue = (date = new Date()) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const combineLocalDateAndTime = (datePart: string, timePart: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return datePart;
  if (!/^\d{2}:\d{2}$/.test(timePart)) return `${datePart}T00:00:00`;
  return `${datePart}T${timePart}:00`;
};

export const getDateOffsetInputValue = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatLocalDateInput(date);
};

export const getPaymentDayKey = (payment: { date?: string; createdAt?: unknown }) => {
  if (payment.date) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(payment.date)) return payment.date;
    const fromDate = toDayKey(payment.date);
    if (fromDate) return fromDate;
  }
  return toDayKey(payment.createdAt);
};

export const formatPaymentWhen = (dateValue?: string) => {
  if (!dateValue) return null;
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateValue);
  const parsed = isDateOnly ? parseDayKey(dateValue) : toDate(dateValue);
  if (!parsed) return null;

  if (isDateOnly) {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(parsed);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parsed);
};

const toDate = (value: unknown) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "number") return new Date(value);
  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof value === "object") {
    const timestamp = value as { toDate?: () => Date; seconds?: number; nanoseconds?: number };
    if (typeof timestamp.toDate === "function") return timestamp.toDate();
    if (typeof timestamp.seconds === "number") {
      return new Date(timestamp.seconds * 1000 + Math.floor((timestamp.nanoseconds ?? 0) / 1000000));
    }
  }
  return null;
};

export const formatCreatedAt = (value: unknown) => {
  const date = toDate(value);
  if (!date) return "Just now";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

export const toDayKey = (value: unknown): string | null => {
  const date = toDate(value);
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseDayKey = (dayKey: string): Date | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) return null;
  const [year, month, day] = dayKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const eachDayInRange = (startDate: string, endDate: string): string[] => {
  const start = parseDayKey(startDate);
  const end = parseDayKey(endDate);
  if (!start || !end || end < start) return [];

  const days: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    days.push(toDayKey(cursor)!);
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
};

export const formatDayLabel = (dayKey: string) => {
  const date = parseDayKey(dayKey);
  if (!date) return dayKey;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
};

/** Each calendar day a hotel night is counted on (check-in day through day before check-out). */
export const eachHotelNightDayKey = (checkIn: string, checkOut: string): string[] => {
  const start = parseDayKey(checkIn);
  const end = parseDayKey(checkOut);
  if (!start || !end || end <= start) return [];

  const nights: string[] = [];
  const cursor = new Date(start);
  while (cursor < end) {
    nights.push(toDayKey(cursor)!);
    cursor.setDate(cursor.getDate() + 1);
  }
  return nights;
};

export const countHotelNights = (checkIn: string, checkOut: string) =>
  eachHotelNightDayKey(checkIn, checkOut).length;

/** Split total stay price evenly across nights; remainder on the last night. */
export const splitHotelStayAmount = (
  total: number,
  checkIn: string,
  checkOut: string,
): Map<string, number> => {
  const nights = eachHotelNightDayKey(checkIn, checkOut);
  const shares = new Map<string, number>();
  if (!nights.length || total <= 0) return shares;

  const totalCents = Math.round(total * 100);
  const baseCents = Math.floor(totalCents / nights.length);
  let remainderCents = totalCents;

  nights.forEach((dayKey, index) => {
    const cents = index === nights.length - 1 ? remainderCents : baseCents;
    remainderCents -= cents;
    shares.set(dayKey, cents / 100);
  });

  return shares;
};

export const formatHotelStayRange = (checkIn?: string, checkOut?: string) => {
  if (!checkIn || !checkOut) return null;
  const nights = countHotelNights(checkIn, checkOut);
  if (nights < 1) return null;
  return `${checkIn} → ${checkOut} · ${nights} night${nights === 1 ? "" : "s"}`;
};

export const formatPaymentWhenLabel = (payment: {
  category?: string;
  date?: string;
  checkIn?: string;
  checkOut?: string;
  createdAt?: unknown;
}) => {
  if (payment.category === "Hotel") {
    const stay = formatHotelStayRange(payment.checkIn, payment.checkOut);
    if (stay) return stay;
  }
  return formatPaymentWhen(payment.date) ?? formatCreatedAt(payment.createdAt);
};
