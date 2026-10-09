const DEFAULT_DOMAIN = "gmail.com";

export function getAuthEmailDomain() {
  const fromEnv = import.meta.env.VITE_AUTH_EMAIL_DOMAIN?.trim();
  const domain = fromEnv ? fromEnv.replace(/^@/, "") : DEFAULT_DOMAIN;
  return domain.toLowerCase();
}

export function getAuthEmailSuffix() {
  return `@${getAuthEmailDomain()}`;
}

/** Keep only the local part if user pasted an email. */
export function normalizeUsernameInput(value: string): string {
  const trimmed = value.trim().toLowerCase();
  const suffix = getAuthEmailSuffix();
  if (trimmed.endsWith(suffix)) {
    return trimmed.slice(0, -suffix.length);
  }
  if (trimmed.includes("@")) {
    return trimmed.split("@")[0] ?? "";
  }
  return value.trim();
}

/** Map username or full email to Firebase email/password identifier. */
export function toAuthEmail(identifier: string): string {
  const trimmed = identifier.trim().toLowerCase();
  if (!trimmed) return "";
  if (trimmed.includes("@")) return trimmed;
  const local = normalizeUsernameInput(identifier).toLowerCase();
  if (!local) return "";
  return `${local}@${getAuthEmailDomain()}`;
}

/** Show username without internal @domain suffix in the UI. */
export function formatAuthLoginId(email: string | null | undefined): string {
  if (!email) return "";
  const suffix = `@${getAuthEmailDomain()}`;
  if (email.toLowerCase().endsWith(suffix)) {
    return email.slice(0, -suffix.length);
  }
  return email;
}

export function isValidUsername(username: string): boolean {
  const value = username.trim();
  if (value.includes("@")) return false;
  return /^[a-z0-9][a-z0-9._-]{2,31}$/i.test(value);
}
