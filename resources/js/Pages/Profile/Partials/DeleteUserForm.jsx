import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import AppModal from '@/Components/AppModal';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { useTrans } from '@/Hooks/useTrans';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();
    const { t } = useTrans();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
                    <i className="fa-solid fa-exclamation-triangle"></i>
                    <span>
                        {t('account_deletion_warning')}
                    </span>
                </p>
            </div>

            <div className="flex justify-start">
                <PrimaryButton
                    onClick={confirmUserDeletion}
                    icon="fa-trash-alt"
                    className="bg-red-500 hover:bg-red-600"
                    rounded="rounded-lg"
                    withShadow={false}
                >
                    {t('delete_my_account')}
                </PrimaryButton>
            </div>

            <AppModal
                isOpen={confirmingUserDeletion}
                onClose={closeModal}
                title={t('delete_account')}
                icon="fa-exclamation-triangle"
                iconColor="text-red-500"
                danger={true}
                size="md"
            >
                <div className="mb-4">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg mb-4">
                        <p className="text-sm text-red-800 dark:text-red-200">
                            {t('delete_account_confirmation')}
                        </p>
                    </div>

                    <form onSubmit={deleteUser}>
                        <div className="mb-4">
                            <InputLabel
                                htmlFor="password"
                                value={t('confirm_with_password')}
                            />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="mt-1 block w-full"
                                isFocused
                                placeholder={t('enter_current_password')}
                                icon="fa-lock"
                            />

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <SecondaryButton
                                type="button"
                                onClick={closeModal}
                                icon="fa-xmark"
                                rounded="rounded-lg"
                            >
                                {t('cancel')}
                            </SecondaryButton>

                            <PrimaryButton
                                type="submit"
                                icon="fa-trash-alt"
                                disabled={processing}
                                className="bg-red-500 hover:bg-red-600"
                                rounded="rounded-lg"
                                withShadow={false}
                            >
                                {t('permanently_delete_account')}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </AppModal>
        </section>
    );
}
