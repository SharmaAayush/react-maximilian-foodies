'use client';

import Link from "next/link";
import NavClientLink, { NavLinkProps } from "./main-header-client-link";
import { Suspense } from "react";

export default function NavLink({ href, children }: NavLinkProps) {
  return (
    <Suspense fallback={
      <Link href={href}>{children}</Link>
    }>
      <NavClientLink href={href}>
        {children}
      </NavClientLink>
    </Suspense>
  )
}