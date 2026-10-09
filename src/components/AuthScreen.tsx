import { ReactNode } from "react";

type AuthScreenProps = {
  children: ReactNode;
  "aria-label": string;
};

export function AuthScreen({ children, "aria-label": ariaLabel }: AuthScreenProps) {
  return (
    <main className="relative mx-auto grid min-h-screen w-full max-w-160 items-center overflow-hidden px-6.5 py-7 max-[640px]:px-4.5 max-[640px]:py-6">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute -bottom-20 -left-12 h-48 w-48 rounded-full bg-[#3e6470]/12 blur-3xl" />
        <svg
          className="absolute left-1/2 top-[12%] h-32 w-[min(92%,380px)] -translate-x-1/2 text-primary/20"
          viewBox="0 0 360 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 52C48 12 88 68 128 28C168 8 208 44 248 24C288 4 328 36 352 20"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="8 10"
          />
          <circle cx="8" cy="52" r="5" fill="currentColor" />
          <circle cx="352" cy="20" r="5" fill="currentColor" />
        </svg>
      </div>

      <section
        className="relative z-10 grid gap-7 rounded-[42px] bg-white/82 p-7 shadow-[0_8px_24px_rgba(43,52,54,0.08)] backdrop-blur-[20px] max-[520px]:rounded-[34px]"
        aria-label={ariaLabel}
      >
        {children}
      </section>
    </main>
  );
}
