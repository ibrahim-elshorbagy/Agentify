export default function PrimaryButton({
  className = '',
  disabled,
  children,
  icon = null,
  rounded = 'rounded-xl', // Default to rounded-xl
  withShadow = true,
  size = 'default', // 'default' or 'large'
  as: Component = 'button',
  type = 'button',
  ...props
}) {
  // Determine size-specific classes
  const sizeClasses = size === 'large' ? 'md:text-base' : '';

  // Determine shadow classes
  const shadowClasses = withShadow ? 'shadow' : '';

  // Build the icon element if provided
  const iconElement = icon ? <i className={`fa-solid ${icon}`}></i> : null;

  // Calculate the gap size based on the icon and text
  const gapSize = size === 'large' ? 'gap-2' : 'gap-1';

  // Check if className already contains a background color
  const hasBgClass = /\bbg-/.test(className);

  // Default bg classes (only if no bg- is provided in className)
  const defaultBg = hasBgClass ? '' : 'bg-green-500 hover:bg-green-600';

  // Build the button classes
  const buttonClasses = `
      flex items-center ${gapSize} px-4 py-2 text-sm font-semibold text-white
      ${defaultBg} ${rounded} transition-all ${shadowClasses} ${sizeClasses}
      ${disabled ? 'opacity-70' : ''} ${className}
  `.trim();

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
