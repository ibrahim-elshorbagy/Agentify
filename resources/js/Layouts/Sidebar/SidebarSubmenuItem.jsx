import { Link } from '@inertiajs/react';
import React from 'react';

export default function SidebarSubmenuItem({ href, active, children, badge, icon }) {
  return (
    <li className="px-1 py-0.5">
      <Link
        href={href}
        className={`flex items-center rounded-xl gap-2 px-2 py-1.5 text-sm text-neutral-800 underline-offset-2 hover:bg-green-500/5 hover:text-black focus-visible:underline focus:outline-hidden dark:text-neutral-300 dark:hover:bg-green-400/5 dark:hover:text-neutral-100 ${active ? 'bg-green-500/10 text-black dark:bg-green-400/10 dark:text-neutral-100' : ''}`}
      >
        {icon && <i className={`fa-solid ${icon} shrink-0 text-xs`}></i>}
        <span>{children}</span>
        {badge && <span className="ml-auto font-bold">{badge}</span>}
      </Link>
    </li>
  );
}
