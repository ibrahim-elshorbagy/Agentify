import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-neutral-50 pt-6 sm:justify-center sm:pt-0 dark:bg-neutral-950">
            <div className="h-48 w-48 mb-4">
                <Link href="/">
                    <ApplicationLogo className="fill-current text-green-500 dark:text-green-400" />
                </Link>
            </div>

            <div className="w-full max-w-md px-4 sm:px-0">
                {children}
            </div>

            {/* <div className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                <p>&copy; {new Date().getFullYear()} <a href="https://www.linkedin.com/in/ibrahim-elshorbagy/" className='text-green-500 underline'>ibrahim elshorbagy</a> . All rights reserved.</p>
            </div> */}
        </div>
    );
}
