import { useMemo } from "react";
import { Coffee, Hotel, LucideIcon, Plus, ReceiptText, ShoppingBag, TrainFront } from "lucide-react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Payment, PaymentGroup } from "../types/finance";
import { currency } from "../utils/currency";
import {
  eachDayInRange,
  formatCreatedAt,
  formatDayLabel,
  formatPaymentWhenLabel,
  getPaymentDayKey,
  splitHotelStayAmount,
} from "../utils/date";

type OverviewPageProps = {
  selectedFund?: PaymentGroup;
  payments: Payment[];
  totalSaved: number;
  remaining: number;
  onAddExpense: () => void;
  onOpenViewALl : () => void;
};

type ExpenseRow = {
  id: string;
  title: string;
  amount: number;
  meta: string;
  status: string;
  category: string;
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
  const title = payment.title;
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
    return "Food";
  }
  return "Others";
};
const budgetCardClass =
  "rounded-3xl bg-white/95 px-5 pb-5 pt-5 text-center shadow-[0_4px_12px_rgba(43,52,54,0.06)] max-[520px]:rounded-[22px] max-[520px]:px-4 max-[520px]:py-5";
const expenseCardClass =
  "grid min-h-16 grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 rounded-[22px] bg-white/95 px-3.5 py-3 shadow-[0_3px_10px_rgba(43,52,54,0.07)] max-[520px]:grid-cols-[40px_minmax(0,1fr)]";
const floatingAddButtonClass =
  "fixed bottom-23 z-30 grid h-13 w-13 place-items-center rounded-full border-0 bg-[#007b80] text-white shadow-[0_7px_16px_rgba(0,106,113,0.24)] transition-transform hover:scale-105 active:scale-95 max-[520px]:right-4 min-[521px]:right-[max(16px,calc((100vw-640px)/2+16px))]";

