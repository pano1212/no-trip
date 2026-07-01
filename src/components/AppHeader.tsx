import { BabyIcon, Menu, PersonStanding, User2Icon } from "lucide-react";
import { Payment, PaymentGroup, PaymentGroupWithTotal } from "../types/finance";

type AppHeaderProps = {
  onOpenSidebar: () => void;
  onOpenProfile: () => void;
  fund?: PaymentGroup;
};
export function AppHeader({ onOpenSidebar, onOpenProfile, fund }: AppHeaderProps) {

  return (
    <header className="mb-4 flex h-12 items-center justify-between gap-3">
      <button
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-0 bg-transparent text-primary"
        type="button"
        aria-label="Open saved history"
        onClick={onOpenSidebar}
      >
        <Menu size={25} />
      </button>
      <h1 className="flex-1 font-display text-[clamp(1.25rem,4vw,1.55rem)] font-black leading-none text-primary">
        {fund?.name}
      </h1>

      <button
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-0 bg-transparent text-primary"
        type="button"
        aria-label="Open saved history"
        onClick={onOpenProfile}
      >
        <User2Icon size={25} />
      </button>

    </header>
  );
}
