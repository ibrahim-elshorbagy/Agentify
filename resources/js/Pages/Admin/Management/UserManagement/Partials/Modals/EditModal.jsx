import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import SelectInput from '@/Components/SelectInput';
import { useTrans } from '@/Hooks/useTrans';
import AppModal from '@/Components/AppModal';

export default function EditModal({ isOpen, onClose, user, roles }) {
  const { t } = useTrans();
  const { data, setData, post, errors, reset, processing } = useForm({
    name: '',
    email: '',
    username: '',
    password: '',
    password_confirmation: '',
    role: '',
    _method: 'PUT',
  });

  useEffect(() => {
    if (user && isOpen) {
      setData({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        password: '',
        password_confirmation: '',
        role: user.roles && user.roles.length > 0 ? user.roles[0].name : '',
        _method: 'PUT',
      });
    } else if (!isOpen) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isOpen]);

  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route('admin.users.update', user.id), {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  // Prepare roles for dropdown
  const roleOptions = [
    { value: '', label: `-- ${t('role')} --` },
    ...(roles?.map(role => ({
      value: role.name,
      label: role.name === 'admin' ? t('admin') : t('user_role')
    })) || []),
  ];

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('edit_user')}
      icon="fa-pen-to-square"
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <InputLabel htmlFor="name" value={t('full_name')} required />
          <TextInput
            id="name"
            name="name"
            value={data.name}
            className="mt-1 block w-full"
            onChange={(e) => setData('name', e.target.value)}
            required
            icon="fa-user"
          />
          <InputError message={errors.name} className="mt-2" />
        </div>

        <div className="mb-4">
          <InputLabel htmlFor="email" value={t('email_address')} required />
          <TextInput
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            onChange={(e) => setData('email', e.target.value)}
            required
            icon="fa-envelope"
          />
          <InputError message={errors.email} className="mt-2" />
        </div>

        <div className="mb-4">
          <InputLabel htmlFor="username" value={t('username')} required />
          <TextInput
            id="username"
            name="username"
            value={data.username}
            className="mt-1 block w-full"
            onChange={(e) => setData('username', e.target.value)}
            required
            icon="fa-at"
          />
          <InputError message={errors.username} className="mt-2" />
        </div>

        <div className="mb-4">
          <InputLabel htmlFor="password" value={t('password')} />
          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            onChange={(e) => setData('password', e.target.value)}
            icon="fa-lock"
            placeholder={t('leave_empty_to_keep_current')}
          />
          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="mb-4">
          <InputLabel htmlFor="password_confirmation" value={t('password_confirmation')} />
          <TextInput
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            className="mt-1 block w-full"
            onChange={(e) => setData('password_confirmation', e.target.value)}
            icon="fa-lock"
          />
          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <div className="mb-4">
          <InputLabel htmlFor="role" value={t('role')} required />
          <SelectInput
            name="role"
            value={data.role}
            onChange={(e) => setData('role', e.target.value)}
            options={roleOptions}
            icon="fa-user-shield"
            error={errors.role}
            required
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <SecondaryButton
            type="button"
            onClick={onClose}
            icon="fa-xmark"
            rounded="rounded-lg"
            disabled={processing}
          >
            {t('cancel')}
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            icon="fa-floppy-disk"
            rounded="rounded-lg"
            withShadow={false}
            disabled={processing}
          >
            {processing ? t('saving_changes') : t('save_changes')}
          </PrimaryButton>
        </div>
      </form>
    </AppModal>
  );
}
