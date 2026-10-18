'use client';

import Link from "next/link";
import classes from './main-header.module.css'
import { usePathname } from "next/navigation";

export type NavLinkProps = React.PropsWithChildren<{
  href: string;
}>

export default function NavClientLink({ href, children }: NavLinkProps) {
  const path = usePathname();

  return (
    <Link href={href} className={path.startsWith(href) ? classes.active : ''}>{children}</Link>
  )
}