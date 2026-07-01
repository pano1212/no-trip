import { Compass, Home, MountainIcon, SearchCheck, User } from "lucide-react";

export type AppView = "home" | "expenses" | "profile" | "trips" | "addtrip" | "viewall";

type BottomBarProps = {
  activeView: AppView;
  onChangeView: (view: AppView) => void;
};

const items = [
  { id: "home", label: "Home", icon: Home },
  { id: "trips", label: "Trips", icon: MountainIcon },
  // { id: "trips", label: "Trips", icon: MountainIcon },
  { id: "profile", label: "Profile", icon: User },
] satisfies Array<{ id: AppView; label: string; icon: typeof Home }>;

export function BottomBar({ activeView, onChangeView }: BottomBarProps) {
  return (
    <nav
      className="fixed bottom-0 z-20 grid grid-cols-3 gap-0 rounded-none bg-white/95 px-4.5 pb-4.5 pt-3 shadow-[0_-2px_10px_rgba(43,52,54,0.06)] left-[max(0px,calc((100vw-640px)/2))] right-[max(0px,calc((100vw-640px)/2))]"
      aria-label="App sections"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;

        return (
          <button
            key={item.id}
            type="button"
            className={`inline-flex min-h-18 min-w-0 flex-col items-center justify-center gap-2 rounded-none border-0 bg-transparent text-[0.84rem] font-black uppercase tracking-widest ${isActive ? "text-[#007b80]" : "text-[#9ea5a7]"}`}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onChangeView(item.id)}
          >
            <Icon className="h-7.5 w-7.5 stroke-3" />
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
