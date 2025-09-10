import { Link } from '@inertiajs/react';

export default function MenuNavLink({
  active = false,
  className = '',
  icon = '',
  children,
  onClick,
  href,
  ...props
}) {
  const baseClasses = `
  flex items-center gap-3 px-5 py-3  text-base font-medium transition-colors duration-200
  w-full
  ${active
      ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-white'
      : 'text-neutral-700 dark:bg-green-800 hover:bg-neutral-100 hover:text-green-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-green-400'
    }
  ${className}
`;

  // If onClick is provided and href starts with #, render as button
  if (onClick && href && href.startsWith('#')) {
    return (
      <button
        onClick={onClick}
        className={baseClasses}
        {...props}
      >
        {icon && <i className={`fa-solid ${icon} w-5 text-center`}></i>}
        <span>{children}</span>
      </button>
    );
  }

  // Default Link behavior
  return (
    <Link
      href={href}
      onClick={onClick}
      className={baseClasses}
      {...props}
    >
      {icon && <i className={`fa-solid ${icon} w-5 text-center`}></i>}
      <span>{children}</span>
    </Link>
  );
}