export function OverviewPage({ selectedFund, payments, totalSaved, remaining, onAddExpense,onOpenViewALl }: OverviewPageProps) {
  const budget = selectedFund?.budget ?? 0;
  const spent = totalSaved || 0;
  const amountRemaining = selectedFund ? remaining : 0;
  const progress = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  const displayExpenses = useMemo<ExpenseRow[]>(() => {
    const filteredPayments = selectedFund
      ? payments.filter((p) => p.groupId === selectedFund.id)
      : payments;

    return filteredPayments.slice(0, 3).map((payment) => {
      const category = getCategory(payment);
      return {
        id: payment.id,
        title: payment.title,
        amount: payment.amount,
        meta: formatPaymentWhenLabel(payment),
        status: payment.note ? "Pending" : "Confirmed",
        category,
      };
    });
  }, [payments, selectedFund]);

  // console.log(selectedFund, 'selectFund')
  // console.log(payments, 'payment')

  const categoryTotals = useMemo(() => {
    const items = [
      { label: "Food", amount: 0, color: "#0f9f8f" },
      { label: "Travel", amount: 0, color: "#007b80" },
      { label: "Shopping", amount: 0, color: "#3e6470" },
      { label: "Hotel", amount: 0, color: "#4f7fb0" },
      { label: "Others", amount: 0, color: "#a7d1f5" },
    ];

    const filteredPayments = selectedFund
      ? payments.filter((p) => p.groupId === selectedFund.id)
      : payments;

    filteredPayments.forEach((payment) => {
      const cat = getCategory(payment);
      const item = items.find((entry) => entry.label === cat);
      if (item) item.amount += payment.amount;
      else items[items.length - 1].amount += payment.amount;
    });

    const total = items.reduce((sum, item) => sum + item.amount, 0);
    let remainingPct = 100;
    const breakdown = items.map((item, index) => {
      const percent =
        total === 0 ? 0 : index === items.length - 1 ? remainingPct : Math.round((item.amount / total) * 100);
      remainingPct -= percent;
      return { ...item, percent };
    });

    const pieData =
      total === 0
        ? [{ name: "No spending", value: 1, amount: 0, percent: 0, color: "#edf4f6" }]
        : breakdown.map((item) => ({
          name: item.label,
          value: item.amount,
          amount: item.amount,
          percent: item.percent,
          color: item.color,
        }));

    return { total, breakdown, pieData };
  }, [payments, selectedFund]);

  const dailySpending = useMemo(() => {
    if (!selectedFund?.startDate || !selectedFund?.endDate) return [];

    const tripDays = eachDayInRange(selectedFund.startDate, selectedFund.endDate);
    const totals = new Map<string, number>();

    payments
      .filter((payment) => payment.groupId === selectedFund.id)
      .forEach((payment) => {
        if (payment.category === "Hotel" && payment.checkIn && payment.checkOut) {
          splitHotelStayAmount(payment.amount, payment.checkIn, payment.checkOut).forEach(
            (share, dayKey) => {
              totals.set(dayKey, (totals.get(dayKey) ?? 0) + share);
            },
          );
          return;
        }

        const dayKey = getPaymentDayKey(payment);
        if (!dayKey) return;
        totals.set(dayKey, (totals.get(dayKey) ?? 0) + payment.amount);
      });

    return tripDays.map((dayKey) => ({
      dayKey,
      label: formatDayLabel(dayKey),
      amount: totals.get(dayKey) ?? 0,
    }));
  }, [payments, selectedFund]);

  const maxDailyAmount = dailySpending.reduce((max, day) => Math.max(max, day.amount), 0);

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
        <p className="mb-4 text-sm font-black text-[#162225]">Spending by Category</p>
        <div className="flex items-center gap-4">
          <div className="relative h-30 w-30 shrink-0">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={categoryTotals.pieData}
                  cx={55}
                  cy={55}
                  innerRadius={35}
                  outerRadius={55}
                  dataKey="value"
                  strokeWidth={0}
                  isAnimationActive
                  animationBegin={120}
                  animationDuration={900}
                  animationEasing="ease-out"
                >
                  {categoryTotals.total > 0 &&
                    categoryTotals.pieData.map((entry, index) => (
                      <Cell key={`${entry.name}-${index}`} fill={entry.color} />
                    ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-[10px] font-bold text-[#566164]">Total</p>
              <p className="max-w-18 truncate text-xs font-black text-[#162225]">
                {currency.format(categoryTotals.total, selectedFund?.currency)}
              </p>
            </div>
          </div>

          {/* <div className="flex min-w-0 flex-1 flex-col gap-2">
            {categoryTotals.breakdown.map((item) => (
              item.amount > 0 && (
                <div
                  className="flex items-center justify-between gap-2 transition-transform duration-200 hover:translate-x-1"
                  key={item.label}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="truncate text-xs font-bold text-[#566164]">{item.label}</span>
                  </div>
                  <span className="shrink-0 text-xs font-black text-[#162225]">
                    {currency.format(item.amount, selectedFund?.currency)}
                  </span>
                </div>
              )))}
          </div> */}

          {categoryTotals.total > 0 ? (
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              {categoryTotals.breakdown?.map((item) => (
                item.amount > 0 && (

                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-2 transition-transform duration-200 hover:translate-x-1"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="truncate text-xs font-bold text-[#566164]">
                        {item.label}
                      </span>
                    </div>

                    <span className="shrink-0 text-xs font-black text-[#162225]">
                      {currency.format(item.amount, selectedFund?.currency)}
                    </span>
                  </div>
                )
              ))}
            </div>
          ) : (
            <div
              className="flex items-center justify-between gap-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: 'gray' }}
                />
                <span className="truncate text-xs font-bold text-gray-400">
                  ADD YOUR EXPENSE
                </span>
              </div>
            </div>
          )}
        </div>
      </article>

      <div className="-mb-1 flex items-center justify-between gap-3 px-1">
        <h2 className="font-display text-[clamp(1rem,3.5vw,1.15rem)] font-black text-[#162225]">Recent Expenses</h2>
        <button className="border-0 bg-transparent text-xs font-black text-primary" type="button" onClick={onOpenViewALl}>
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

      <article className="relative rounded-3xl bg-white/95 p-4 shadow-[0_4px_12px_rgba(43,52,54,0.06)] max-[520px]:rounded-[22px]">
        <p className="mb-1 text-sm font-black text-[#162225]">Daily Spending</p>
        <p className="mb-3 text-xs font-semibold text-[#566164]">
          {selectedFund?.startDate && selectedFund?.endDate
            ? `${selectedFund.startDate} — ${selectedFund.endDate}`
            : "Add trip dates to see daily spending"}
        </p>

        {dailySpending.length > 0 ? (
          <div className="max-h-72 overflow-y-auto pr-1">
            <ResponsiveContainer width="100%" height={Math.max(180, dailySpending.length * 34)}>
              <BarChart
                data={dailySpending}
                layout="vertical"
                margin={{ top: 4, right: 8, left: 4, bottom: 4 }}
              >
                <XAxis type="number" hide domain={[0, maxDailyAmount || 1]} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={52}
                  tick={{ fill: "#566164", fontSize: 11, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0,123,128,0.08)" }}
                  formatter={(value: number) =>
                    currency.format(value, selectedFund?.currency)
                  }
                  labelFormatter={(label) => String(label)}
                />
                <Bar dataKey="amount" radius={[0, 8, 8, 0]} maxBarSize={16}>
                  {dailySpending.map((entry) => (
                    <Cell
                      key={entry.dayKey}
                      fill={entry.amount > 0 ? "#007b80" : "#dce7ea"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="rounded-2xl bg-surface-low py-8 text-center text-sm font-semibold text-[#566164]">
            No trip dates to chart yet.
          </p>
        )}

        <button className={floatingAddButtonClass} type="button" aria-label="Add expense" onClick={onAddExpense}>
          <Plus size={22} />
        </button>
      </article>
    </section>
  );
}
