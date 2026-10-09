import { getAuthEmailSuffix, normalizeUsernameInput } from "../utils/authEmail";

type AuthUsernameInputProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  autoComplete?: string;
};

export function AuthUsernameInput({
  value,
  onChange,
  id,
  placeholder = "yourname",
  autoComplete = "username",
}: AuthUsernameInputProps) {
  const suffix = getAuthEmailSuffix();

  return (
    <div className="flex min-h-13.5 w-full items-center overflow-hidden rounded-[18px] bg-surface-low font-bold">
      <input
        id={id}
        autoComplete={autoComplete}
        placeholder={placeholder}
        type="text"
        value={value}
        className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 outline-none"
        onChange={(event) => onChange(normalizeUsernameInput(event.target.value))}
      />
      <span className="shrink-0 border-l border-[#d5e3e6]/80 px-3 text-sm font-black text-primary">
        {suffix}
      </span>
    </div>
  );
}
