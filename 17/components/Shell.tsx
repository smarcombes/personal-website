import Link from "next/link";
import { NAV, SHOW_THOUGHTS, type NavKey } from "@/lib/site";

function visibleNav() {
  return NAV.filter(({ key }) => {
    if (key === "thoughts" && !SHOW_THOUGHTS) return false;
    return true;
  });
}

function Nav({ active }: { active: NavKey }) {
  return (
    <>
      {visibleNav().map(({ href, label, key }) => {
        const cls =
          active === key
            ? "underline underline-offset-8 decoration-2 hover:decoration-foreground hover:text-foreground"
            : "underline underline-offset-8 hover:decoration-2 hover:decoration-foreground/50 hover:text-foreground/70";
        return (
          <Link key={key} href={href} className={cls}>
            {label}
          </Link>
        );
      })}
    </>
  );
}

export function Shell({
  active,
  maxWidth = "max-w-xl",
  children,
}: {
  active: NavKey;
  maxWidth?: string;
  children: React.ReactNode;
}) {
  const hasNav = visibleNav().length > 0;

  return (
    <div className="p-4 md:p-12 overflow-hidden">
      <div className={`w-full ${maxWidth}`}>
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <span>
            <Link href="/" className="text-3xl font-serif">
              Hey, I&apos;m Séverin.
            </Link>
          </span>
          {hasNav && (
            <nav className="flex gap-6">
              <Nav active={active} />
            </nav>
          )}
        </header>

        {children}

        <footer>
          <div className="w-full flex flex-col md:flex-row justify-between py-6 items-baseline gap-4 border-t border-black mt-16">
            <p className="font-serif text-lg">Séverin Marcombes</p>
            {hasNav && (
              <div className="flex gap-4">
                <Nav active={active} />
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
