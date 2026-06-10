import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";

export default function WorksLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar detailPage />
      {children}
    </>
  );
}
