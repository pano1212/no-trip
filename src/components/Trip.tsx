import { useEffect, useState } from "react";
import { Calendar, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { currency } from "../utils/currency";
import { PaymentGroupWithTotal } from "../types/finance";
import { AppView } from "./BottomBar";


type TripInfo = {
    trips: PaymentGroupWithTotal[]
    onAddExpense: () => void
    onChangeView: (view: AppView) => void;
    onSelectFund: (fundId: string) => void;
    onEditTrip: (trip: PaymentGroupWithTotal) => void;
    onDeleteTrip: (tripId: string) => Promise<void>;

}

export function TripsScreen({
    trips,
    onAddExpense,
    onChangeView,
    onSelectFund,
    onEditTrip,
    onDeleteTrip,
}: TripInfo) {
    const [deletingTripId, setDeletingTripId] = useState<string | null>(null);
    const [openMenuTripId, setOpenMenuTripId] = useState<string | null>(null);

    useEffect(() => {
        if (!openMenuTripId) return;
        const closeMenu = () => setOpenMenuTripId(null);
        document.addEventListener("click", closeMenu);
        return () => document.removeEventListener("click", closeMenu);
    }, [openMenuTripId]);

    const openFund = (fundId: string) => {
        onSelectFund(fundId);
        onChangeView("home");
    };

    const deleteTrip = async (trip: PaymentGroupWithTotal) => {
        const confirmed = window.confirm(
            `Delete "${trip.name}"? This trip will be hidden and marked as deleted.`,
        );
        if (!confirmed) return;

        setDeletingTripId(trip.id);
        try {
            await onDeleteTrip(trip.id);
        } finally {
            setDeletingTripId(null);
        }
    };
    const fallbackImage =
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80";

    return (
        <div className="px-4 pb-28 space-y-5"
        >
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">My Trips</h1>
                <button
                    onClick={onAddExpense}
                    className="flex items-center gap-1.5 text-sm text-primary font-semibold"
                >
                    <Plus size={16} />
                    <span>New Trip</span>
                </button>
            </div>

            <div className="space-y-4">
                {!trips.length && (
                    <div className="rounded-2xl bg-white/80 p-6 text-center">
                        <p className="font-bold text-ink">No trips yet</p>
                        <p className="mt-1 text-sm text-ink-muted">Create a trip to see its image, title, dates, and budget here.</p>
                    </div>
                )}
                {trips.map((trip) => {
                    const spent = trip.total || 0;
                    const pct = trip.budget > 0 ? Math.round((spent / trip.budget) * 100) : 0;
                    const isActive = spent > 0 && pct < 100;
                    const isPlanned = spent === 0;
                    const statusLabel = isActive ? "Ongoing" : isPlanned ? "Planned" : "Booked";
                    const statusBg = isActive ? "rgba(13,148,136,0.8)" : isPlanned ? "rgba(245,158,11,0.8)" : "rgba(129,140,248,0.8)";
                    const progressColor = pct > 80 ? "#EF4444" : "#14B8A6";
                    const isMenuOpen = openMenuTripId === trip.id;
                    const tripMenu = (
                        <div className="relative shrink-0">
                            <button
                                type="button"
                                aria-label={`Trip options for ${trip.name}`}
                                aria-expanded={isMenuOpen}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setOpenMenuTripId(isMenuOpen ? null : trip.id);
                                }}
                                className="grid h-9 w-9 place-items-center rounded-full border-0 bg-white text-black backdrop-blur-sm transition hover:bg-black/60"
                            >
                                <MoreHorizontal size={17} />
                            </button>
                            {isMenuOpen && (
                                <div
                                    role="menu"
                                    className="absolute right-0 top-full z-30 mt-1 min-w-[148px] overflow-hidden rounded-xl border border-[#e8f0f2] bg-white py-1 shadow-[0_8px_24px_rgba(43,52,54,0.12)]"
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    <button
                                        type="button"
                                        role="menuitem"
                                        className="flex w-full items-center gap-2 border-0 bg-transparent px-3 py-2.5 text-left text-sm font-semibold text-ink transition hover:bg-surface-low"
                                        onClick={() => {
                                            setOpenMenuTripId(null);
                                            onEditTrip(trip);
                                        }}
                                    >
                                        <Pencil size={15} className="text-primary" />
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        role="menuitem"
                                        disabled={deletingTripId === trip.id}
                                        className="flex w-full items-center gap-2 border-0 bg-transparent px-3 py-2.5 text-left text-sm font-semibold text-danger transition hover:bg-danger/5 disabled:cursor-not-allowed disabled:opacity-60"
                                        onClick={() => {
                                            setOpenMenuTripId(null);
                                            void deleteTrip(trip);
                                        }}
                                    >
                                        <Trash2 size={15} />
                                        {deletingTripId === trip.id ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            )}
                        </div>
                    );

                    return (
                        <div key={trip.id} className="overflow-visible rounded-2xl bg-card shadow-[0_3px_10px_rgba(43,52,54,0.07)]">
                            <div className="relative">
                                <div
                                    className="relative h-36 cursor-pointer overflow-hidden rounded-t-2xl bg-secondary"
                                    onClick={() => openFund(trip.id)}
                                >
                                    <img
                                        src={trip.imageUrl || fallbackImage}
                                        alt={trip.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.7) 100%)" }} />
                                    <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                                        <div>
                                            <p className="text-lg font-bold text-white">{trip.name}</p>
                                            <p className="text-xs text-white/70">
                                                {trip.startDate || "Start"} — {trip.endDate || "End"}
                                            </p>
                                        </div>
                                       
                                    </div>
                                </div>
                                <div
                                    className="absolute right-3 top-3 z-10"
                                    onClick={(event) => event.stopPropagation()}
                                >
                                    {tripMenu}
                                </div>
                            </div>
                            <div className="bg-card p-4">
                                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                                    <span>
                                        <Calendar size={11} className="inline mr-1" />
                                        {trip.startDate || "No start"} — {trip.endDate || "No end"}
                                    </span>
                                    <span style={{ fontFamily: "JetBrains Mono, monospace" }}>
                                        {currency.format(spent, trip.currency)} / {currency.format(trip.budget, trip.currency)}
                                    </span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2 mb-1.5">
                                    <div
                                        className="h-2 rounded-full transition-all"
                                        style={{ width: `${Math.min(100, pct)}%`, background: progressColor }}
                                    />
                                </div>
                                <div className="flex justify-between items-center gap-2">
                                    <span className="text-xs text-muted-foreground" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                                        {currency.format(Math.max(trip.budget - spent, 0), trip.currency)} left
                                    </span>
                                    <span className="text-xs font-bold" style={{ fontFamily: "JetBrains Mono, monospace", color: progressColor }}>
                                        {pct}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
