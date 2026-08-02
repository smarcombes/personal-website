import Link from "next/link";

/* ------------------------------------------------------------------ *
 * Prose primitives for hand-authored project bodies.
 * These mirror the styling the old markdown renderer produced, so the
 * page output looks identical — just written as React.
 * ------------------------------------------------------------------ */

/** Section heading (was `##` in markdown). */
export function Section({ children }: { children: React.ReactNode }) {
  return <h3 className="text-2xl font-normal mt-12 mb-4 font-sans">{children}</h3>;
}

/** Sub-heading (was `###`). */
export function Sub({ children }: { children: React.ReactNode }) {
  return <h4 className="font-semibold mt-8 mb-3">{children}</h4>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4">{children}</p>;
}

export function Bullets({ children }: { children: React.ReactNode }) {
  return <ul className="list-none space-y-3 my-6">{children}</ul>;
}

export function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="size-[7px] bg-gray-900 rounded-sm mt-2.5 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

export function Ordered({ children }: { children: React.ReactNode }) {
  return (
    <ol className="list-decimal ml-6 space-y-2 my-6 marker:text-muted-foreground">
      {children}
    </ol>
  );
}

/** Inline code. Pass strings containing `<` / `>` safely as children.
 *  Sized relative to surrounding text (em) so it reads well in both the large
 *  article prose and the tiny home rows. */
export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[0.85em] bg-white border border-divider px-1 py-px whitespace-nowrap">
      {children}
    </code>
  );
}

/** Fenced code block / ascii diagram. Pass content as a template literal. */
export function Pre({ children }: { children: string }) {
  return (
    <pre className="bg-white border border-divider p-4 my-6 overflow-x-auto text-[13px] leading-5">
      <code>{children}</code>
    </pre>
  );
}

/** Trailing "→ source" line. */
export function Src({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-8 pt-4 border-t border-divider text-muted-foreground text-xs">
      → {children}
    </p>
  );
}

/** Body link that picks next/link for internal routes, <a> for external. */
export function A({ href, children }: { href: string; children: React.ReactNode }) {
  const cls = "text-link underline hover:decoration-2";
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {children}
    </a>
  );
}

export function DataTable({
  head,
  rows,
}: {
  head?: React.ReactNode[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse border border-divider text-xs">
        {head && (
          <thead>
            <tr>
              {head.map((h, i) => (
                <th
                  key={i}
                  className="text-left font-semibold px-3 py-1.5 border border-divider bg-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className="px-3 py-1.5 border border-divider align-top">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Badges({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 my-6">
      {items.map((t, i) => (
        <span
          key={i}
          className="inline-flex items-center px-2 py-0.5 bg-muted border border-divider text-[11px] text-muted-foreground"
        >
          {t}
        </span>
      ))}
    </div>
  );
}
