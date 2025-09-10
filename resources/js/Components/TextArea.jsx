import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextArea(
    {
        className = '',
        isFocused = false,
        icon = null,
        iconClassName = 'text-neutral-400',
        ...props
    },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <div className="relative">
            <textarea
                {...props}
                className={
                    'w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-2 py-1 text-neutral-900 dark:text-neutral-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:border-green-400 dark:focus:ring-green-900 transition-all ' +
                    (icon ? 'pr-8 ' : '') +
                    className
                }
                ref={localRef}
            />
            {icon && (
                <div className="absolute top-2 right-0 flex items-start pr-3">
                    <i className={`fa-solid ${icon} ${iconClassName}`} aria-hidden="true"></i>
                </div>
            )}
        </div>
    );
});
