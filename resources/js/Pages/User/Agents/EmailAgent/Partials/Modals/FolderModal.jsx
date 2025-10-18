import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import AppModal from '@/Components/AppModal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function FolderModal({ isOpen, onClose, folder = null, mode = 'create' }) {
  const { t } = useTrans();

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    icon: 'fa-folder',
  });

  // Update form data when folder changes (for edit mode)
  useEffect(() => {
    if (folder && mode === 'edit') {
      setData({
        name: folder.name || '',
        icon: folder.icon || 'fa-folder',
      });
    } else if (mode === 'create') {
      reset();
    }
  }, [folder, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const routeName = mode === 'create'
      ? 'user.email-agent.folders.store'
      : 'user.email-agent.folders.update';

    const routeParams = mode === 'edit' ? folder.id : undefined;

    const submitMethod = mode === 'create' ? post : put;

    submitMethod(route(routeName, routeParams), {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    if (!processing) {
      reset();
      onClose();
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  const iconOptions = [
    { value: 'fa-folder', label: t('folder') },
    { value: 'fa-briefcase', label: t('work') },
    { value: 'fa-heart', label: t('personal') },
    { value: 'fa-star', label: t('important') },
    { value: 'fa-bolt', label: t('urgent') },
    { value: 'fa-calendar', label: t('scheduled') },
    { value: 'fa-archive', label: t('archive') },
    { value: 'fa-bookmark', label: t('bookmarks') },
    { value: 'fa-flag', label: t('flagged') },
    { value: 'fa-paperclip', label: t('attachments') },
  ];

  return (
    <AppModal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'create' ? t('create_folder') : t('edit_folder')}
      icon={mode === 'create' ? 'fa-plus' : 'fa-edit'}
      size="md"
      className="backdrop-blur-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Folder Name */}
        <div className="space-y-3">
          <InputLabel htmlFor="name" value={t('folder_name')} required />
          <TextInput
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            className="rounded-2xl border-neutral-200/50 dark:border-neutral-700/50 focus:border-green-300 dark:focus:border-green-600 focus:ring-green-300 dark:focus:ring-green-600 shadow-lg"
            placeholder={t('folder_name_placeholder')}
            icon="fa-folder"
            isFocused={mode === 'create'}
            disabled={processing}
            required
          />
          <InputError message={errors.name} className="mt-2" />
        </div>

        {/* Icon Selection */}
        <div className="space-y-3">
          <InputLabel htmlFor="icon" value={t('folder_icon')} />
          <div className="grid grid-cols-5 gap-2">
            {iconOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setData('icon', option.value)}
                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                  data.icon === option.value
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    : 'border-neutral-200 dark:border-neutral-700 hover:border-green-300 dark:hover:border-green-600'
                }`}
                disabled={processing}
                title={option.label}
              >
                <i className={`fa-solid ${option.value} text-lg mb-1`}></i>
                {/* <span className="text-xs truncate w-full text-center">{option.label}</span> */}
              </button>
            ))}
          </div>
          <InputError message={errors.icon} className="mt-2" />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <SecondaryButton
            type="button"
            onClick={handleClose}
            disabled={processing}
            className="rounded-xl px-6 py-2.5"
          >
            {t('cancel')}
          </SecondaryButton>

          <PrimaryButton
            type="submit"
            icon={mode === 'create' ? 'fa-plus' : 'fa-save'}
            disabled={processing || !data.name.trim()}
            className="rounded-xl px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            {processing
              ? (mode === 'create' ? t('creating') : t('saving'))
              : (mode === 'create' ? t('create_folder') : t('save_changes'))
            }
          </PrimaryButton>
        </div>
      </form>
    </AppModal>
  );
}
