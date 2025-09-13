import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function VerifyEmail({ status }) {
    const { t } = useTrans();
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title={t('auth_verify_email')} />

            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{t('auth_verify_email')}</h1>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                    {t('auth_one_last_step')}
                </p>
            </div>

            <div className="rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <i className="fa-solid fa-envelope text-2xl text-green-500 dark:text-green-400"></i>
                        </div>
                    </div>

                    <div className="text-center mb-6 text-neutral-700 dark:text-neutral-300">
                        <p className="mb-2">
                            {t('auth_verification_email_sent')}
                        </p>
                        <p>
                            {t('auth_click_link_complete')}
                        </p>
                    </div>

                    {status === 'verification-link-sent' && (
                        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-600 dark:bg-green-900/20 dark:text-green-400">
                            <div className="flex items-center">
                                <i className="fa-solid fa-check-circle mr-2"></i>
                                <span>A new verification link has been sent to your email address.</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={submit} className="mt-6">
                        <div className="flex flex-col space-y-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center items-center gap-1 px-4 py-2 font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-all disabled:opacity-70"
                            >
                                {processing ? (
                                    <i className="fa-solid fa-circle-notch animate-spin"></i>
                                ) : (
                                    <i className="fa-solid fa-paper-plane"></i>
                                )}
                                {t('auth_resend_verification_email')}
                            </button>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="w-full flex justify-center items-center gap-1 px-4 py-2 font-semibold text-neutral-700 bg-neutral-200 hover:bg-neutral-300 dark:text-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg transition-all"
                            >
                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                {t('auth_logout')}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
