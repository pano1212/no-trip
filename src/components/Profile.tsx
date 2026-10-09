import { useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { formatAuthLoginId } from "../utils/authEmail";
import { EditProfilePanel } from "./EditProfilePanel";
import {
  Bell,
  ChevronRight,
  CircleHelp,
  LogOut,
  MapPinned,
  Pencil,
  Settings,
  Wallet,
} from "lucide-react";
import { currency } from "../utils/currency";
import { AppView } from "./BottomBar";

type ProfilePageProps = {
  user: FirebaseUser;
  tripCount: number;
  expenseCount: number;
  totalSpent: number;
  totalBudget: number;
  preferredCurrency?: string;
  onChangeView: (view: AppView) => void;
  onLogout: () => void;
};

export default function ProfilePage({
  user,
  tripCount,
  expenseCount,
  totalSpent,
  totalBudget,
  preferredCurrency,
  onChangeView,
  onLogout,
}: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);

  const profileName = formatAuthLoginId(user.email) || "Traveler";

  if (isEditing) {
    return (
      <EditProfilePanel
        user={user}
        onClose={() => setIsEditing(false)}
        onUpdated={() => setIsEditing(false)}
      />
    );
  }
  const photoUrl = user.photoURL;
  const initials = profileName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <section className="grid gap-4">
      <article className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(145deg,#00747b_0%,#005d63_55%,#3e6470_100%)] px-5 pb-6 pt-6 text-white shadow-[0_8px_24px_rgba(0,106,113,0.22)]">
        <div
          className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 left-8 h-36 w-36 rounded-full bg-white/10"
          aria-hidden="true"
        />

        <p className="relative text-[0.68rem] font-black uppercase tracking-[0.14em] text-white/70">
          Your profile
        </p>

        <div className="relative mt-4 flex items-center gap-4">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={profileName}
              className="h-16 w-16 rounded-full border-2 border-white/80 object-cover shadow-md"
            />
          ) : (
            <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-white/80 bg-white/15 font-display text-xl font-black tracking-wide text-white">
              {initials || "T"}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-[clamp(1.25rem,4vw,1.55rem)] font-black leading-tight">
              {profileName}
            </h1>
            <p className="mt-1 text-xs font-semibold text-white/65">
              {tripCount} trip{tripCount !== 1 ? "s" : ""} · {expenseCount} expense
              {expenseCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-2.5">
          
          <div className="rounded-2xl bg-white/12 px-3.5 py-3 backdrop-blur-[2px]">
            <p className="text-[0.66rem] font-black uppercase tracking-[0.08em] text-white/65">
              Total budget
            </p>
            <strong className="mt-1.5 block wrap-anywhere text-base font-black text-green-500">
              {currency.format(totalBudget, preferredCurrency)}
            </strong>
          </div>
          <div className="rounded-2xl bg-white/12 px-3.5 py-3 backdrop-blur-[2px]">
            <p className="text-[0.66rem] font-black uppercase tracking-[0.08em] text-white/65">
              Total spent
            </p>
            <strong className="mt-1.5 block wrap-anywhere text-base font-black text-yellow-400">
              {currency.format(totalSpent, preferredCurrency)}
            </strong>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-black text-primary shadow-sm transition hover:bg-white active:scale-[0.98]"
        >
          <Pencil size={15} />
          Edit profile
        </button>
      </article>

      <div className="grid gap-2">
        <p className="px-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#9ba2a5]">
          Account
        </p>
        <div className="overflow-hidden rounded-[22px] bg-white/95 shadow-[0_3px_10px_rgba(43,52,54,0.07)]">
          <ProfileItem
            title="My trips"
            subtitle="Browse and open trips"
            icon={MapPinned}
            onClick={() => onChangeView("trips")}
          />
          <ProfileItem
            title="Current trip budget"
            subtitle="Home overview & remaining"
            icon={Wallet}
            onClick={() => onChangeView("home")}
          />
          <ProfileItem
            title="Notifications"
            subtitle="Trip and expense alerts"
            icon={Bell}
          />
          <ProfileItem
            title="Settings"
            subtitle="Currency, privacy, display"
            icon={Settings}
            last
          />
        </div>
      </div>

      <div className="grid gap-2">
        <p className="px-1 text-[0.68rem] font-black uppercase tracking-[0.12em] text-[#9ba2a5]">
          Support
        </p>
        <div className="overflow-hidden rounded-[22px] bg-white/95 shadow-[0_3px_10px_rgba(43,52,54,0.07)]">
          <ProfileItem
            title="Help center"
            subtitle="Guides and FAQ"
            icon={CircleHelp}
            last
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="mt-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-[22px] border border-[#a84433]/25 bg-white/90 px-4 text-sm font-black text-danger transition hover:bg-[#a84433]/6 active:scale-[0.99]"
      >
        <LogOut size={17} />
        Log out
      </button>
    </section>
  );
}

function ProfileItem({
  title,
  subtitle,
  icon: Icon,
  onClick,
  last = false,
}: {
  title: string;
  subtitle: string;
  icon: typeof MapPinned;
  onClick?: () => void;
  last?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 bg-transparent px-3.5 py-3.5 text-left transition hover:bg-surface-low/80 ${last ? "" : "border-b border-[#e8f0f2]"}`}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf4f6] text-[#007b80]">
        <Icon size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-black text-[#152124]">{title}</span>
        <span className="mt-0.5 block truncate text-xs font-semibold text-[#566164]">
          {subtitle}
        </span>
      </span>
      <ChevronRight size={18} className="shrink-0 text-[#9ba2a5]" />
    </button>
  );
}
