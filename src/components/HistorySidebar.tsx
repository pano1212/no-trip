import { LogOut, Plus, ReceiptText, WalletCards, X } from "lucide-react";
import { AppView } from "./BottomBar";
import { Payment, PaymentGroupWithTotal } from "../types/finance";
import { currency } from "../utils/currency";
import { formatCreatedAt } from "../utils/date";

type HistorySidebarProps = {
  isOpen: boolean;
  funds: PaymentGroupWithTotal[];
  payments: Payment[];
  selectedFundId: string;
  onClose: () => void;
  onCreateExpense: () => void;
  onSelectFund: (fundId: string) => void;
  onChangeView: (view: AppView) => void;
  onLogout: () => Promise<void> | void;
};

export function HistorySidebar({
  isOpen,
  funds,
  payments,
  selectedFundId,
  onClose,
  onCreateExpense,
  onSelectFund,
  onChangeView,
  onLogout,
}: HistorySidebarProps) {
  const recentPayments = payments.slice(0, 8);

  const openFund = (fundId: string) => {
    onSelectFund(fundId);
    onChangeView("home");
    onClose();
  };

  const openPayment = (payment: Payment) => {
    onSelectFund(payment.groupId);
    onChangeView("expenses");
    onClose();
  };

  return (
    <>
      <button
        className={`fixed inset-0 z-30 bg-black/20 transition-opacity min-[960px]:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        type="button"
        aria-label="Close history"
        onClick={onClose}
      />

      <aside
        className={`fixed bottom-0 left-0 top-0 z-40 grid w-73 grid-rows-[auto_auto_1fr_auto] border-r border-black/5 bg-surface/95 px-3 py-4 shadow-[12px_0_32px_rgba(43,52,54,0.12)] backdrop-blur-2xl transition-transform duration-200 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        aria-label="Saved history"
      >
        <div className="mb-3 flex items-center justify-between gap-3 px-2">
          <div>
            <p className="text-[0.72rem] font-black uppercase tracking-widest text-ink-muted">Saved history</p>
            <h2 className="font-display text-xl font-black text-primary">The Fluid Ledger</h2>
          </div>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border-0 bg-white text-ink-muted"
            type="button"
            aria-label="Close history"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* <button
          className="mb-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary/10 bg-white px-3 font-black text-primary shadow-[0_4px_12px_rgba(43,52,54,0.05)]"
          type="button"
          onClick={() => {
            onCreateExpense();
            onClose();
          }}
        >
          <Plus size={18} />
          New expense
        </button> */}

        <div className="min-h-0 overflow-y-auto pr-1">
          <section className="grid gap-1">
            <p className="px-2 pb-1 text-xs font-black uppercase tracking-widest text-ink-muted">Funds</p>
            {funds.map((fund) => (
              <button
                key={fund.id}
                className={`grid gap-1 rounded-xl px-3 py-2.5 text-left ${selectedFundId === fund.id ? "bg-primary text-white" : "bg-transparent text-ink hover:bg-white"
                  }`}
                type="button"
                onClick={() => openFund(fund.id)}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <WalletCards size={16} />
                  <strong className="truncate text-sm">{fund.name}</strong>
                </span>
                <span className={`text-xs font-bold ${selectedFundId === fund.id ? "text-white/75" : "text-ink-muted"}`}>
                  {fund.type === "month" ? "Monthly fund" : "Trip fund"} · {currency.format(fund.total, fund.currency)}
                </span>
              </button>
            ))}
            {!funds.length && <p className="px-3 py-2 text-sm font-bold text-ink-muted">No saved funds yet.</p>}
          </section>

          {/* <section className="mt-6 grid gap-1">
            <p className="px-2 pb-1 text-xs font-black uppercase tracking-widest text-ink-muted">Recent payments</p>
            {recentPayments.map((payment) => (
              <button
                key={payment.id}
                className="grid gap-1 rounded-xl px-3 py-2.5 text-left text-ink hover:bg-white"
                type="button"
                onClick={() => openPayment(payment)}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <ReceiptText size={16} />
                  <strong className="truncate text-sm">{payment.title}</strong>
                </span>
                <span className="text-xs font-bold text-ink-muted">
                  {formatCreatedAt(payment.createdAt)} · {currency.format(payment.amount, payment.currency || funds.find((f) => f.id === payment.groupId)?.currency)}
                </span>
              </button>
            ))}
            {!recentPayments.length && <p className="px-3 py-2 text-sm font-bold text-ink-muted">No saved payments yet.</p>}
          </section> */}
        </div>

        <div className="mt-4 border-t border-black/5 pt-3">
          <button
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-0 bg-danger/10 px-3 font-black text-danger hover:bg-danger/15"
            type="button"
            aria-label="Log out"
            onClick={async () => {
              onClose();
              await onLogout();
            }}
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>

      </aside>
    </>
  );
}
