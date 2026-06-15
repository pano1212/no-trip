import { FormEvent, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { NewPayment, Payment, PaymentGroup } from "../types/finance";
import { currency } from "../utils/currency";

type PaymentPanelProps = {
  selectedFund?: PaymentGroup;
  selectedFundId: string;
  payments: Payment[];
  totalSaved: number;
  defaultDate: string;
  onCreatePayment: (payment: NewPayment) => Promise<void>;
  onRemovePayment: (paymentId: string) => Promise<void>;
};

const primaryButtonClass =
  "inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg border-0 bg-gradient-to-br from-primary to-primary-dim px-4 font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50";

export function PaymentPanel({
  selectedFund,
  selectedFundId,
  payments,
  totalSaved,
  defaultDate,
  onCreatePayment,
  onRemovePayment,
}: PaymentPanelProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [note, setNote] = useState("");

  const submitPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFundId || !title.trim() || !amount) return;

    await onCreatePayment({
      groupId: selectedFundId,
      title: title.trim(),
      amount: Number(amount),
      paidBy: paidBy.trim() || "Me",
      date,
      note: note.trim(),
    });
    setTitle("");
    setAmount("");
    setNote("");
  };

  const categories = [
    "Food",
    "Travel",
    "Shopping",
    "Hotel",
  ];

  const [category, setCategory] = useState("Food");

  return (
    <section className="mx-auto max-w-md bg-white px-6 py-4">
      <div className="mb-8 text-center">
        <p className="mb-2 text-xs tracking-[0.2em] text-gray-500">
          AMOUNT
        </p>

        <div className="flex items-center justify-center gap-2">
          <span className="text-4xl font-semibold text-primary">$</span>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="
        w-52
        border-0
        bg-transparent
        text-center
        text-6xl
        font-bold
        text-slate-300
        outline-none
      "
          />
        </div>

        {selectedFund && (
          <div className="mx-auto mt-4 inline-flex rounded-full bg-slate-100 px-5 py-2 text-sm">
            This will leave{" "}
            <span className="mx-1 font-semibold text-primary">
              {currency.format(
                selectedFund.budget - totalSaved - Number(amount || 0),
                selectedFund.currency
              )}
            </span>
            in your budget
          </div>
        )}
      </div>
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-semibold">
            Category
          </h3>

          <button className="text-primary">
            View All
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`flex h-28 w-24 shrink-0 flex-col items-center justify-center rounded-3xl transition
          ${category === item
                  ? "bg-cyan-300 text-primary"
                  : "bg-slate-100"
                }
        `}
            >
              <span className="mb-2 text-xl">🍴</span>
              <span>{item}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 rounded-3xl bg-slate-100 p-5">
        <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">
          title
        </p>

        <input type="text" className="w-full bg-transparent text-xl outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="title..." />

      </div>

      <div className="mb-4 rounded-3xl bg-slate-100 p-5">
        <p className="mb-2 text-xs uppercase tracking-widest text-slate-500">
          Account
        </p>

        <select className="w-full bg-transparent text-xl outline-none">
          <option>Cash (USD)</option>
        </select>
      </div>


      <div className="mb-4 rounded-3xl bg-slate-100 p-5">
        <input
          type="datetime-local"
          className="w-full bg-transparent text-lg outline-none"
        />
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

      <button className="bg-red-500">

      </button>

      <form onSubmit={submitPayment}>

        <button
          type="submit"
          className="fixed bottom-6 left-4 right-4 bg-red-600 text-white"
        >
          Save Expense →
        </button>
      </form>
    </section>
  );
}
