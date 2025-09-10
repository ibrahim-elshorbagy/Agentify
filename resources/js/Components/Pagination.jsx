import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    return (
        <nav className="mt-6 mb-4 flex justify-center items-center gap-1">
            {links?.map((link, index) => (
                <Link
                    key={index}
                    preserveScroll
                    href={link.url || "#"}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`inline-flex justify-center items-center h-8 min-w-8 px-3 rounded-lg text-sm transition-colors
                        ${link.active ? "bg-green-500 text-white font-medium" : ""}
                        ${!link.url
                            ? "text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
                            : "text-neutral-700 dark:text-neutral-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-300"
                        }
                    `}
                />
            ))}
        </nav>
    );
}
