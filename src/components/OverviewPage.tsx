import { useMemo } from "react";
import { Bed, Coffee, Plus, ReceiptText, TrainFront } from "lucide-react";
import { Payment, PaymentGroup } from "../types/finance";
import { currency } from "../utils/currency";

type OverviewPageProps = {
  selectedFund?: PaymentGroup;
  payments: Payment[];
  totalSaved: number;
  remaining: number;
  onAddExpense: () => void;
};

type ExpenseRow = {
  id: string;
  title: string;
  amount: number;
  meta: string;
  status: string;
  category: "Travel" | "Dining" | "Others";
};

const categoryIcons = {
  Travel: TrainFront,
  Dining: Coffee,
  Others: ReceiptText,
};

const getCategory = (title: string): "Travel" | "Dining" | "Others" => {
  const t = title.toLowerCase();
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
    return "Dining";
  }
  return "Others";
};
const budgetCardClass =
  "rounded-3xl bg-white/95 px-5 pb-5 pt-5 text-center shadow-[0_4px_12px_rgba(43,52,54,0.06)] max-[520px]:rounded-[22px] max-[520px]:px-4 max-[520px]:py-5";
const expenseCardClass =
  "grid min-h-16 grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 rounded-[22px] bg-white/95 px-3.5 py-3 shadow-[0_3px_10px_rgba(43,52,54,0.07)] max-[520px]:grid-cols-[40px_minmax(0,1fr)]";
const allowanceCardClass =
  "relative grid min-h-24 grid-cols-[minmax(0,1fr)_96px] items-center gap-4 rounded-3xl bg-surface-low py-4 pl-4 pr-16 max-[520px]:grid-cols-1 max-[520px]:rounded-[22px] max-[520px]:pr-14";
const floatingAddButtonClass =
  "fixed bottom-23 z-30 grid h-13 w-13 place-items-center rounded-full border-0 bg-[#007b80] text-white shadow-[0_7px_16px_rgba(0,106,113,0.24)] transition-transform hover:scale-105 active:scale-95 max-[520px]:right-4 min-[521px]:right-[max(16px,calc((100vw-640px)/2+16px))]";

