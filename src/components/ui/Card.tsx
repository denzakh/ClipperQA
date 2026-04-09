import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Card = ({ className = "", children, ...props }: CardProps) => {
  const styles =
    "rounded-xl border border-zinc-200 bg-background p-6 shadow-sm dark:border-zinc-800";

  return (
    <div className={`${styles} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};
