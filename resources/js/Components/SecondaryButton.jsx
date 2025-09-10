export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    icon = null,
    rounded = 'rounded-xl',
    as: Component = 'button',
    ...props
}) {
    // Build the icon element if provided
    const iconElement = icon ? <i className={`fa-solid ${icon}`}></i> : null;

    const buttonClasses = `flex items-center gap-1 px-4 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-300 dark:bg-neutral-800 ${rounded} hover:bg-neutral-400 dark:hover:bg-neutral-700 transition-all ${
        disabled && 'opacity-70'
    } ${className}`;

    // If it's a button element, include the type
    const buttonSpecificProps = Component === 'button' ? { type } : {};

    return (
        <Component
            {...buttonSpecificProps}
            {...props}
            className={buttonClasses}
            disabled={disabled}
        >
            {iconElement}
            {children}
        </Component>
    );
}
