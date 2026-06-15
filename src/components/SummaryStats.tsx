import { CreditCard, Map, ReceiptText } from "lucide-react";
import { PaymentGroup } from "../types/finance";
import { currency } from "../utils/currency";
import { StatCard } from "./StatCard";

type SummaryStatsProps = {
  allSaved: number;
  remaining: number;
  selectedGroup?: PaymentGroup;
};

export function SummaryStats({ allSaved, remaining, selectedGroup }: SummaryStatsProps) {
  return (
    <section className="mb-3.5 grid grid-cols-3 gap-3.5 max-[640px]:grid-cols-1">
      <StatCard label="All saved" value={currency.format(allSaved, selectedGroup?.currency)} icon={<CreditCard />} />
      <StatCard label="Active fund" value={selectedGroup?.name ?? "No fund yet"} icon={<ReceiptText />} />
      <StatCard label="Still needed" value={currency.format(remaining, selectedGroup?.currency)} icon={<Map />} />
    </section>
  );
}
