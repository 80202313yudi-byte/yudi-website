"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

type ProjectReturnTarget = {
  href: string;
  label: string;
};

function getProjectReturnTarget(
  slug: string,
  source: "home" | "projects"
): ProjectReturnTarget {
  if (source === "home") {
    return {
      href: `/?returnTo=featured-project-${slug}`,
      label: "返回首页精选案例",
    };
  }

  return {
    href: `/projects?returnTo=all-project-${slug}`,
    label: "返回全部作品",
  };
}

function getCurrentProjectSource(): "home" | "projects" {
  const params = new URLSearchParams(window.location.search);
  return params.get("from") === "home" ? "home" : "projects";
}

export function ProjectReturnLink({
  slug,
  placement,
}: {
  slug: string;
  placement: "top" | "bottom";
}): ReactNode {
  const [target, setTarget] = useState<ProjectReturnTarget>(() =>
    getProjectReturnTarget(slug, "projects")
  );
  const isBottom = placement === "bottom";

  useEffect(() => {
    setTarget(getProjectReturnTarget(slug, getCurrentProjectSource()));
  }, [slug]);

  return (
    <Link
      href={target.href}
      scroll={false}
      className={`focus-ring group border-foreground/8 bg-background text-foreground/70 hover:border-brand-line hover:bg-brand-soft hover:text-brand-strong inline-flex items-center gap-2 rounded-xl border text-sm font-medium transition-colors ${
        isBottom ? "px-5 py-3 shadow-sm sm:px-6" : "w-fit px-4 py-2"
      }`}
    >
      <ArrowLeft
        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
        aria-hidden="true"
      />
      {target.label}
    </Link>
  );
}
