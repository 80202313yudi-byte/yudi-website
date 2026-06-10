"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MagneticLink } from "@/components/MagneticLink";
import { ScrollProgress } from "@/components/ScrollProgress";
import { projectReturnStateKey } from "@/data/projectNavigation";
import { navItems } from "@/data/site";

const contactItem = { label: "联系我", href: "#contact" };

type NavbarProps = {
  detailPage?: boolean;
};

export function Navbar({ detailPage = false }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");

  useEffect(() => {
    if (detailPage) {
      setActive("");
      return;
    }

    const observedItems = [...navItems, contactItem];
    const sections = observedItems
      .map((item) => document.querySelector(item.href))
      .filter((section): section is HTMLElement => section instanceof HTMLElement);

    const visibleSections = new Map<string, IntersectionObserverEntry>();
    const setBoundaryActive = () => {
      if (window.scrollY < 80) {
        setActive("#home");
        return;
      }

      const atPageEnd =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24;
      if (atPageEnd) {
        setActive("#contact");
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const href = `#${entry.target.id}`;
          if (entry.isIntersecting) {
            visibleSections.set(href, entry);
          } else {
            visibleSections.delete(href);
          }
        });

        const current = [...visibleSections.entries()].sort(([, a], [, b]) => {
          return Math.abs(a.boundingClientRect.top - 104) - Math.abs(b.boundingClientRect.top - 104);
        })[0];

        if (current) {
          setActive(current[0]);
        } else {
          setBoundaryActive();
        }
      },
      {
        rootMargin: "-104px 0px -58% 0px",
        threshold: [0, 0.1, 0.35, 0.6],
      },
    );

    const syncHash = () => {
      if (observedItems.some((item) => item.href === window.location.hash)) {
        setActive(window.location.hash);
      } else {
        setBoundaryActive();
      }
    };

    sections.forEach((section) => observer.observe(section));
    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("scroll", setBoundaryActive, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("scroll", setBoundaryActive);
    };
  }, [detailPage]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const handleNavigation = (href: string) => {
    if (!detailPage) {
      setActive(href);
    } else {
      try {
        sessionStorage.removeItem(projectReturnStateKey);
      } catch {
        // Explicit navigation must remain available when browser storage is unavailable.
      }
    }
    setOpen(false);
  };

  const getHref = (href: string) => (detailPage ? `/${href}` : href);

  return (
    <header className="fixed left-0 right-0 top-4 z-50 px-4">
      <nav
        aria-label="主导航"
        className="nav-surface relative mx-auto flex max-w-6xl items-center justify-between overflow-hidden rounded-full border border-line bg-[#101010]/90 px-4 py-2 shadow-panel backdrop-blur-xl md:px-5"
      >
        <Link
          href={detailPage ? "/" : "#home"}
          className="flex items-center gap-2 text-sm font-semibold text-text"
          onClick={() => handleNavigation("#home")}
        >
          <span
            className="grid h-7 w-7 place-items-center rounded-full bg-accent text-xs font-black text-background"
            aria-hidden="true"
          >
            F
          </span>
          FISHDI
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={getHref(item.href)}
              aria-current={active === item.href ? "page" : undefined}
              onClick={() => handleNavigation(item.href)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                active === item.href
                  ? "bg-accent/12 text-accent"
                  : "text-[#c1c1c1] hover:bg-white/5 hover:text-text"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <MagneticLink
            href={getHref("#contact")}
            aria-current={active === "#contact" ? "page" : undefined}
            onClick={() => handleNavigation("#contact")}
          >
            联系我
          </MagneticLink>
        </div>

        <button
          type="button"
          aria-label={open ? "关闭菜单" : "打开菜单"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          className="grid h-11 w-11 place-items-center rounded-full border border-line text-text transition hover:border-accent md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <ScrollProgress />
      </nav>

      {open ? (
        <div
          id="mobile-navigation"
          className="mx-auto mt-3 max-w-6xl rounded-3xl border border-line bg-[#111111] p-3 shadow-panel md:hidden"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={getHref(item.href)}
              aria-current={active === item.href ? "page" : undefined}
              className={`block min-h-11 rounded-2xl px-4 py-3 text-sm font-medium ${
                active === item.href ? "bg-accent/12 text-accent" : "text-[#c1c1c1]"
              }`}
              onClick={() => handleNavigation(item.href)}
            >
              {item.label}
            </Link>
          ))}
          <MagneticLink
            href={getHref("#contact")}
            aria-current={active === "#contact" ? "page" : undefined}
            className="mt-2 w-full"
            visualClassName="btn-primary w-full"
            onClick={() => handleNavigation("#contact")}
          >
            联系我
          </MagneticLink>
        </div>
      ) : null}
    </header>
  );
}
