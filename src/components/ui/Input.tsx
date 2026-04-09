import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = ({ className = "", ...props }: InputProps) => {
  const styles =
    "w-full rounded-lg border border-zinc-300 bg-background px-3 py-2 text-sm text-foreground placeholder:text-zinc-500 focus:border-foreground focus:outline-none focus:ring-2 focus:ring-zinc-400/40 dark:border-zinc-600 dark:focus:ring-zinc-500/30";

  return <input className={`${styles} ${className}`.trim()} {...props} />;
};
