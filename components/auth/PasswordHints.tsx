import type { PasswordChecks } from "@/lib/auth";

const RULES: { key: keyof PasswordChecks; label: string }[] = [
  { key: "length", label: "At least 8 characters" },
  { key: "upper", label: "Include uppercase letter" },
  { key: "lower", label: "Include lowercase letter" },
  { key: "numberOrSymbol", label: "Include number or symbol" },
];

export function PasswordHints({ checks }: { checks: PasswordChecks }) {
  return (
    <ul className="space-y-1 text-sm">
      {RULES.map((rule) => (
        <li
          key={rule.key}
          className={checks[rule.key] ? "text-success" : "text-muted"}
        >
          {checks[rule.key] ? "✓" : "○"} {rule.label}
        </li>
      ))}
    </ul>
  );
}
