import { Command } from "cmdk";
import { useEffect, useState, useMemo } from "react";
import { router } from "@inertiajs/react";
import { useTrans } from "@/Hooks/useTrans";

export default function CommandMenu({ open, setOpen, navItems }) {
  const { t } = useTrans();
  const [value, setValue] = useState("");

  // Flatten all nav items including submenus
  const allNavItems = useMemo(() => {
    const items = [];

    const flattenItems = (itemList, parent = null) => {
      itemList.forEach((item) => {
        if (item.submenu) {
          // Add parent item if it has an href
          if (item.href) {
            items.push({
              ...item,
              parent: parent,
              type: 'link'
            });
          }
          // Recursively add submenu items
          flattenItems(item.submenu, item.name);
        } else {
          items.push({
            ...item,
            parent: parent,
            type: 'link'
          });
        }
      });
    };

    if (navItems) {
      flattenItems(navItems);
    }

    return items;
  }, [navItems]);

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleNavigation = (href) => {
    if (href) {
      router.visit(href);
      setOpen(false);
      setValue("");
    }
  };

  const handleLogout = () => {
    router.post(route('logout'), {}, { preserveScroll: true });
    setOpen(false);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="fixed inset-0 bg-neutral-950/50 z-50 dark:bg-neutral-950/70"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-800 shadow-xl border-neutral-300 dark:border-neutral-700 border overflow-hidden w-full max-w-lg mx-auto mt-12 p-4 rounded-xl"
      >
        <Command.Input
          value={value}
          onValueChange={setValue}
          placeholder={t('search')}
          className="relative border-b border-neutral-300 dark:border-neutral-700 p-3 text-lg w-full placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none bg-transparent text-neutral-900 dark:text-neutral-100"
        />
        <Command.List className="p-3 max-h-96 overflow-y-auto">
          <Command.Empty>
            <span className="text-neutral-600 dark:text-neutral-400">{t('no_results_found')}</span>{" "}
            <span className="text-green-600 dark:text-green-400">"{value}"</span>
          </Command.Empty>

          {/* Navigation Items */}
          {allNavItems.length > 0 && (
            <Command.Group heading={t('navigation')} className="text-sm mb-3 text-neutral-500 dark:text-neutral-400">
              {allNavItems.map((item, index) => (
                <Command.Item
                  key={`${item.route}-${index}`}
                  onSelect={() => item.href && handleNavigation(item.href)}
                  className="flex cursor-pointer transition-colors p-2 text-sm text-neutral-800 dark:text-neutral-200 hover:bg-green-500/10 dark:hover:bg-green-400/10 rounded items-center gap-2"
                >
                  <i className={`fa-solid ${item.icon} shrink-0`}></i>
                  <div className="flex flex-col">
                    <span>{item.name}</span>
                    {item.parent && (
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">{item.parent}</span>
                    )}
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {/* Profile Actions */}
          <Command.Group heading={t('account')} className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
            <Command.Item
              onSelect={() => handleNavigation(route('profile.edit'))}
              className="flex cursor-pointer transition-colors p-2 text-sm text-neutral-800 dark:text-neutral-200 hover:bg-green-500/10 dark:hover:bg-green-400/10 rounded items-center gap-2"
            >
              <i className="fa-solid fa-user"></i>
              {t('profile')}
            </Command.Item>
          </Command.Group>

          {/* Logout */}
          <Command.Item
            onSelect={handleLogout}
            className="flex cursor-pointer transition-colors p-2 text-sm text-neutral-50 hover:bg-neutral-800 dark:hover:bg-neutral-600 bg-neutral-950 dark:bg-neutral-700 rounded items-center gap-2"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            {t('sign_out')}
          </Command.Item>
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
