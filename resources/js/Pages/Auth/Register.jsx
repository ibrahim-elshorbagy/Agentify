import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function Register() {
    const { t } = useTrans();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={t('auth_register')} />

            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{t('auth_create_account')}</h1>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                    {t('auth_join_us_today')}
                </p>
            </div>

            <div className="rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="p-6">
                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <InputLabel htmlFor="name" value={t('auth_full_name')} />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                icon="fa-user"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="mb-4">
                            <InputLabel htmlFor="username" value={t('auth_username')} />
                            <TextInput
                                id="username"
                                name="username"
                                value={data.username}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('username', e.target.value)}
                                required
                                icon="fa-at"
                            />
                            <InputError message={errors.username} className="mt-2" />
                        </div>

                        <div className="mb-4">
                            <InputLabel htmlFor="email" value={t('auth_email_address')} />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="email"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                icon="fa-envelope"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mb-4">
                            <InputLabel htmlFor="password" value={t('auth_password')} />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                icon="fa-lock"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mb-6">
                            <InputLabel
                                htmlFor="password_confirmation"
                                value={t('auth_confirm_password')}
                            />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                required
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
                                    <i className="fa-solid fa-user-plus"></i>
                                )}
                                {t('auth_create_account')}
                            </button>

                            <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                                {t('auth_already_have_account')}{" "}
                                <Link href={route('login')} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                                    {t('auth_login')}
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
