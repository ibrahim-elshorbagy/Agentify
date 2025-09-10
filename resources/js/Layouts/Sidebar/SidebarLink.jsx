import React from 'react';
import { Link } from '@inertiajs/react';

export default function SidebarLink({ href, active, icon, children }) {
  return (
    <Link
      href={href}
      className={`flex items-center rounded-xl gap-2 px-2 py-1.5 text-sm text-neutral-800 underline-offset-2 hover:bg-green-500/5 hover:text-black focus-visible:underline focus:outline-hidden dark:text-neutral-300 dark:hover:bg-green-400/5 dark:hover:text-neutral-100 ${active ? 'bg-green-500/10 text-black dark:bg-green-400/10 dark:text-neutral-100' : ''}`}
    >
      {icon && <i className={`fa-solid ${icon} shrink-0`}></i>}
      <span>{children}</span>
    </Link>
  );
}
