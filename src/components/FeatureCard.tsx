import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) => {
  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-foreground dark:bg-zinc-800">
        <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </div>
    </Card>
  );
};
