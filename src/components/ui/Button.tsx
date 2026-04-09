import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: ReactNode;
}

export const Button = ({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 disabled:pointer-events-none disabled:opacity-50";
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-foreground text-background hover:bg-zinc-800 dark:hover:bg-zinc-200",
    secondary:
      "border border-zinc-300 bg-transparent text-foreground hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-900",
  };

  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};
