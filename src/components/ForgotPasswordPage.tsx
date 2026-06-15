import { useEffect, useRef, useState } from "react";
import { ArrowLeft, KeyRound, ReceiptText, Smartphone } from "lucide-react";
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../lib/firebase";

type ForgotPasswordPageProps = {
  onBackToLogin: () => void;
  onLogin?: () => void;
};

export function ForgotPasswordPage({ onBackToLogin, onLogin }: ForgotPasswordPageProps) {
  const [phoneNumber, setPhoneNumber] = useState("+856");
  const [otpCode, setOtpCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    return () => {
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
    };
  }, []);

  const getRecaptchaVerifier = async () => {
    if (!auth) {
      throw new Error("Firebase is not configured. Add your VITE_FIREBASE_* values and try again.");
    }

    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "forgot-password-recaptcha", {
        size: "invisible",
      });
    }

    await recaptchaVerifierRef.current.render();
    return recaptchaVerifierRef.current;
  };

  const sendOtp = async () => {
    if (!phoneNumber.trim()) {
      setError("Enter your phone number with country code.");
      return;
    }

    setError("");
    setMessage("");
    setIsSendingOtp(true);

    try {
      const verifier = await getRecaptchaVerifier();
      const result = await signInWithPhoneNumber(auth!, phoneNumber.trim(), verifier);
      setConfirmationResult(result);
      setMessage("OTP sent. Enter the code from your SMS.");
    } catch {
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
      setError("Could not send OTP. Check the phone number and Firebase Phone provider settings.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (!confirmationResult) {
      setError("Send an OTP first.");
      return;
    }

    if (!otpCode.trim()) {
      setError("Enter the OTP code.");
      return;
    }

    setError("");
    setMessage("");
    setIsVerifyingOtp(true);

    try {
      await confirmationResult.confirm(otpCode.trim());
      onLogin?.();
    } catch {
      setError("Invalid OTP code. Try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-160 items-center px-6.5 py-7 max-[640px]:px-4.5 max-[640px]:py-6">
      <section
        className="grid gap-7 rounded-[42px] bg-white/80 p-7 shadow-[0_8px_24px_rgba(43,52,54,0.08)] backdrop-blur-[20px] max-[520px]:rounded-[34px]"
        aria-label="Forgot password"
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
            <p className="text-[0.82rem] font-black uppercase tracking-widest text-[#687477]">Account recovery</p>
            <h1 className="mt-1 font-display text-[clamp(1.65rem,6vw,2.15rem)] font-black text-primary">
              Verify by phone OTP
            </h1>
          </div>
        </div>

        <section className="grid gap-3 rounded-[26px] bg-surface-low/80 p-4" aria-label="Phone OTP recovery">
          <label>
            Phone number
            <input
              autoComplete="tel"
              inputMode="tel"
              placeholder="+85620..."
              type="tel"
              value={phoneNumber}
              className="min-h-13.5 rounded-[18px] border-transparent bg-white font-bold"
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
          </label>

          {confirmationResult && (
            <label>
              OTP code
              <input
                autoComplete="one-time-code"
                inputMode="numeric"
                placeholder="123456"
                value={otpCode}
                className="min-h-13.5 rounded-[18px] border-transparent bg-white font-bold"
                onChange={(event) => setOtpCode(event.target.value)}
              />
            </label>
          )}

          {message && <p className="text-sm font-extrabold text-primary">{message}</p>}
          {error && (
            <p className="rounded-lg bg-danger/10 px-3.5 py-3 text-sm font-extrabold text-danger" role="alert">
              {error}
            </p>
          )}

          <div className="grid gap-2 min-[480px]:grid-cols-2">
            <button
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] border-0 bg-secondary font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={isSendingOtp || isVerifyingOtp}
              onClick={sendOtp}
            >
              <Smartphone size={17} />
              {confirmationResult ? "Resend OTP" : isSendingOtp ? "Sending..." : "Send OTP"}
            </button>

            <button
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[18px] border-0 bg-[#007b80] font-black text-white disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              disabled={!confirmationResult || !otpCode || isVerifyingOtp}
              onClick={verifyOtp}
            >
              <KeyRound size={17} />
              {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
            </button>
          </div>

          <p className="text-xs font-bold leading-5 text-ink-muted">
            Firebase Phone Auth verifies the phone and signs you in. Changing an email/password account password
            after phone verification requires a backend with Firebase Admin SDK.
          </p>
        </section>

        <div id="forgot-password-recaptcha" />
      </section>
    </main>
  );
}
