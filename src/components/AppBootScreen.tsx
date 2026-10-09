import { NotripBrand } from "./NotripBrand";

export function AppBootScreen({ label = "Getting things ready" }: { label?: string }) {
  return (
    <main
      className="mx-auto grid min-h-screen w-full max-w-160 place-items-center px-6.5 py-7 max-[640px]:px-4.5 max-[640px]:py-6"
      aria-busy="true"
      aria-live="polite"
    >
      <section
        className="relative w-full overflow-hidden rounded-[36px] bg-white/85 px-7 py-10 text-center shadow-[0_10px_30px_rgba(43,52,54,0.08)] backdrop-blur-[20px] max-[520px]:rounded-[28px] max-[520px]:px-5 max-[520px]:py-8"
        aria-label="Loading"
      >
        <div
          className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(0,116,123,0.16),transparent_70%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(62,100,112,0.14),transparent_70%)]"
          aria-hidden="true"
        />

        <div className="relative">
          <NotripBrand layout="stacked" showSubtitle={false} />
        </div>
        <p className="relative mt-3 text-sm font-semibold text-[#566164]">{label}</p>

        <div className="relative mx-auto mt-7 flex items-center justify-center gap-2" aria-hidden="true">
          <span className="boot-dot h-2 w-2 rounded-full bg-primary" />
          <span className="boot-dot boot-dot-delay-1 h-2 w-2 rounded-full bg-primary" />
          <span className="boot-dot boot-dot-delay-2 h-2 w-2 rounded-full bg-primary" />
        </div>
      </section>
    </main>
  );
}
