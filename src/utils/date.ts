export const getTodayInputValue = () => new Date().toISOString().slice(0, 10);

export const getDateOffsetInputValue = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
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
  }).format(date);
};
