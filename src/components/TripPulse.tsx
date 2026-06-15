import { PaymentGroup } from "../types/finance";
import { currency } from "../utils/currency";

type TripPulseProps = {
  selectedFund?: PaymentGroup;
  totalSaved: number;
  remaining: number;
};

const tripPulseClass = [
  "fixed bottom-[90px] z-[19] grid grid-cols-[minmax(0,auto)_minmax(120px,1fr)] items-center gap-[18px]",
  "rounded-lg bg-surface/70 px-4 py-3.5 shadow-[0_0_32px_rgba(0,106,113,0.1)] backdrop-blur-[20px]",
  "max-[640px]:bottom-[84px] max-[640px]:grid-cols-1 max-[640px]:gap-2.5",
  "max-[640px]:[left:12px] max-[640px]:[right:12px]",
  "[left:max(16px,calc((100vw-1180px)/2+28px))] [right:max(16px,calc((100vw-1180px)/2+28px))]",
].join(" ");

export function TripPulse({ selectedFund, totalSaved, remaining }: TripPulseProps) {
  const budget = selectedFund?.budget ?? 0;
  const progress = budget > 0 ? Math.min((totalSaved / budget) * 100, 100) : 0;

  return (
    <aside className={tripPulseClass} aria-label="Trip pulse">
      <div>
        <span className="block text-[0.78rem] font-extrabold uppercase text-ink-muted">Daily budget remaining</span>
        <strong className="mt-1 block wrap-anywhere text-lg text-ink">{currency.format(remaining, selectedFund?.currency)}</strong>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-surface-variant" aria-hidden="true">
        <span className="block h-full rounded-[inherit] bg-linear-to-br from-tertiary to-secondary" style={{ width: `${progress}%` }} />
      </div>
    </aside>
  );
}
