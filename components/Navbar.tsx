"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MagneticLink } from "@/components/MagneticLink";
import { projectReturnStateKey } from "@/data/projectNavigation";
import { navItems } from "@/data/site";

const contactItem = { label: "联系我", href: "#contact" };

type NavbarProps = {
  detailPage?: boolean;
};

type MobileMenuState = "closed" | "opening" | "open" | "closing";

const mobileMenuAnimationMs = 220;

export function Navbar({ detailPage = false }: NavbarProps) {
  const [mobileMenuState, setMobileMenuState] = useState<MobileMenuState>("closed");
  const [active, setActive] = useState("#home");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const isMobileMenuVisible = mobileMenuState !== "closed";
  const isMobileMenuExpanded = mobileMenuState === "opening" || mobileMenuState === "open";
  const isMobileMenuInteractive = mobileMenuState === "open";

  const closeMobileMenu = useCallback((options: { restoreFocus?: boolean } = {}) => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }

    setMobileMenuState((current) => {
      if (current === "closed" || current === "closing") {
        return current;
      }

      return "closing";
    });

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = window.setTimeout(() => {
      setMobileMenuState("closed");
      closeTimerRef.current = null;

      if (options.restoreFocus) {
        menuButtonRef.current?.focus();
      }
    }, mobileMenuAnimationMs);
  }, []);

  const openMobileMenu = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
    }

    setMobileMenuState("opening");
    openTimerRef.current = window.setTimeout(() => {
      setMobileMenuState("open");
      openTimerRef.current = null;
    }, 20);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    if (isMobileMenuExpanded) {
      closeMobileMenu({ restoreFocus: true });
      return;
    }

    openMobileMenu();
  }, [closeMobileMenu, isMobileMenuExpanded, openMobileMenu]);

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
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }

      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuExpanded) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (menuPanelRef.current?.contains(target) || menuButtonRef.current?.contains(target)) {
        return;
      }

      closeMobileMenu();
    };

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) > 4 || Math.abs(event.deltaX) > 4) {
        closeMobileMenu();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaX = touch.clientX - touchStartRef.current.x;

      if (Math.abs(deltaY) > 12 || Math.abs(deltaX) > 24) {
        closeMobileMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu({ restoreFocus: true });
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMobileMenu, isMobileMenuExpanded]);

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
    closeMobileMenu();
  };

  const getHref = (href: string) => (detailPage ? `/${href}` : href);

  return (
    <header className="fixed left-0 right-0 top-4 z-50">
      <div className="site-nav-shell header-shell">
        <nav aria-label="主导航" className="nav-pill nav-surface">
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

          <div className="nav-links hidden items-center gap-1 md:flex">
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

          <button
            ref={menuButtonRef}
            type="button"
            aria-label={isMobileMenuExpanded ? "关闭菜单" : "打开菜单"}
            aria-expanded={isMobileMenuExpanded}
            aria-controls="mobile-navigation"
            className="mobile-menu-button grid h-11 w-11 place-items-center rounded-full border border-line text-text transition hover:border-accent md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuExpanded ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        <Link
          href={getHref("#contact")}
          aria-current={active === "#contact" ? "page" : undefined}
          className="header-contact-button hidden md:inline-flex"
          onClick={() => handleNavigation("#contact")}
        >
          联系我
        </Link>
      </div>

      {isMobileMenuVisible ? (
        <>
          <div
            className="mobile-menu-backdrop md:hidden"
            data-state={mobileMenuState}
            aria-hidden="true"
            onClick={() => closeMobileMenu()}
          />
          <nav
            ref={menuPanelRef}
            id="mobile-navigation"
            aria-label="移动端导航"
            aria-hidden={isMobileMenuInteractive ? undefined : true}
            className="mobile-menu-panel site-nav-shell mt-3 rounded-3xl border border-line bg-[#111111] p-3 shadow-panel md:hidden"
            data-state={mobileMenuState}
          >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={getHref(item.href)}
              aria-current={active === item.href ? "page" : undefined}
              tabIndex={isMobileMenuInteractive ? undefined : -1}
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
            tabIndex={isMobileMenuInteractive ? undefined : -1}
            onClick={() => handleNavigation("#contact")}
          >
            联系我
          </MagneticLink>
          </nav>
        </>
      ) : null}
    </header>
  );
}
