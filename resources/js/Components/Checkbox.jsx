export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-green-600 dark:focus:ring-offset-neutral-800 ' +
                className
            }
        />
    );
}
