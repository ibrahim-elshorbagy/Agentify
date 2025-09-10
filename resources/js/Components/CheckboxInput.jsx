
import { forwardRef, useImperativeHandle, useRef } from 'react';

export default forwardRef(function CheckboxInput(
    {
        className = '',
        ...props
    },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    const baseClasses =
        'h-4 w-4 rounded border-2 border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800 text-green-600 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900 focus:border-green-500 dark:focus:border-green-400 transition-all cursor-pointer';

    const disabledClasses =
        'opacity-60 cursor-not-allowed bg-neutral-200 dark:bg-neutral-700';

    return (
        <input
            {...props}
            type="checkbox"
            className={
                baseClasses +
                (props.disabled ? ` ${disabledClasses}` : '') +
                (className ? ` ${className}` : '')
            }
            ref={localRef}
        />
    );
});
