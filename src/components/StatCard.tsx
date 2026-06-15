import { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  icon: ReactNode;
};

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <article className="min-h-32 rounded-lg bg-white/85 p-4.5">
      <div className="grid h-9.5 w-9.5 place-items-center rounded-lg bg-surface-high text-primary [&_svg]:w-5">{icon}</div>
      <span className="my-3.5 mb-1.5 block text-[0.92rem] text-ink-muted">{label}</span>
      <strong className="block wrap-anywhere text-[clamp(1.2rem,2vw,1.7rem)]">{value}</strong>
    </article>
  );
}
