import { ReceiptText } from "lucide-react";
import { currency } from "../utils/currency";
import { formatCreatedAt } from "../utils/date";
import { Payment, PaymentGroupWithTotal } from "../types/finance";
import { AppView } from "./BottomBar";

type ViewAllProps = {
  funds: PaymentGroupWithTotal[];
  payments: Payment[];
  onSelectFund: (fundId: string) => void;
  onChangeView: (view: AppView) => void;
};

export default function ViewAll({
  funds,
  payments,
  onSelectFund,
  onChangeView,
}: ViewAllProps) {
  const openPayment = (payment: Payment) => {
    onSelectFund(payment.groupId);
    onChangeView("expenses");
  };


  return (
    <main className="mx-auto max-w-3xl p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-black text-ink">All Payments</h1>
        <p className="text-sm text-ink-muted">
          {payments.length} payment{payments.length !== 1 ? "s" : ""}
        </p>
      </header>

      <section className="grid gap-2">
        {payments.map((payment) => (
          <button
            key={payment.id}
            type="button"
            onClick={() => openPayment(payment)}
            className="grid gap-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <ReceiptText size={18} />
              <strong className="truncate">{payment.title}</strong>
            </div>

            <div className="flex items-center justify-between text-sm text-ink-muted">
              <span>{formatCreatedAt(payment.createdAt)}</span>

              <span className="font-bold">
                {currency.format(
                  payment.amount,
                  payment.currency ??
                    funds.find((f) => f.id === payment.groupId)?.currency
                )}
              </span>
            </div>
          </button>
        ))}

        {!payments.length && (
          <div className="rounded-xl border border-dashed p-8 text-center text-ink-muted">
            No saved payments yet.
          </div>
        )}
      </section>
    </main>
  );
}