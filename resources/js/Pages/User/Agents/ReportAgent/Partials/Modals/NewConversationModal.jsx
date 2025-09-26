import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import AppModal from '@/Components/AppModal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function NewConversationModal({ isOpen, onClose }) {
  const { t } = useTrans();

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route('user.report-agent.conversations.store'), {
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

  return (
    <AppModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('new_conversation')}
      icon="fa-plus"
      size="md"
    >
      <form onSubmit={handleSubmit}>

        {/* Conversation Name */}
        <div className="mb-6">
          <InputLabel htmlFor="name" value={t('conversation_name')} required />
          <TextInput
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            className="mt-1 block w-full"
            placeholder={t('conversation_name_placeholder')}
            icon="fa-comments"
            isFocused
            disabled={processing}
            required
          />
          <InputError message={errors.name} className="mt-2" />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <SecondaryButton
            type="button"
            onClick={handleClose}
            disabled={processing}
          >
            {t('cancel')}
          </SecondaryButton>

          <PrimaryButton
            type="submit"
            icon="fa-plus"
            disabled={processing || !data.name.trim()}
          >
            {processing ? t('creating') : t('create_conversation')}
          </PrimaryButton>
        </div>
      </form>
    </AppModal>
  );
}
