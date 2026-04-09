import type { Metadata } from "next";
import { User } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about our team and mission",
};

const team = [
  { name: "Alex Morgan", role: "Engineering Lead" },
  { name: "Jordan Lee", role: "Product Design" },
  { name: "Sam Rivera", role: "Customer Success" },
] as const;

const AboutPage = () => {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          About us
        </h1>
        <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          ClipperQA started as a small team obsessed with one question: how do we
          ship software that feels reliable on day one and stays maintainable for
          years? We work alongside product teams to clarify requirements,
          tighten UX, and implement interfaces that scale.
        </p>
        <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Our process blends discovery workshops, iterative design reviews, and
          pragmatic engineering. We prefer boring technology where it reduces
          risk, and we reach for new tools only when they clearly improve
          outcomes for users and operators.
        </p>
        <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Whether you are launching a new surface or refactoring a mature app,
          we focus on communication, measurable quality, and shipping in
          sensible increments. If that resonates, we would love to hear what
          you are building.
        </p>
      </article>

      <section className="mt-16" aria-labelledby="team-heading">
        <h2
          id="team-heading"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          Team
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          The people you will meet on a typical project.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <li key={member.name}>
              <Card className="flex flex-row items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <User className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{member.name}</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {member.role}
                  </p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default AboutPage;
