import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import AppModal from '@/Components/AppModal';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useTrans } from '@/Hooks/useTrans';

export default function EditModal({ isOpen, onClose, setting }) {
  const { t } = useTrans();
  const { data, setData, put, errors, reset, processing } = useForm({
    name: '',
    key: '',
    value: '',
    _method: 'PUT',
  });

  useEffect(() => {
    if (setting && isOpen) {
      setData({
        name: setting.name || '',
        key: setting.key || '',
        value: setting.value || '',
        _method: 'PUT',
      });
    } else if (!isOpen) {
      reset();
    }
  }, [setting, isOpen]);

  if (!setting) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('settings.update', setting.id), {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('edit_setting')}
      icon="fa-edit"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Setting Name */}
        <div>
          <InputLabel htmlFor="edit_name" value={t('setting_name')} />
          <TextInput
            id="edit_name"
            type="text"
            className="mt-1"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            placeholder={t('setting_name_placeholder')}
            required
            isFocused
          />
          <InputError message={errors.name} className="mt-2" />
        </div>

        {/* Setting Key */}
        <div>
          <InputLabel htmlFor="edit_key" value={t('setting_key')} />
          <TextInput
            id="edit_key"
            type="text"
            className="mt-1"
            value={data.key}
            onChange={(e) => setData('key', e.target.value)}
            placeholder={t('setting_key_placeholder')}
            required
          />
          <InputError message={errors.key} className="mt-2" />
        </div>

        {/* Setting Value */}
        <div>
          <InputLabel htmlFor="edit_value" value={t('setting_value')} />
          <TextArea
            id="edit_value"
            className="mt-1"
            value={data.value}
            onChange={(e) => setData('value', e.target.value)}
            placeholder={t('setting_value_placeholder')}
            rows={4}
            required
          />
          <InputError message={errors.value} className="mt-2" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
          >
            {t('cancel')}
          </button>
          <PrimaryButton
            type="submit"
            disabled={processing}
            icon="fa-save"
          >
            {processing ? t('updating') : t('update_setting')}
          </PrimaryButton>
        </div>

      </form>
    </AppModal>
  );
}
