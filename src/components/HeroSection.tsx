"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const HeroSection = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="border-b border-zinc-200 bg-gradient-to-b from-zinc-50 to-background px-4 py-16 dark:border-zinc-800 dark:from-zinc-950 dark:to-background sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-tight">
          Build products people trust
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
          We help teams ship polished web experiences with clarity, speed, and
          attention to detail.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="primary" onClick={scrollToContact}>
            Contact Us
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  );
};
