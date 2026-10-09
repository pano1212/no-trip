export const NOTRIP_LOGO_SRC = `${import.meta.env.BASE_URL}notrip-logo.jpg`;

type NotripBrandProps = {
  layout?: "horizontal" | "stacked";
  subtitle?: string;
  showSubtitle?: boolean;
};

const defaultSubtitle = "Trip budgets & daily expenses";

const logoSizeClass = {
  lg: "h-[5.25rem] w-[5.25rem]",
  md: "h-28 w-28",
  sm: "h-11 w-11",
} as const;

export function NotripLogoMark({ size = "lg" }: { size?: keyof typeof logoSizeClass }) {
  return (
    <img
      src={NOTRIP_LOGO_SRC}
      alt="Notrip"
      className={`${logoSizeClass[size]} shrink-0 rounded-[22%] object-cover shadow-[0_8px_20px_rgba(43,52,54,0.14)]`}
    />
  );
}

export function NotripWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-black leading-none tracking-tight ${className}`}>
      <span className="text-[#162225]">No</span>
      <span className="text-primary">trip</span>
    </span>
  );
}

export function NotripBrand({
  layout = "horizontal",
  subtitle = defaultSubtitle,
  showSubtitle = true,
}: NotripBrandProps) {
  if (layout === "stacked") {
    return (
      <div className="text-center">
        <div className="mx-auto grid w-fit place-items-center">
          <NotripLogoMark size="md" />
        </div>
        {showSubtitle ? (
          <p className="mt-4 text-sm font-semibold text-[#566164]">{subtitle}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 px-2 pt-2">
      <NotripLogoMark size="lg" />
      {showSubtitle ? (
        <p className="max-w-[12rem] text-sm font-semibold leading-snug text-[#566164]">{subtitle}</p>
      ) : null}
    </div>
  );
}
