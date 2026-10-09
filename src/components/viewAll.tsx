import { useMemo } from "react";
import {
  Coffee,
  Hotel,
  LucideIcon,
  ReceiptText,
  ShoppingBag,
  TrainFront,
} from "lucide-react";
import { currency } from "../utils/currency";
import { formatPaymentWhenLabel } from "../utils/date";
import { Payment, PaymentGroup } from "../types/finance";
import { PageHeader } from "./BackButton";

type ViewAllProps = {
  selectedFund?: PaymentGroup;
  payments: Payment[];
  onBack: () => void;
};

const categoryIcons: Record<string, LucideIcon> = {
  Food: Coffee,
  Travel: TrainFront,
  Dining: Coffee,
  Shopping: ShoppingBag,
  Hotel,
  Others: ReceiptText,
};

const getCategory = (payment: Payment): string => {
  if (payment.category) return payment.category;
  const t = payment.title.toLowerCase();
  if (
    t.includes("rail") ||
    t.includes("train") ||
    t.includes("flight") ||
    t.includes("taxi") ||
    t.includes("uber") ||
    t.includes("transport") ||
    t.includes("hotel") ||
    t.includes("lodging") ||
    t.includes("stay") ||
    t.includes("hostel")
  ) {
    return "Travel";
  }
  if (
    t.includes("coffee") ||
    t.includes("starbucks") ||
    t.includes("food") ||
    t.includes("drink") ||
    t.includes("dinner") ||
    t.includes("lunch") ||
    t.includes("cafe") ||
    t.includes("restaurant") ||
    t.includes("meal")
  ) {
    return "Food";
  }
  return "Others";
};

const expenseCardClass =
  "grid min-h-16 grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 rounded-[22px] bg-white/95 px-3.5 py-3 shadow-[0_3px_10px_rgba(43,52,54,0.07)] max-[520px]:grid-cols-[40px_minmax(0,1fr)]";

export default function ViewAll({ selectedFund, payments, onBack }: ViewAllProps) {
  const tripPayments = useMemo(
    () =>
      selectedFund
        ? payments.filter((payment) => payment.groupId === selectedFund.id)
        : [],
    [payments, selectedFund],
  );

  const totalSpent = tripPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <section className="grid gap-4">
      <PageHeader
        title={selectedFund?.name ? `${selectedFund.name} Expenses` : "All Expenses"}
        onBack={onBack}
      />

      <div className="rounded-3xl bg-white/95 px-5 py-4 shadow-[0_4px_12px_rgba(43,52,54,0.06)]">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#9ba2a5]">
          Trip expenses
        </p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <strong className="text-2xl font-black text-[#00747b]">
            {currency.format(totalSpent, selectedFund?.currency)}
          </strong>
          <span className="text-sm font-semibold text-[#566164]">
            {tripPayments.length} item{tripPayments.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="grid gap-2.5">
        {tripPayments.map((payment) => {
          const category = getCategory(payment);
          const Icon = categoryIcons[category] ?? ReceiptText;

          return (
            <article className={expenseCardClass} key={payment.id}>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf4f6] text-[#007b80]">
                <Icon size={17} />
              </div>
              <div className="flex min-w-0 justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-black text-[#152124]">{payment.title}</h3>
                  <p className="mt-0.5 text-xs font-semibold text-[#566164]">
                    {formatPaymentWhenLabel(payment)}
                    {payment.category ? ` · ${payment.category}` : ""}
                  </p>
                  {payment.note ? (
                    <p className="mt-1 truncate text-xs text-[#687477]">{payment.note}</p>
                  ) : null}
                </div>
                <div className="shrink-0 text-right">
                  <strong className="block whitespace-nowrap text-sm font-black text-[#162225]">
                    -{currency.format(payment.amount, payment.currency ?? selectedFund?.currency).replace("-", "")}
                  </strong>
                  <span className="mt-0.5 block text-[0.66rem] font-black uppercase tracking-[0.04em] text-[#566164]">
                    {payment.paidBy || "Confirmed"}
                  </span>
                </div>
              </div>
            </article>
          );
        })}

        {!selectedFund && (
          <p className="rounded-2xl bg-white/50 py-6 text-center text-sm font-semibold text-[#566164]">
            Select a trip to view its expenses.
          </p>
        )}

        {selectedFund && !tripPayments.length && (
          <p className="rounded-2xl bg-white/50 py-6 text-center text-sm font-semibold text-[#566164]">
            No expenses saved for this trip yet.
          </p>
        )}
      </div>
    </section>
  );
}