export function OverviewPage({ selectedFund, payments, totalSaved, remaining, onAddExpense }: OverviewPageProps) {
  const budget = selectedFund?.budget ?? 0;
  const spent = totalSaved || 0;
  const amountRemaining = selectedFund ? remaining : 0;
  const progress = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  const displayExpenses = useMemo<ExpenseRow[]>(() => {
    return payments.slice(0, 3).map((payment) => {
      const category = getCategory(payment.title);
      return {
        id: payment.id,
        title: payment.title,
        amount: payment.amount,
        meta: `${payment.date} • ${payment.paidBy}`,
        status: payment.note ? "Pending" : "Confirmed",
        category,
      };
    });
  }, [payments]);

  const categoryTotals = useMemo(() => {
    let travel = 0;
    let dining = 0;
    let others = 0;

    payments.forEach((payment) => {
      const cat = getCategory(payment.title);
      if (cat === "Travel") travel += payment.amount;
      else if (cat === "Dining") dining += payment.amount;
      else others += payment.amount;
    });

    const total = travel + dining + others;
    if (total === 0) {
      return { travelPct: 0, diningPct: 0, othersPct: 0 };
    }

    const travelPct = Math.round((travel / total) * 100);
    const diningPct = Math.round((dining / total) * 100);
    const othersPct = 100 - travelPct - diningPct;

    return { travelPct, diningPct, othersPct };
  }, [payments]);

  return (
    <section className="grid gap-4">
      <article className={budgetCardClass}>
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[#9ba2a5]">Amount Remaining</p>
        <strong className="mt-1.5 block wrap-anywhere text-[clamp(1.95rem,8vw,2.45rem)] font-black leading-none text-[#00747b]">
          {currency.format(amountRemaining, selectedFund?.currency)}
        </strong>

        <div className="mt-4 grid grid-cols-2 border-t border-[#e2e8ea] pt-3.5">
          <div className="border-r border-[#e2e8ea]">
            <span className="block text-[0.7rem] font-black uppercase tracking-[0.04em] text-[#9ba2a5]">
              Total Budget
            </span>
            <b className="mt-1.5 block text-[clamp(1rem,3.5vw,1.2rem)] font-extrabold text-[#1f292c]">
              {currency.format(budget, selectedFund?.currency)}
            </b>
          </div>
          <div>
            <span className="block text-[0.7rem] font-black uppercase tracking-[0.04em] text-[#9ba2a5]">Spent</span>
            <b className="mt-1.5 block text-[clamp(1rem,3.5vw,1.2rem)] font-extrabold text-[#a52727]">
              {currency.format(spent, selectedFund?.currency)}
            </b>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#dce7ea]" aria-hidden="true">
          <span className="block h-full rounded-[inherit] bg-[#007b80]" style={{ width: `${progress}%` }} />
        </div>
      </article>

      <article className="rounded-3xl bg-white/95 p-4 shadow-[0_4px_12px_rgba(43,52,54,0.06)] max-[520px]:rounded-[22px]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-[clamp(1rem,3.5vw,1.15rem)] font-black text-[#162225]">
            Category Breakdown
          </h2>
          <span className="text-xs font-black uppercase text-primary">
            {new Date().toLocaleString("en-US", { month: "long" })}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-[92px_minmax(0,1fr)] items-center gap-4 max-[520px]:grid-cols-1 max-[520px]:justify-items-center">
          <div
            className="grid aspect-square w-22 place-items-center rounded-full before:col-start-1 before:row-start-1 before:aspect-square before:w-[72%] before:rounded-full before:bg-white before:content-['']"
            aria-label={`Travel ${categoryTotals.travelPct}%, Dining ${categoryTotals.diningPct}%, Others ${categoryTotals.othersPct}%`}
            style={{
              background:
                categoryTotals.travelPct === 0 && categoryTotals.diningPct === 0 && categoryTotals.othersPct === 0
                  ? "#edf4f6"
                  : `conic-gradient(#007b80 0 ${categoryTotals.travelPct}%, #3e6470 ${categoryTotals.travelPct}% ${categoryTotals.travelPct + categoryTotals.diningPct}%, #a7d1f5 ${categoryTotals.travelPct + categoryTotals.diningPct}% 100%)`
            }}
          >
            <span className="z-1 col-start-1 row-start-1 text-sm font-black text-[#007b80]">
              {categoryTotals.travelPct}%
            </span>
          </div>
          <div className="grid gap-2.5 max-[520px]:w-full">
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#007b80]" />
              <p className="text-sm font-bold text-[#182326]">Travel</p>
              <strong className="text-sm font-bold text-[#182326]">{categoryTotals.travelPct}%</strong>
            </div>
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
              <p className="text-sm font-bold text-[#182326]">Dining</p>
              <strong className="text-sm font-bold text-[#182326]">{categoryTotals.diningPct}%</strong>
            </div>
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#a7d1f5]" />
              <p className="text-sm font-bold text-[#182326]">Others</p>
              <strong className="text-sm font-bold text-[#182326]">{categoryTotals.othersPct}%</strong>
            </div>
          </div>
        </div>
      </article>

      <div className="-mb-1 flex items-center justify-between gap-3 px-1">
        <h2 className="font-display text-[clamp(1rem,3.5vw,1.15rem)] font-black text-[#162225]">Recent Expenses</h2>
        <button className="border-0 bg-transparent text-xs font-black text-primary" type="button" onClick={onAddExpense}>
          View All
        </button>
      </div>

      <div className="grid gap-2.5">
        {displayExpenses.map((expense) => {
          const Icon = categoryIcons[expense.category] ?? ReceiptText;

          return (
            <article className={expenseCardClass} key={expense.id}>
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf4f6] text-[#007b80]">
                <Icon size={17} />
              </div>
              <div className="flex justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#152124]">{expense.title}</h3>
                  <p className="mt-0.5 text-xs font-semibold text-[#566164]">{expense.meta}</p>
                </div>

                <div>
                  <strong className="block whitespace-nowrap text-sm font-black text-[#162225]">
                    -{currency.format(expense.amount, selectedFund?.currency).replace("-", "")}
                  </strong>
                  <span className="mt-0.5 block text-[0.66rem] font-black uppercase tracking-[0.04em] text-[#566164]">
                    {expense.status}
                  </span>
                </div>

              </div>

            </article>
          );
        })}
        {!displayExpenses.length && (
          <p className="text-center text-sm font-semibold text-[#566164] py-6 rounded-2xl bg-white/50">
            No recent expenses saved.
          </p>
        )}
      </div>

      <article className={allowanceCardClass}>
        <div>
          <span className="block text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#566164]">
            Daily Allowance
          </span>
          <strong className="mt-1.5 inline-block text-xl font-black text-[#00747b]">
            {currency.format(Math.max(amountRemaining / 10, 0), selectedFund?.currency)}
          </strong>
          <p className="ml-1.5 inline-block text-[#566164] text-xs">remaining today</p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#d1e0e4]" aria-hidden="true">
          <span className="block h-full w-2/3 rounded-[inherit] bg-secondary" />
        </div>
        <button className={floatingAddButtonClass} type="button" aria-label="Add expense" onClick={onAddExpense}>
          <Plus size={22} />
        </button>
      </article>
    </section>
  );
}
