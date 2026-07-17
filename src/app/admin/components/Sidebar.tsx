"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Add future modules here — each entry gets a sidebar link; the route itself
// lives at src/app/admin/(dashboard)/<segment>/page.tsx.
const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Episodes", href: "/admin/episodes" },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function NavLinks({ className, linkClassName }: { className: string; linkClassName: (active: boolean) => string }) {
  const pathname = usePathname();
  return (
    <nav className={className}>
      {NAV_ITEMS.map((item) => (
        <Link key={item.href} href={item.href} className={linkClassName(isActive(pathname, item.href))}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export default function Sidebar() {
  return (
    <>
      {/* Desktop: persistent left sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-ink/10 bg-white px-4 py-6 sm:flex">
        <div className="mb-8 px-2 font-serif text-lg text-ink">At The Crossroads</div>
        <NavLinks
          className="flex flex-1 flex-col gap-1"
          linkClassName={(active) =>
            `rounded-lg px-3 py-2 font-sans text-sm font-bold transition-colors ${
              active ? "bg-teal text-cream" : "text-ink/60 hover:bg-cream hover:text-ink"
            }`
          }
        />
      </aside>

      {/* Mobile: horizontal top bar */}
      <div className="flex items-center gap-3 overflow-x-auto border-b border-ink/10 bg-white px-4 py-3 sm:hidden">
        <NavLinks
          className="flex items-center gap-1"
          linkClassName={(active) =>
            `whitespace-nowrap rounded-lg px-3 py-1.5 font-sans text-sm font-bold transition-colors ${
              active ? "bg-teal text-cream" : "text-ink/60"
            }`
          }
        />
      </div>
    </>
  );
}
