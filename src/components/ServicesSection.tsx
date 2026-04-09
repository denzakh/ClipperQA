import { Layers, ShieldCheck, Sparkles } from "lucide-react";
import { FeatureCard } from "@/components/FeatureCard";

const services = [
  {
    icon: Sparkles,
    title: "Product design",
    description:
      "From concept to UI: clear flows, accessible components, and a cohesive visual language.",
  },
  {
    icon: Layers,
    title: "Frontend engineering",
    description:
      "Modern stacks with TypeScript, performance budgets, and maintainable component architecture.",
  },
  {
    icon: ShieldCheck,
    title: "Quality & launch",
    description:
      "Testing, reviews, and launch support so releases feel confident—not rushed.",
  },
] as const;

export const ServicesSection = () => {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Services
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
            Everything you need to take an idea from prototype to production.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((item) => (
            <FeatureCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
