import { FormEvent, useState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { AuthUsernameInput } from "./AuthUsernameInput";
import { toAuthEmail } from "../utils/authEmail";
import { AuthScreen } from "./AuthScreen";
import { NotripBrand } from "./NotripBrand";

type LoginPageProps = {
  onLogin?: () => void;
  onForgotPassword: () => void;
  onRegister: () => void;
};

export function LoginPage({ onLogin, onForgotPassword, onRegister }: LoginPageProps) {
  const [loginId, setLoginId] = useState("");
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
      await signInWithEmailAndPassword(auth, toAuthEmail(loginId), password);
      onLogin?.();
    } catch {
      setError("Sign in failed. Check your username and password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreen aria-label="Sign in">
      <NotripBrand />

      <form className="grid gap-3.5 px-2 pb-2" onSubmit={submitLogin}>
        <div className="mb-1.5">
          <p className="text-[0.82rem] font-black uppercase tracking-widest text-[#687477]">Welcome back</p>
          <h2 className="mt-2 font-display text-[clamp(1.55rem,5vw,1.9rem)] font-black text-[#162225]">
            Sign in to Notrip
          </h2>
        </div>

        <label>
          Username
          <AuthUsernameInput value={loginId} onChange={setLoginId} />
          <span className="mt-1 block text-xs font-semibold text-[#687477]">
            Type your name only — @gmail.com is added automatically
          </span>
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

        {/* <div className="mt-0.5 flex items-center justify-between gap-4">
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
        </div> */}

        {error && (
          <p className="rounded-lg bg-danger/10 px-3.5 py-3 text-sm font-extrabold text-danger" role="alert">
            {error}
          </p>
        )}

        <button
          className="mt-1 inline-flex min-h-14.5 items-center justify-center gap-2.5 rounded-[20px] border-0 bg-[#007b80] font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={!loginId.trim() || !password || isSubmitting}
        >
          <LockKeyhole size={18} />
          {isSubmitting ? "Signing in..." : "Sign in"}
          <ArrowRight size={18} />
        </button>

        <button className="border-0 bg-transparent font-black text-primary" type="button" onClick={onRegister}>
          Create your Notrip account
        </button>
      </form>
    </AuthScreen>
  );
}
