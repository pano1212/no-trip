import { FormEvent, useState } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  User,
} from "firebase/auth";
import { Save } from "lucide-react";
import { formatAuthLoginId, getAuthEmailSuffix } from "../utils/authEmail";
import { PageHeader } from "./BackButton";

type EditProfilePanelProps = {
  user: User;
  onClose: () => void;
  onUpdated?: () => void;
};

function mapAuthError(error: unknown): string {
  const code = typeof error === "object" && error && "code" in error ? String((error as { code: string }).code) : "";
  switch (code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Current password is incorrect.";
    case "auth/weak-password":
      return "New password is too weak. Use at least 6 characters.";
    case "auth/requires-recent-login":
      return "Please sign out and sign in again, then retry.";
    default:
      return "Could not update profile. Try again.";
  }
}

export function EditProfilePanel({ user, onClose, onUpdated }: EditProfilePanelProps) {
  const usesPassword = user.providerData.some((provider) => provider.providerId === "password");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginId = formatAuthLoginId(user.email);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!usesPassword) {
      setError("Password change is not available for this sign-in method.");
      return;
    }
    if (!currentPassword) {
      setError("Enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user.email) {
        setError("Could not update profile. Try again.");
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      await user.reload();

      setMessage("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onUpdated?.();
    } catch (error) {
      setError(mapAuthError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="mb-2">
        <PageHeader title="Edit profile" onBack={onClose} />
      </header>

      <form className="mx-auto grid w-full min-w-0 max-w-md gap-4 pb-8" onSubmit={submit}>
        <article className="rounded-[22px] bg-white/95 p-4 shadow-[0_3px_10px_rgba(43,52,54,0.07)]">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.1em] text-ink-muted">Your name</p>
          <p className="mt-2 font-display text-xl font-black text-ink">
            {loginId || "—"}
          </p>
          <p className="mt-1 text-sm font-semibold text-ink-muted">
            {loginId ? `${loginId}${getAuthEmailSuffix()}` : "—"}
          </p>
        </article>

        {usesPassword ? (
          <article className="rounded-[22px] bg-white/95 p-4 shadow-[0_3px_10px_rgba(43,52,54,0.07)]">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.1em] text-ink-muted">
              Change password
            </p>
            <div className="mt-3 grid gap-3">
              <label className="grid gap-2">
                <span className="text-sm font-bold text-ink-muted">Current password</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  className="min-h-11 rounded-xl border-0 bg-surface-highest px-3 text-base font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-bold text-ink-muted">New password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  className="min-h-11 rounded-xl border-0 bg-surface-highest px-3 text-base font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-bold text-ink-muted">Confirm new password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  className="min-h-11 rounded-xl border-0 bg-surface-highest px-3 text-base font-semibold text-ink outline-none focus:ring-2 focus:ring-primary/30"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </label>
            </div>
          </article>
        ) : null}

        {error ? (
          <p className="rounded-lg bg-danger/10 px-3.5 py-3 text-sm font-extrabold text-danger" role="alert">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="rounded-lg bg-primary/10 px-3.5 py-3 text-sm font-extrabold text-primary" role="status">
            {message}
          </p>
        ) : null}

        {usesPassword ? (
          <button
            type="submit"
            disabled={
              isSubmitting || !currentPassword || !newPassword || !confirmPassword
            }
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[20px] border-0 bg-primary font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} />
            {isSubmitting ? "Saving..." : "Save password"}
          </button>
        ) : null}
      </form>
    </>
  );
}
