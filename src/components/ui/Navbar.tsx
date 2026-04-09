import Link from "next/link";

export interface NavLinkItem {
  href: string;
  label: string;
}

export interface NavbarProps {
  brand: string;
  links: NavLinkItem[];
}

export const Navbar = ({ brand, links }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-background/90 backdrop-blur-md dark:border-zinc-800/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          {brand}
        </Link>
        <nav
          className="flex flex-wrap items-center gap-1 sm:gap-2"
          aria-label="Main"
        >
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-foreground dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};
