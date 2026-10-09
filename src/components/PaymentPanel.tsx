import { FormEvent, useEffect, useRef, useState } from "react";
import { CalendarDays, Hotel, Pen, Plane, ShoppingBag, Utensils } from "lucide-react";
import { combineLocalDateAndTime, countHotelNights } from "../utils/date";
import { NewPayment, Payment, PaymentGroup } from "../types/finance";
import { currency } from "../utils/currency";
import { PageHeader } from "./BackButton";

type PaymentPanelProps = {
  selectedFund?: PaymentGroup;
  selectedFundId: string;
  payments: Payment[];
  totalSaved: number;
  defaultDate: string;
  defaultTime: string;
  onCreatePayment: (payment: NewPayment) => Promise<void>;
  onRemovePayment: (paymentId: string) => Promise<void>;
  onClose: () => void;
};

const fieldCardClass =
  "rounded-[22px] bg-white/95 p-4 shadow-[0_3px_10px_rgba(43,52,54,0.07)]";
const fieldLabelClass =
  "mb-2.5 flex items-center gap-2 text-[0.68rem] font-black uppercase tracking-[0.1em] text-ink-muted";

export function PaymentPanel({
  selectedFund,
  selectedFundId,
  totalSaved,
  defaultDate,
  defaultTime,
  onCreatePayment,
  onClose,
}: PaymentPanelProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [expenseDate, setExpenseDate] = useState(defaultDate);
  const [expenseTime, setExpenseTime] = useState(defaultTime);
  const [cashCurrency, setCashCurrency] = useState(selectedFund?.currency || "LAK");
  const [category, setCategory] = useState("Food");
  const [checkIn, setCheckIn] = useState(selectedFund?.startDate ?? defaultDate);
  const [checkOut, setCheckOut] = useState(selectedFund?.endDate ?? defaultDate);
  const [formError, setFormError] = useState("");
  const amountInputRef = useRef<HTMLInputElement>(null);

  const isHotel = category === "Hotel";
  const hotelNights = isHotel ? countHotelNights(checkIn, checkOut) : 0;

  useEffect(() => {
    setCashCurrency(selectedFund?.currency || "LAK");
  }, [selectedFund?.currency]);

  useEffect(() => {
    if (category !== "Hotel") return;
    if (selectedFund?.startDate) setCheckIn(selectedFund.startDate);
    if (selectedFund?.endDate) setCheckOut(selectedFund.endDate);
  }, [category, selectedFund?.startDate, selectedFund?.endDate]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      amountInputRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const remainingAfterSave = selectedFund
    ? Math.max(selectedFund.budget - totalSaved - Number(amount || 0), 0)
    : 0;

  const submitPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFundId || !title.trim() || !amount) return;

    if (isHotel && hotelNights < 1) {
      setFormError("Check-out must be after check-in (at least 1 night).");
      return;
    }

    setFormError("");

    await onCreatePayment({
      groupId: selectedFundId,
      title: title.trim(),
      amount: Number(amount),
      category,
      currency: cashCurrency,
      paidBy: `Cash (${cashCurrency})`,
      note: note.trim(),
      date: combineLocalDateAndTime(isHotel ? checkIn : expenseDate, expenseTime),
      ...(isHotel ? { checkIn, checkOut } : {}),
    });
    setTitle("");
    setAmount("");
    setNote("");
    onClose();
  };

  const categories = [
    { name: "Food", icon: Utensils },
    { name: "Travel", icon: Plane },
    { name: "Shopping", icon: ShoppingBag },
    { name: "Hotel", icon: Hotel },
  ];

  return (
    <>
      <header className="mb-2">
        <PageHeader title={selectedFund?.name || "New Expense"} onBack={onClose} />
      </header>

      <form
        onSubmit={submitPayment}
        className="mx-auto grid w-full min-w-0 max-w-md gap-4 pb-28"
      >
        <article className="rounded-3xl bg-white/95 px-5 py-6 text-center shadow-[0_4px_12px_rgba(43,52,54,0.06)] max-[520px]:rounded-[22px]">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#9ba2a5]">
            {isHotel ? "Total stay price" : "Amount"}
          </p>

          <div className="mt-3 grid w-full grid-cols-[1fr_auto_1fr] items-baseline gap-x-1">
            <select
              className="justify-self-end border-0 bg-transparent pr-1 text-sm font-black uppercase text-primary outline-none focus:ring-0"
              value={cashCurrency}
              onChange={(event) => setCashCurrency(event.target.value)}
              aria-label="Currency"
            >
              <option value="LAK">LAK</option>
              <option value="THB">THB</option>
              <option value="USD">USD</option>
            </select>
            <input
              ref={amountInputRef}
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0"
              min="0"
              inputMode="decimal"
              autoFocus
              className="w-[min(11rem,42vw)] border-0 bg-transparent text-center text-[clamp(2rem,10vw,2.75rem)] font-black leading-none text-[#162225] outline-none placeholder:text-[#c5d0d3] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="min-w-0" aria-hidden />
          </div>

          {selectedFund && (
            <p className="mt-4 rounded-full bg-surface-low px-3 py-2 text-xs font-semibold text-ink-muted">
              Remaining after save{" "}
              <span className="font-black text-primary">
                {currency.format(remainingAfterSave, selectedFund.currency)}
              </span>
            </p>
          )}
        </article>

        <article className={fieldCardClass}>
          <p className={fieldLabelClass}>Category</p>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((item) => {
              const isActive = category === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setCategory(item.name);
                    setFormError("");
                  }}
                  className={`flex min-h-[4.25rem] flex-col items-center justify-center rounded-2xl px-1 py-2 transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-[0_4px_12px_rgba(0,106,113,0.28)]"
                      : "bg-surface-high text-ink-muted"
                  }`}
                >
                  <item.icon size={18} />
                  <span className="mt-1.5 text-[10px] font-bold uppercase leading-tight">{item.name}</span>
                </button>
              );
            })}
          </div>
        </article>

        <article className={fieldCardClass}>
          <p className={fieldLabelClass}>
            <Pen size={14} />
            Title
          </p>
          <input
            type="text"
            className="min-h-11 w-full rounded-xl border-0 bg-surface-highest px-3 text-base font-semibold text-ink outline-none placeholder:text-ink-muted/70 focus:ring-2 focus:ring-primary/30"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What did you spend on?"
          />
        </article>

        {isHotel ? (
          <article className={fieldCardClass}>
            <p className={fieldLabelClass}>
              <Hotel size={14} />
              Stay dates
            </p>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1.5 text-xs font-bold uppercase text-ink-muted">
                Check-in
                <input
                  type="date"
                  className="min-h-11 w-full min-w-0 rounded-xl border-0 bg-surface-highest px-3 text-base font-semibold normal-case text-ink outline-none focus:ring-2 focus:ring-primary/30"
                  value={checkIn}
                  max={checkOut}
                  onChange={(event) => setCheckIn(event.target.value)}
                />
              </label>
              <label className="grid gap-1.5 text-xs font-bold uppercase text-ink-muted">
                Check-out
                <input
                  type="date"
                  className="min-h-11 w-full min-w-0 rounded-xl border-0 bg-surface-highest px-3 text-base font-semibold normal-case text-ink outline-none focus:ring-2 focus:ring-primary/30"
                  value={checkOut}
                  min={checkIn}
                  onChange={(event) => setCheckOut(event.target.value)}
                />
              </label>
            </div>
            <p className="mt-3 text-sm font-semibold text-ink-muted">
              {hotelNights > 0 ? (
                <>
                  <span className="font-black text-primary">{hotelNights}</span> night
                  {hotelNights === 1 ? "" : "s"} · total for entire stay
                </>
              ) : (
                "Check-out must be after check-in"
              )}
            </p>
          </article>
        ) : (
          <article className={fieldCardClass}>
            <p className={fieldLabelClass}>
              <CalendarDays size={14} />
              Date & time
            </p>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                aria-label="Expense date"
                className="min-h-11 w-full min-w-0 rounded-xl border-0 bg-surface-highest px-3 text-base font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
                value={expenseDate}
                onChange={(event) => setExpenseDate(event.target.value)}
              />
              <input
                type="time"
                aria-label="Expense time"
                className="min-h-11 w-full min-w-0 rounded-xl border-0 bg-surface-highest px-3 text-base font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
                value={expenseTime}
                onChange={(event) => setExpenseTime(event.target.value)}
              />
            </div>
          </article>
        )}

        {formError ? (
          <p className="rounded-lg bg-danger/10 px-3.5 py-3 text-sm font-extrabold text-danger" role="alert">
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!selectedFundId || !title.trim() || !amount || (isHotel && hotelNights < 1)}
          className="fixed inset-x-0 bottom-6 z-50 mx-auto w-[calc(100%-2rem)] max-w-md rounded-full border-0 bg-linear-to-br from-primary to-primary-dim py-4 text-base font-bold text-white shadow-[0_8px_24px_rgba(0,106,113,0.28)] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save expense
        </button>
      </form>
    </>
  );
};
