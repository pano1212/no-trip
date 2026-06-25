import { FormEvent, useEffect, useState } from "react";
import { Hotel, Pen, Plane, ShoppingBag, Utensils, Wallet } from "lucide-react";
import { NewPayment, Payment, PaymentGroup } from "../types/finance";
import { currency } from "../utils/currency";
import { PageHeader } from "./BackButton";

type PaymentPanelProps = {
  selectedFund?: PaymentGroup;
  selectedFundId: string;
  payments: Payment[];
  totalSaved: number;
  defaultDate: string;
  onCreatePayment: (payment: NewPayment) => Promise<void>;
  onRemovePayment: (paymentId: string) => Promise<void>;
  onClose: () => void;
};

export function PaymentPanel({
  selectedFund,
  selectedFundId,
  payments,
  totalSaved,
  defaultDate,
  onCreatePayment,
  onRemovePayment,
  onClose,
}: PaymentPanelProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [cashCurrency, setCashCurrency] = useState(selectedFund?.currency || "LAK");
  const [category, setCategory] = useState("Food");

  useEffect(() => {
    setCashCurrency(selectedFund?.currency || "LAK");
  }, [selectedFund?.currency]);

  console.log(selectedFund, 'selectedFund')

  const submitPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFundId || !title.trim() || !amount) return;

    await onCreatePayment({
      groupId: selectedFundId,
      title: title.trim(),
      amount: Number(amount),
      category,
      currency: cashCurrency,
      paidBy: `Cash (${cashCurrency})`,
      note: note.trim(),
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

  const cardStyle =
    "mb-5 rounded-[32px] bg-white p-6 shadow-sm";

  return (
    <>
      <header className="mb-4 flex h-12 items-center gap-3">
        <PageHeader title={selectedFund?.name || "New Expense"} onBack={onClose} />
      </header>

      <section className="mx-auto max-w-md bg-white px-6 pb-28 pt-4">
        <div className="mb-8 text-center">
          <p className="mb-4 text-xs tracking-[0.25em] text-slate-500">
            AMOUNT
          </p>

          <div className="flex items-center justify-center">
            <span className="text-4xl font-bold text-primary">
              $
            </span>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="
        w-66
        border-none
        bg-transparent
        text-center
        text-6xl
        font-black
        text-slate-300
        outline-none
      "
            />
          </div>

          <div className="mt-6 inline-flex items-center rounded-full bg-white px-2 py-3 shadow-sm">
            <span className="mr-2">🏦</span>

            <span className="text-slate-600 text-xs" >
              This will leave
            </span>
            {
              selectedFund && (
                <span className=" font-bold text-primary text-sm mx-1">
                  {currency.format(
                    selectedFund?.budget - totalSaved - Number(amount || 0),
                    selectedFund?.currency
                  )}
                </span>
              )
            }


            <span className="text-slate-600 text-xs">
              in your budget
            </span>
          </div>
        </div>
        <div className="mb-4">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">
              Category
            </h2>

            <button className="font-semibold text-primary text-sm">
              View All
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {categories.map((item) => (
              <button
                key={item.name}
                onClick={() => setCategory(item.name)}
                className={`
          flex h-22 w-20 shrink-0 flex-col items-center justify-center rounded-[28px]
          transition-all
          ${category === item.name
                    ? "bg-cyan-300 text-primary shadow-lg"
                    : "bg-white text-slate-600"
                  }
        `}
              >
                <item.icon size={24} />

                <span className="mt-3 text-xs font-semibold uppercase">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={cardStyle}>
          <p className="mb-2 text-xs uppercase tracking-widest text-slate-500 flex">
            <Pen size={15} />
            title
          </p>

          <input type="text" className="w-full bg-transparent text-lg font-medium outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title..." />

        </div>

        <div className={cardStyle}>
          <p className="mb-2 text-xs uppercase tracking-widest text-slate-500 flex">
            <Wallet size={15} />

            Account
          </p>

          <select
            className="w-full bg-transparent text-lg font-medium outline-none"
            value={cashCurrency}
            onChange={(event) => setCashCurrency(event.target.value)}
          >
            <option value="LAK">Cash (LAK)</option>
            <option value="THB">Cash (Baht)</option>
            <option value="USD">Cash (USD)</option>
          </select>
        </div>

        <label
          className="
    mb-8
    flex
    h-40
    cursor-pointer
    flex-col
    items-center
    justify-center
    rounded-3xl
    border-2
    border-dashed
    border-slate-300
  "
        >
          <input
            type="file"
            className="hidden"
          />

          <div className="text-center">
            <div className="mb-3 text-3xl">
              📷
            </div>

            <p className="font-semibold">
              ATTACH RECEIPT
            </p>
          </div>
        </label>

      </section>

      <form onSubmit={submitPayment} className="fixed inset-x-0 bottom-6 z-50 mx-auto max-w-md px-4">
        <button
          type="submit"
          disabled={!selectedFundId || !title.trim() || !amount}
          className="w-full rounded-full bg-linear-to-br from-primary to-primary-dim py-4 text-lg font-bold tracking-wide text-white shadow-xl shadow-primary/30 transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save Expense →
        </button>
      </form>
    </>
  );
}
