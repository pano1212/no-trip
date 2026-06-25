import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, Camera, CalendarDays, ChartNoAxesColumn, PlaneTakeoff } from "lucide-react";
import { NewPaymentGroup, PaymentGroup, PaymentGroupWithTotal } from "../types/finance";
import { currency as formatCurrency } from "../utils/currency";
import { getDateOffsetInputValue, getTodayInputValue } from "../utils/date";
import { PageHeader } from "./BackButton";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../lib/firebase";

type FundPanelProps = {
  funds: PaymentGroupWithTotal[];
  selectedFundId: string;
  onCreateFund: (fund: NewPaymentGroup) => Promise<void>;
  onSelectFund: (fundId: string) => void;
  onClose: () => void;
};

const coverImageUrl =
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80";

export function FundPanel({ onCreateFund, onClose }: FundPanelProps) {
  const [tripName, setTripName] = useState("");
  const [imageUrl, setImageUrl] = useState('');
  const [file, setfile] = useState<File | null>(null);
  const [dateRange, setDateRange] = useState("");
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("LAK");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numericBudget = Number(budget) || 0;
  const dailyAllowance = useMemo(() => numericBudget / 10, [numericBudget]);

  const submitTrip = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = tripName.trim();
    if (!trimmedName) return;

    // if (!file) {
    //   return;
    // }

    // const imageRef = ref(
    //   storage,
    //   `trip-covers/${Date.now()}-${file?.name}`
    // );

    // await uploadBytes(imageRef, file);

    // const Url = await getDownloadURL(imageRef);

    setIsSubmitting(true);
    try {
      await onCreateFund({
        type: "trip",
        name: trimmedName,
        budget: numericBudget,
        startDate: getTodayInputValue(),
        endDate: getDateOffsetInputValue(10),
        imageUrl: imageUrl.trim() || coverImageUrl,
        currency,
      });
      setTripName("");
      setImageUrl('');
      setfile(null);
      setDateRange("");
      setBudget("");
      onClose?.();
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setfile(file);
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
  };

  return (
    <section className="mx-5 min-h-screen bg-surface text-ink max-[520px]:-mx-4">
      <PageHeader
        title={'Create New Trip'}
        onBack={onClose} />

      <form id="create-trip-form" className="mx-auto grid max-w-2xl gap-8 px-6" onSubmit={submitTrip}>
        <section className="grid gap-3">
          <div className="grid gap-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Start your journey</p>
            {/* <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">Design Your Adventure</h2> */}
          </div>

          <label
            htmlFor="cover-upload"
            className="group relative block h-48 w-full cursor-pointer overflow-hidden rounded-3xl bg-surface-high transition-transform duration-300 active:scale-[0.98]"
          >
            <input
              id="cover-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            <img
              alt="Trip cover"
              className="h-full w-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
              src={imageUrl.trim() || coverImageUrl}
            />

            <div className="absolute inset-0 bg-linear-to-t from-ink/40 to-transparent" />

            <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur-md">
              <Camera size={14} />
              <span className="text-xs font-semibold">Change Cover</span>
            </div>
          </label>
        </section>

        <section className="grid gap-8">
           <label className="gap-3">
            <span className="ml-1 text-sm font-semibold uppercase text-ink-muted">Cover image URL</span>
            <input
              className="min-h-14 rounded-2xl border-0 bg-surface-highest px-5 text-ink placeholder:text-outline focus:border-transparent focus:ring-2 focus:ring-primary/40"
              placeholder="https://example.com/trip-cover.jpg"
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
            />
          </label>


          <label className="gap-3">
            <span className="ml-1 text-sm font-semibold uppercase text-ink-muted">Trip name</span>
            <input
              className="min-h-14 rounded-2xl border-0 bg-surface-highest px-5 text-ink placeholder:text-outline focus:border-transparent focus:ring-2 focus:ring-primary/40"
              placeholder="e.g., Japan Winter 2026"
              value={tripName}
              onChange={(event) => setTripName(event.target.value)}
            />
          </label>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <label className="gap-3">
              <span className="ml-1 text-sm font-semibold uppercase text-ink-muted">Dates</span>
              <span className="flex min-h-14 items-center gap-3 rounded-2xl bg-surface-highest px-5 transition-all focus-within:ring-2 focus-within:ring-primary/40">
                <CalendarDays className="text-ink-muted" size={20} />
                <input
                  className="min-h-0 border-0 bg-transparent p-0 text-ink placeholder:text-outline focus:border-transparent focus:ring-0"
                  placeholder="Jan 12 - Jan 22"
                  value={dateRange}
                  onChange={(event) => setDateRange(event.target.value)}
                />
              </span>
            </label>

            <label className="gap-3">
              <span className="ml-1 text-sm font-semibold uppercase text-ink-muted">Total budget</span>
              <span className="flex min-h-14 items-center gap-3 rounded-2xl bg-surface-highest py-2 pl-5 pr-2 transition-all focus-within:ring-2 focus-within:ring-primary/40">
                <input
                  className="min-h-0 w-full border-0 bg-transparent p-0 font-display text-lg font-bold text-ink placeholder:text-outline focus:border-transparent focus:ring-0"
                  placeholder="0.00"
                  type="number"
                  min="0"
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                />
                <select
                  className="rounded-xl border-0 bg-white py-2 pl-3 pr-8 text-xs font-bold text-primary focus:ring-0"
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                >
                  <option value="LAK">LAK (Kip)</option>
                  <option value="THB">THB (Baht)</option>
                  <option value="USD">USD</option>
                </select>
              </span>
            </label>
          </div>

          <div className="grid gap-4 rounded-3xl bg-[#c7e8f6]/40 p-6">
            <div className="flex items-end justify-between gap-4">
              <div className="grid gap-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#375662]">Estimated Daily Allowance</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-extrabold text-[#375662]">
                    {formatCurrency.format(dailyAllowance || 0, currency)}
                  </span>
                  <span className="text-sm text-[#375662]/70">/ day</span>
                </div>
              </div>
              <div className="rounded-2xl bg-white/40 p-3 text-primary backdrop-blur-sm">
                <ChartNoAxesColumn size={24} />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex justify-between px-1 text-[10px] font-bold text-[#375662]/60">
                <span>10 DAYS TOTAL</span>
                <span>SMART SPEND MODE</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-variant/50">
                <div className="h-full w-1/3 rounded-full bg-linear-to-br from-primary to-primary-dim" />
              </div>
            </div>
          </div>
        </section>

        <p className="px-8 text-center text-xs font-medium leading-relaxed text-ink-muted">
          We'll use this budget to help you track daily spending and alert you if you're over-pacing. You can change
          this at any time.
        </p>
      </form>

      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-6">
        <button
          className="flex min-h-16 w-full items-center justify-center gap-2 rounded-3xl border-0 bg-linear-to-br from-primary to-primary-dim px-5 font-display text-lg font-bold text-white shadow-[0_8px_30px_rgb(0,106,113,0.15)] transition-transform duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          form="create-trip-form"
          disabled={!tripName.trim() || isSubmitting}
        >
          <PlaneTakeoff size={20} />
          {isSubmitting ? "Creating..." : "Create Trip"}
        </button>
      </div>
    </section>
  );
}
