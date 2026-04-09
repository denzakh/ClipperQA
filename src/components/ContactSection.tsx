"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export const ContactSection = () => {
  return (
    <section
      id="contact"
      className="border-t border-zinc-200 bg-zinc-50 px-4 py-16 dark:border-zinc-800 dark:bg-zinc-950 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-lg">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground">
          Contact us
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Leave your email and we will get back within one business day.
        </p>
        <form
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => e.preventDefault()}
        >
          <Input
            type="email"
            name="email"
            placeholder="you@company.com"
            autoComplete="email"
            aria-label="Email"
            className="sm:flex-1"
          />
          <Button variant="primary" type="submit" className="shrink-0 sm:w-auto">
            Send
          </Button>
        </form>
      </div>
    </section>
  );
};
