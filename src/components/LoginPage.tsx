import { FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole, ReceiptText } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

type LoginPageProps = {
  onLogin?: () => void;
  onForgotPassword: () => void;
  onRegister: () => void;
};

export function LoginPage({ onLogin, onForgotPassword, onRegister }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!auth) {
      setError("Firebase is not configured. Add your VITE_FIREBASE_* values and try again.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      onLogin?.();
    } catch {
      setError("Sign in failed. Check your email and password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-160 items-center px-6.5 py-7 max-[640px]:px-4.5 max-[640px]:py-6">
      <section
        className="grid gap-7 rounded-[42px] bg-white/80 p-7 shadow-[0_8px_24px_rgba(43,52,54,0.08)] backdrop-blur-[20px] max-[520px]:rounded-[34px]"
        aria-label="Sign in"
      >
        <div className="flex items-center gap-3.5 px-2 pt-2">
          <span className="grid h-14.5 w-14.5 place-items-center rounded-full bg-[#f2a27f] text-white/95">
            <ReceiptText size={30} />
          </span>
          <div>
            <p className="text-[0.82rem] font-black uppercase tracking-widest text-[#687477]">Trip finance</p>
            <h1 className="mt-1 font-display text-[clamp(1.65rem,6vw,2.15rem)] font-black text-primary">
              The Fluid Ledger
            </h1>
          </div>
        </div>

        <form className="grid gap-3.5 px-2 pb-2" onSubmit={submitLogin}>
          <div className="mb-1.5">
            <p className="text-[0.82rem] font-black uppercase tracking-widest text-[#687477]">Welcome back</p>
            <h2 className="mt-2 font-display text-[clamp(1.55rem,5vw,1.9rem)] font-black text-[#162225]">Sign in</h2>
          </div>

          <label>
            Email
            <input
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              type="email"
              value={email}
              className="min-h-13.5 rounded-[18px] border-transparent bg-surface-low font-bold"
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label>
            Password
            <input
              autoComplete="current-password"
              placeholder="Your password"
              type="password"
              value={password}
              className="min-h-13.5 rounded-[18px] border-transparent bg-surface-low font-bold"
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <div className="mt-0.5 flex items-center justify-between gap-4">
            <label className="flex grid-flow-col items-center gap-2.25 text-sm">
              <input className="min-h-4.5 w-4.5 accent-[#007b80]" type="checkbox" />
              Remember me
            </label>
            <button
              className="border-0 bg-transparent font-black text-primary"
              type="button"
              onClick={onForgotPassword}
            >
              Forgot?
            </button>
          </div>

          {error && (
            <p className="rounded-lg bg-danger/10 px-3.5 py-3 text-sm font-extrabold text-danger" role="alert">
              {error}
            </p>
          )}

          <button
            className="mt-1 inline-flex min-h-14.5 items-center justify-center gap-2.5 rounded-[20px] border-0 bg-[#007b80] font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={!email || !password || isSubmitting}
          >
            <LockKeyhole size={18} />
            {isSubmitting ? "Signing in..." : "Sign in"}
            <ArrowRight size={18} />
          </button>

          <button className="border-0 bg-transparent font-black text-primary" type="button" onClick={onRegister}>
            Create new account
          </button>
        </form>
      </section>
    </main>
  );
}
