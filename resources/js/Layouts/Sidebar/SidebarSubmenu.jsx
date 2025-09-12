import React, { useState, useEffect } from 'react';
import SidebarSubmenuItem from './SidebarSubmenuItem';

export default function SidebarSubmenu({ item }) {
  // Check if any submenu item is active by checking route patterns
  const isAnySubmenuActive = item.submenu.some(sub => {
    // Check both exact route and wildcard pattern
    return route().current(sub.route) || route().current(sub.route + '.*');
  });

  // Also check if the parent route pattern is active (for child routes)
  const isParentRouteActive = route().current(item.route);

  // Initialize expanded state based on whether any submenu item or parent route is active
  const [isExpanded, setIsExpanded] = useState(isAnySubmenuActive || isParentRouteActive || item.active || false);

  // Keep menu expanded when navigating between its submenu items or child routes
  useEffect(() => {
    if (isAnySubmenuActive || isParentRouteActive) {
      setIsExpanded(true);
    }
  }, [isAnySubmenuActive, isParentRouteActive]);

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setIsExpanded(v => !v)}
        className={`flex items-center justify-between rounded-xl gap-2 px-2 py-1.5 text-sm font-medium underline-offset-2 focus:outline-hidden focus-visible:underline ${isExpanded || isAnySubmenuActive || isParentRouteActive ? 'text-black bg-green-500/10 dark:text-neutral-100 dark:bg-green-400/10' : 'text-neutral-800 hover:bg-green-500/5 hover:text-black dark:text-neutral-300 dark:hover:bg-green-400/5 dark:hover:text-neutral-100'}`}
      >
        <i className={`fa-solid ${item.icon} shrink-0`}></i>
        <span className="ltr:mr-auto ltr:text-left rtl:ml-auto rtl:text-right">{item.name}</span>
        <i className={`fa-solid fa-chevron-down transition-transform shrink-0 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}></i>
      </button>
      {isExpanded && (
        <ul className="flex flex-col gap-0.5 mt-1">
          {item.submenu.map(sub => (
            <SidebarSubmenuItem
              key={sub.route}
              href={sub.href}
              active={route().current(sub.route) || route().current(sub.route + '.*')}
              icon={sub.icon}
            >
              {sub.name}
            </SidebarSubmenuItem>
          ))}
        </ul>
      )}
    </div>
  );
}
