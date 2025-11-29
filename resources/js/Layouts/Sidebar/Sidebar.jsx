import React, { useState, useRef, useMemo } from 'react';
import SidebarLink from './SidebarLink';
import SidebarSubmenu from './SidebarSubmenu';
import SidebarProfileMenu from './SidebarProfileMenu';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useTrans } from '@/Hooks/useTrans';
import CommandMenu from './CommandMenu';

export default function Sidebar({ sidebarIsOpen, setSidebarIsOpen }) {
  const { t } = useTrans();
  const { auth } = usePage().props;
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  // Get user roles
  const userRoles = auth.roles || [];

  const navItems = [
    // { name: t('dashboard'), icon: 'fa-chart-line', href: route('dashboard'), route: 'dashboard', role: '' },
    { name: t('subscription'), icon: 'fa-credit-card', href: route('user.subscription'), route: 'user.subscription', role: 'user' },

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
        { name: t('qna'), href: route('user.qna-agent.chat'), route: 'user.qna-agent.*', icon: 'fa-comments' },

        { name: t('inbox'), href: route('user.email-agent.emails', { folder: 'inbox' }), route: 'user.email-agent.emails', icon: 'fa-inbox', folder: 'inbox' },
        { name: t('spam'), href: route('user.email-agent.emails', { folder: 'spam' }), route: 'user.email-agent.emails', icon: 'fa-exclamation-circle', folder: 'spam' },
        { name: t('bin'), href: route('user.email-agent.emails', { folder: 'bin' }), route: 'user.email-agent.emails', icon: 'fa-trash', folder: 'bin' },
        // { name: t('sent'), href: route('user.email-agent.sent.emails'), route: 'user.email-agent.sent.*', icon: 'fa-paper-plane' },
        // { name: t('draft'), href: route('user.email-agent.draft.emails'), route: 'user.email-agent.draft.*', icon: 'fa-file' },
        { name: t('starred'), href: route('user.email-agent.emails', { folder: 'starred' }), route: 'user.email-agent.emails', icon: 'fa-star', folder: 'starred' },
        { name: t('archive'), href: route('user.email-agent.emails', { folder: 'archive' }), route: 'user.email-agent.emails', icon: 'fa-archive', folder: 'archive' },
        {
          name: t('labels'),
          icon: 'fa-tags',
          route: 'user.email-agent.labels.*',
          submenu: [
            { name: t('promotions'), href: route('user.email-agent.emails', { folder: 'promotions' }), route: 'user.email-agent.emails', icon: 'fa-bullhorn', folder: 'promotions' },
            { name: t('social'), href: route('user.email-agent.emails', { folder: 'social' }), route: 'user.email-agent.emails', icon: 'fa-users', folder: 'social' },
            { name: t('personal'), href: route('user.email-agent.emails', { folder: 'personal' }), route: 'user.email-agent.emails', icon: 'fa-user', folder: 'personal' },
            { name: t('clients'), href: route('user.email-agent.emails', { folder: 'clients' }), route: 'user.email-agent.emails', icon: 'fa-handshake', folder: 'clients' },
            { name: t('team'), href: route('user.email-agent.emails', { folder: 'team' }), route: 'user.email-agent.emails', icon: 'fa-users-cog', folder: 'team' },
            { name: t('finance'), href: route('user.email-agent.emails', { folder: 'finance' }), route: 'user.email-agent.emails', icon: 'fa-dollar-sign', folder: 'finance' },
            { name: t('hr'), href: route('user.email-agent.emails', { folder: 'hr' }), route: 'user.email-agent.emails', icon: 'fa-user-tie', folder: 'hr' },
            { name: t('other'), href: route('user.email-agent.emails', { folder: 'other' }), route: 'user.email-agent.emails', icon: 'fa-folder', folder: 'other' },
          ]
        },
        { name: t('auto_settings'), href: route('settings.index'), route: 'settings.*', icon: 'fa-gear' },

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

  return (
    <nav
      className={`fixed left-0 z-30 flex min-h-svh w-60 shrink-0 flex-col border-r border-neutral-300 bg-neutral-200 p-4 transition-transform duration-300 md:w-64 md:translate-x-0 md:relative dark:border-neutral-700 dark:bg-neutral-900 ${sidebarIsOpen ? 'translate-x-0' : '-translate-x-60'
        }`}
      aria-label="sidebar navigation"
    >
      {/* Logo */}
      <div className="flex items-center justify-center mb-4">
        <Link
          href={route('home')}
          className="ml-2 w-48 text-2xl font-bold text-black dark:text-neutral-100"
        >
          <ApplicationLogo />
        </Link>
      </div>

      {/* Search with CommandMenu */}
      <div className="relative flex w-full max-w-xs flex-col gap-1 text-neutral-800 dark:text-neutral-300 mb-4">
        <button
          onClick={() => setCommandMenuOpen(true)}
          className="w-full border border-neutral-300 rounded-xl bg-neutral-100 px-2 py-1.5 pl-9 text-sm text-left text-neutral-500 hover:bg-neutral-200 transition-colors dark:border-neutral-700 dark:bg-neutral-800/50 dark:hover:bg-neutral-700/50"
        >
          <i className="fa-solid fa-search absolute left-2 top-1/2 -translate-y-1/2 text-neutral-800/50 dark:text-neutral-300/50"></i>
          {t('search')}
          <span className="flex items-center gap-1 absolute right-2 top-1/2 -translate-y-1/2" dir='ltr'>
            <span className="px-1.5 py-0.5 text-xs bg-neutral-300 rounded border border-neutral-400 dark:bg-neutral-700 dark:border-neutral-600">Ctrl</span>
            <span className="px-1.5 py-0.5 text-xs bg-neutral-300 rounded border border-neutral-400 dark:bg-neutral-700 dark:border-neutral-600">K</span>
          </span>
        </button>
      </div>

      <CommandMenu open={commandMenuOpen} setOpen={setCommandMenuOpen} navItems={visibleNavItems} />

      {/* Sidebar Links */}
      <div className="flex flex-col gap-2 overflow-y-auto pb-6">
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

      {/* Profile menu at the bottom */}
      <SidebarProfileMenu />
    </nav>
  );
}
