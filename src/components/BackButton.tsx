import { ChevronLeft } from "lucide-react";

type PageHeaderProps = {
    title: string;
    onBack: () => void;
};

export function PageHeader({ title, onBack }: PageHeaderProps) {
    return (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={onBack}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-0 bg-transparent text-primary transition-colors hover:bg-surface-high"
                aria-label="Go back"
            >
                <ChevronLeft size={25} />
            </button>

            <h1 className="flex-1 font-display text-[clamp(1.25rem,4vw,1.55rem)] font-black leading-none text-primary">
                {title}
            </h1>
        </div>
    );
}