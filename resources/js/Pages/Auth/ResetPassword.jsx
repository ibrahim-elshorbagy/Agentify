import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function ResetPassword({ token, email }) {
    const { t } = useTrans();
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={t('auth_reset_password')} />

            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{t('auth_reset_your_password')}</h1>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                    {t('auth_enter_new_password')}
                </p>
            </div>

            <div className="rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="p-6">
                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <InputLabel htmlFor="email" value={t('auth_email_address')} />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                icon="fa-envelope"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mb-4">
                            <InputLabel htmlFor="password" value={t('auth_new_password')} />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                isFocused={true}
                                onChange={(e) => setData('password', e.target.value)}
                                icon="fa-lock"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mb-6">
                            <InputLabel
                                htmlFor="password_confirmation"
                                value={t('auth_confirm_new_password')}
                            />
                            <TextInput
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                icon="fa-lock"
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex flex-col space-y-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center items-center gap-1 px-4 py-2 font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-all disabled:opacity-70"
                            >
                                {processing ? (
                                    <i className="fa-solid fa-circle-notch animate-spin"></i>
                                ) : (
                                    <i className="fa-solid fa-key"></i>
                                )}
                                {t('auth_reset_password')}
                            </button>

                            <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                                {t('auth_remember_password')}{" "}
                                <Link href={route('login')} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                                    {t('auth_back_to_login')}
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
