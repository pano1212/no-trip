import { FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, UserPlus } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import { AuthUsernameInput } from "./AuthUsernameInput";
import { isValidUsername, toAuthEmail } from "../utils/authEmail";
import { AuthScreen } from "./AuthScreen";
import { NotripBrand } from "./NotripBrand";

type RegisterPageProps = {
  onBackToLogin: () => void;
  onRegister?: () => void;
};

export function RegisterPage({ onBackToLogin, onRegister }: RegisterPageProps) {
  const [username, setUsername] = useState("");
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

    if (!isValidUsername(username)) {
      setError("Username must be 3–32 characters (letters, numbers, . _ -).");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const credential = await createUserWithEmailAndPassword(auth, toAuthEmail(username), password);

      await updateProfile(credential.user, {
        displayName: username.trim().toLowerCase(),
      });

      onRegister?.();
    } catch {
      setError("Could not create account. Username may already be taken.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScreen aria-label="Create account">
      <button
        className="inline-flex w-fit items-center gap-2 border-0 bg-transparent px-2 pt-1 font-black text-primary"
        type="button"
        onClick={onBackToLogin}
      >
        <ArrowLeft size={18} />
        Back to sign in
      </button>

      <NotripBrand subtitle="Start tracking your next trip" />

      <form className="grid gap-3.5 px-2 pb-2" onSubmit={submitRegister}>
        <div className="mb-0.5 px-0.5">
          <h2 className="font-display text-[clamp(1.35rem,4.5vw,1.65rem)] font-black text-[#162225]">
            Join Notrip
          </h2>
          <p className="mt-1 text-sm font-semibold text-[#566164]">One account for all your trip budgets.</p>
        </div>

        <label>
          Username
          <AuthUsernameInput value={username} onChange={setUsername} />
          <span className="mt-1 block text-xs font-semibold text-[#687477]">
            Your login will be username@gmail.com
          </span>
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
          disabled={!username.trim() || !password || !confirmPassword || isSubmitting}
        >
          <UserPlus size={18} />
          {isSubmitting ? "Creating..." : "Create account"}
          <ArrowRight size={18} />
        </button>
      </form>
    </AuthScreen>
  );
}
