import { FormEvent, useEffect, useState } from "react";
import { CalendarDays, PlaneTakeoff } from "lucide-react";
import { NewPaymentGroup, PaymentGroup, PaymentGroupWithTotal } from "../types/finance";
import { getDateOffsetInputValue, getTodayInputValue } from "../utils/date";
import { PageHeader } from "./BackButton";

type FundPanelProps = {
  funds: PaymentGroupWithTotal[];
  selectedFundId: string;
  tripToEdit?: PaymentGroup;
  onCreateFund: (fund: NewPaymentGroup) => Promise<void>;
  onUpdateFund?: (groupId: string, fund: Partial<NewPaymentGroup>) => Promise<void>;
  onSelectFund: (fundId: string) => void;
  onClose: () => void;
};

const coverImageUrl =
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80";

export function FundPanel({ tripToEdit, onCreateFund, onUpdateFund, onClose }: FundPanelProps) {
  const isEditing = Boolean(tripToEdit);
  const [tripName, setTripName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [startDate, setStartDate] = useState(getTodayInputValue());
  const [endDate, setEndDate] = useState(getDateOffsetInputValue(10));
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("LAK");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!tripToEdit) {
      setTripName("");
      setImageUrl("");
      setStartDate(getTodayInputValue());
      setEndDate(getDateOffsetInputValue(10));
      setBudget("");
      setCurrency("LAK");
      return;
    }

    setTripName(tripToEdit.name);
    setImageUrl(tripToEdit.imageUrl ?? "");
    setStartDate(tripToEdit.startDate ?? getTodayInputValue());
    setEndDate(tripToEdit.endDate ?? getDateOffsetInputValue(10));
    setBudget(String(tripToEdit.budget ?? ""));
    setCurrency(tripToEdit.currency ?? "LAK");
  }, [tripToEdit]);

  const numericBudget = Number(budget) || 0;

  const submitTrip = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = tripName.trim();
    if (!trimmedName) return;

    setIsSubmitting(true);
    try {
      const payload = {
        type: "trip" as const,
        name: trimmedName,
        budget: numericBudget,
        startDate,
        endDate,
        imageUrl: imageUrl.trim() || coverImageUrl,
        currency,
      };

      if (isEditing && tripToEdit && onUpdateFund) {
        await onUpdateFund(tripToEdit.id, payload);
      } else {
        await onCreateFund(payload);
      }
      onClose?.();
    } catch {
      window.alert("Could not save trip. Check your connection and Firestore permissions.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section className="grid w-full min-w-0 gap-5 pb-8 text-ink">
      <PageHeader
        title={isEditing ? "Edit Trip" : "Create New Trip"}
        onBack={onClose} />

      <form id="create-trip-form" className="mx-auto grid w-full min-w-0 max-w-2xl gap-6" onSubmit={submitTrip}>
        <section className="grid gap-3">
          <div className="grid gap-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Start your journey</p>
          </div>

          <div className="relative h-40 w-full overflow-hidden rounded-3xl bg-surface-high max-[520px]:h-36 max-[520px]:rounded-[22px]">
            <img
              alt="Trip cover preview"
              className="h-full w-full object-cover"
              src={imageUrl.trim() || coverImageUrl}
              onError={(event) => {
                event.currentTarget.src = coverImageUrl;
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/30 to-transparent" />
          </div>
        </section>

        <section className="grid gap-5">
          <label className="min-w-0 gap-3">
            <span className="ml-1 text-sm font-semibold uppercase text-ink-muted">Cover image URL</span>
            <input
              className="min-h-12 w-full min-w-0 rounded-2xl border-0 bg-surface-highest px-4 text-base text-ink break-all placeholder:text-outline focus:border-transparent focus:ring-2 focus:ring-primary/40 max-[520px]:min-h-11 max-[520px]:text-sm"
              placeholder="https://example.com/trip-cover.jpg"
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
            />
          </label>

          <label className="min-w-0 gap-3">
            <span className="ml-1 text-sm font-semibold uppercase text-ink-muted">Trip name</span>
            <input
              className="min-h-12 w-full min-w-0 rounded-2xl border-0 bg-surface-highest px-4 text-base text-ink placeholder:text-outline focus:border-transparent focus:ring-2 focus:ring-primary/40 max-[520px]:min-h-11"
              placeholder="e.g., Japan Winter 2026"
              value={tripName}
              onChange={(event) => setTripName(event.target.value)}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="min-w-0 gap-3">
              <span className="ml-1 text-[11px] font-semibold uppercase text-ink-muted sm:text-sm">Start date</span>
              <span className="flex min-h-12 w-full min-w-0 items-center gap-1.5 rounded-2xl bg-surface-highest px-2 transition-all focus-within:ring-2 focus-within:ring-primary/40 sm:gap-2 sm:px-3">
                <CalendarDays className="hidden shrink-0 text-ink-muted sm:block" size={18} />
                <input
                  className="min-h-0 w-full min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-ink focus:border-transparent focus:ring-0 sm:text-base"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </span>
            </label>

            <label className="min-w-0 gap-3">
              <span className="ml-1 text-[11px] font-semibold uppercase text-ink-muted sm:text-sm">End date</span>
              <span className="flex min-h-12 w-full min-w-0 items-center gap-1.5 rounded-2xl bg-surface-highest px-2 transition-all focus-within:ring-2 focus-within:ring-primary/40 sm:gap-2 sm:px-3">
                <CalendarDays className="hidden shrink-0 text-ink-muted sm:block" size={18} />
                <input
                  className="min-h-0 w-full min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-ink focus:border-transparent focus:ring-0 sm:text-base"
                  type="date"
                  min={startDate}
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </span>
            </label>
          </div>

          <label className="min-w-0 gap-3">
            <span className="ml-1 text-sm font-semibold uppercase text-ink-muted">Total budget</span>
            <span className="flex min-h-12 w-full min-w-0 items-center gap-2 rounded-2xl bg-surface-highest py-2 pl-4 pr-2 transition-all focus-within:ring-2 focus-within:ring-primary/40">
              <input
                className="min-h-0 min-w-0 flex-1 border-0 bg-transparent p-0 font-display text-lg font-bold text-ink placeholder:text-outline focus:border-transparent focus:ring-0 max-[520px]:text-base"
                placeholder="0.00"
                type="number"
                min="0"
                inputMode="decimal"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
              />
              <select
                className="shrink-0 rounded-xl border-0 bg-white py-2 pl-2 pr-7 text-[11px] font-bold text-primary focus:ring-0 sm:pl-3 sm:pr-8 sm:text-xs"
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
              >
                <option value="LAK">LAK</option>
                <option value="THB">THB</option>
                <option value="USD">USD</option>
              </select>
            </span>
          </label>
        </section>

        <p className="px-1 text-center text-xs font-medium leading-relaxed text-ink-muted sm:px-4">
          We'll use this budget to help you track daily spending and alert you if you're over-pacing. You can change
          this at any time.
        </p>

        <button
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-3xl border-0 bg-linear-to-br from-primary to-primary-dim px-5 font-display text-base font-bold text-white shadow-[0_8px_30px_rgb(0,106,113,0.15)] transition-transform duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-16 sm:text-lg"
          type="submit"
          disabled={!tripName.trim() || isSubmitting}
        >
          <PlaneTakeoff size={20} />
          {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Trip"}
        </button>
      </form>
    </section>
  );
}
