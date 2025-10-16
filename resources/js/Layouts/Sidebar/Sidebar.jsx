import React, { useState, useRef, useMemo } from 'react';
import SidebarLink from './SidebarLink';
import SidebarSubmenu from './SidebarSubmenu';
import SidebarProfileMenu from './SidebarProfileMenu';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useTrans } from '@/Hooks/useTrans';

export default function Sidebar({ sidebarIsOpen, setSidebarIsOpen }) {
  const { t } = useTrans();
  const { auth } = usePage().props;
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef();

  // Get user roles
  const userRoles = auth.roles || [];

  const navItems = [
    { name: t('dashboard'), icon: 'fa-chart-line', href: route('dashboard'), route: 'dashboard', role: '' },

    // Admin
    {
      name: t('user_management'),
      icon: 'fa-users',
      route: 'admin.users.*',
      role: 'admin',
      submenu: [
        { name: t('users'), href: route('admin.users.index'), route: 'admin.users.*', icon: 'fa-user' },
      ],
    },
    {
      name: t('plan_management'),
      icon: 'fa-tags',
      route: 'admin.plans.*',
      role: 'admin',
      submenu: [
        { name: t('plans'), href: route('admin.plans.index'), route: 'admin.plans.*', icon: 'fa-tag' },
      ],
    },

    // User
    {
      name: t('email_agent'),
      icon: 'fa-envelope',
      route: 'user.email-agent.*',
      role: 'user',
      submenu: [
        { name: t('inbox'), href: route('user.email-agent.emails', { folder: 'inbox' }), route: 'user.email-agent.emails', icon: 'fa-inbox', folder: 'inbox' },
        { name: t('spam'), href: route('user.email-agent.emails', { folder: 'spam' }), route: 'user.email-agent.emails', icon: 'fa-exclamation-circle', folder: 'spam' },
        { name: t('bin'), href: route('user.email-agent.emails', { folder: 'bin' }), route: 'user.email-agent.emails', icon: 'fa-trash', folder: 'bin' },
        { name: t('sent'), href: route('user.email-agent.sent.emails'), route: 'user.email-agent.sent.*', icon: 'fa-paper-plane' },
        { name: t('draft'), href: route('user.email-agent.draft.emails'), route: 'user.email-agent.draft.*', icon: 'fa-file' },
        { name: t('qna'), href: route('user.qna-agent.chat'), route: 'user.qna-agent.*', icon: 'fa-comments' },
      ],
    },
    {
      name: t('report_agent'),
      icon: 'fa-chart-bar',
      route: 'user.report-agent.*',
      role: 'user',
      submenu: [
        { name: t('chat'), href: route('user.report-agent.chat'), route: 'user.report-agent.chat*', icon: 'fa-comments' },
        { name: t('files'), href: route('user.report-agent.files'), route: 'user.report-agent.files*', icon: 'fa-folder' },
      ],
    },
    {
      name: t('hr_agent'),
      icon: 'fa-users',
      route: 'user.hr-agent.*',
      role: 'user',
      submenu: [
        { name: t('candidates'), href: route('user.hr-agent.index'), route: 'user.hr-agent.*', icon: 'fa-user-tie' },
      ],
    },

    // { name: t('settings'), icon: 'fa-gear', href: route('profile.edit'), route: 'profile', role: 'admin' },
  ];

  // Function to check if an item should be visible based on role
  const isItemVisible = (item) => {
    if (!item.role) return true; // No role requirement
    return userRoles.includes(item.role);
  };

  // Stable visible nav items
  const visibleNavItems = useMemo(() => {
    return navItems.filter((item) => isItemVisible(item));
  }, [navItems, userRoles]);

  // Compute search results without extra state
  const filteredNavItems = useMemo(() => {
    if (!searchQuery) return [];

    const query = searchQuery.toLowerCase().trim();
    const allNavItems = [];

    visibleNavItems.forEach((item) => {
      if (item.submenu) {
        item.submenu.forEach((sub) => {
          allNavItems.push({
            ...sub,
            parent: item.name,
            parentIcon: item.icon,
            icon: sub.icon || item.icon,
          });
        });
      } else {
        allNavItems.push(item);
      }
    });

    return allNavItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        (item.parent && item.parent.toLowerCase().includes(query))
    );
  }, [searchQuery, visibleNavItems]);

  return (
    <nav
      className={`fixed left-0 z-30 flex min-h-svh w-60 shrink-0 flex-col border-r border-neutral-300 bg-neutral-200 p-4 transition-transform duration-300 md:w-64 md:translate-x-0 md:relative dark:border-neutral-700 dark:bg-neutral-900 ${sidebarIsOpen ? 'translate-x-0' : '-translate-x-60'
        }`}
      aria-label="sidebar navigation"
    >
      {/* Logo */}
      <div className="flex items-center justify-center mb-4">
        <Link
          href={route('dashboard')}
          className="ml-2 w-48 text-2xl font-bold text-black dark:text-neutral-100"
        >
          <ApplicationLogo />
        </Link>
      </div>

      {/* Search */}
      <div className="relative flex w-full max-w-xs flex-col gap-1 text-neutral-800 dark:text-neutral-300">
        <i className="fa-solid fa-search absolute left-2 top-1/2 -translate-y-1/2 text-neutral-800/50 dark:text-neutral-300/50"></i>
        <input
          type="search"
          ref={searchRef}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-neutral-300 rounded-xl bg-neutral-100 px-2 py-1.5 pl-9 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 disabled:cursor-not-allowed disabled:opacity-75 dark:border-neutral-700 dark:bg-neutral-800/50 dark:focus-visible:outline-green-400"
          placeholder={t('search_navigation')}
          aria-label="Search"
        />

        {/* Search Results */}
        {searchQuery && filteredNavItems.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
            {filteredNavItems.map((item) => (
              <Link
                key={item.route}
                href={item.href || '#'}
                onClick={() => setSearchQuery('')}
                className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <i className={`fa-solid ${item.icon} shrink-0`}></i>
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  {item.parent && (
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {item.parent}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Results */}
        {searchQuery && filteredNavItems.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-lg z-50 px-3 py-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
            {t('no_results_for', { query: searchQuery })}
          </div>
        )}
      </div>

      {/* Sidebar Links */}
      {!searchQuery && (
        <div className="flex flex-col gap-2 overflow-y-auto pb-6 mt-4">
          {visibleNavItems.map((item) =>
            item.submenu ? (
              <SidebarSubmenu key={item.name} item={item} />
            ) : (
              <SidebarLink
                key={item.name}
                href={item.href}
                active={route().current(item.route)}
                icon={item.icon}
              >
                {item.name}
              </SidebarLink>
            )
          )}
        </div>
      )}

      {/* Profile menu at the bottom */}
      <SidebarProfileMenu />
    </nav>
  );
}
