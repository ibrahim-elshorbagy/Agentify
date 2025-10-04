import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const AutoResizeTextarea = forwardRef(({ value, onChange, onKeyDown, placeholder, disabled, className = '' }, ref) => {
  const textareaRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
  }));

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scroll height
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      rows={1}
      className={`w-full resize-none overflow-hidden rounded-lg border border-neutral-300 dark:border-neutral-700
        bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-neutral-900 dark:text-neutral-100
        focus:border-green-500 focus:ring-2 focus:ring-green-200
        dark:focus:border-green-400 dark:focus:ring-green-900 transition-all
        min-h-[40px] max-h-48 ${className}`}
      style={{ lineHeight: '1.5', fontSize: '0.95rem' }}
    />
  );
});

export default AutoResizeTextarea;
