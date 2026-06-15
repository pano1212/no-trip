import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, ReceiptText, UserPlus } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";

type RegisterPageProps = {
  onBackToLogin: () => void;
  onRegister?: () => void;
};

export function RegisterPage({ onBackToLogin, onRegister }: RegisterPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!auth) {
      setError("Firebase is not configured. Add your VITE_FIREBASE_* values and try again.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);

      if (name.trim()) {
        await updateProfile(credential.user, {
          displayName: name.trim(),
        });
      }

      onRegister?.();
    } catch {
      setError("Could not create account. Check the email or try another password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-160 items-center px-6.5 py-7 max-[640px]:px-4.5 max-[640px]:py-6">
      <section
        className="grid gap-7 rounded-[42px] bg-white/80 p-7 shadow-[0_8px_24px_rgba(43,52,54,0.08)] backdrop-blur-[20px] max-[520px]:rounded-[34px]"
        aria-label="Create account"
      >
        <button
          className="inline-flex w-fit items-center gap-2 border-0 bg-transparent px-2 pt-1 font-black text-primary"
          type="button"
          onClick={onBackToLogin}
        >
          <ArrowLeft size={18} />
          Back to sign in
        </button>

        <div className="flex items-center gap-3.5 px-2">
          <span className="grid h-14.5 w-14.5 place-items-center rounded-full bg-[#f2a27f] text-white/95">
            <ReceiptText size={30} />
          </span>
          <div>
            <p className="text-[0.82rem] font-black uppercase tracking-widest text-[#687477]">Trip finance</p>
            <h1 className="mt-1 font-display text-[clamp(1.65rem,6vw,2.15rem)] font-black text-primary">
              Create account
            </h1>
          </div>
        </div>

        <form className="grid gap-3.5 px-2 pb-2" onSubmit={submitRegister}>
          <label>
            Name
            <input
              autoComplete="name"
              placeholder="Your name"
              value={name}
              className="min-h-13.5 rounded-[18px] border-transparent bg-surface-low font-bold"
              onChange={(event) => setName(event.target.value)}
            />
          </label>

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
              autoComplete="new-password"
              placeholder="At least 6 characters"
              type="password"
              value={password}
              className="min-h-13.5 rounded-[18px] border-transparent bg-surface-low font-bold"
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <label>
            Confirm password
            <input
              autoComplete="new-password"
              placeholder="Repeat password"
              type="password"
              value={confirmPassword}
              className="min-h-13.5 rounded-[18px] border-transparent bg-surface-low font-bold"
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </label>

          {error && (
            <p className="rounded-lg bg-danger/10 px-3.5 py-3 text-sm font-extrabold text-danger" role="alert">
              {error}
            </p>
          )}

          <button
            className="mt-1 inline-flex min-h-14.5 items-center justify-center gap-2.5 rounded-[20px] border-0 bg-[#007b80] font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={!email || !password || !confirmPassword || isSubmitting}
          >
            <UserPlus size={18} />
            {isSubmitting ? "Creating..." : "Create account"}
            <ArrowRight size={18} />
          </button>
        </form>
      </section>
    </main>
  );
}
