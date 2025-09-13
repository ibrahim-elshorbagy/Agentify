import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function Login({ status, canResetPassword }) {
    const { t } = useTrans();
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title={t('auth_login')} />

            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{t('auth_welcome_back')}</h1>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                    {t('auth_sign_in_to_your_account')}
                </p>
            </div>

            <div className="rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="p-6">
                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <InputLabel htmlFor="username" value={t('auth_username')} />
                            <TextInput
                                id="username"
                                type="text"
                                name="username"
                                value={data.username}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => {setData('username', e.target.value)}}
                                icon="fa-user"
                            />
                            <InputError message={errors.username} className="mt-2" />
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center justify-between">
                                <InputLabel htmlFor="password" value={t('auth_password')} />
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                    >
                                        {t('auth_forgot_password')}
                                    </Link>
                                )}
                            </div>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                icon="fa-lock"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mb-6">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData('remember', e.target.checked)
                                    }
                                />
                                <span className="ms-2 text-sm text-neutral-700 dark:text-neutral-300">
                                    {t('auth_remember_me')}
                                </span>
                            </label>
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
                                    <i className="fa-solid fa-right-to-bracket"></i>
                                )}
                                {t('auth_login')}
                            </button>

                            <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                                {t('auth_dont_have_account')}{" "}
                                <Link href={route('register')} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                                    {t('auth_register')}
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
