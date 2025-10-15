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

    post(route('user.qna-agent.conversations.store'), {
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
      className="backdrop-blur-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Conversation Name */}
        <div className="space-y-3">
          <InputLabel htmlFor="name" value={t('conversation_name')} required />
          <TextInput
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            className="rounded-2xl border-neutral-200/50 dark:border-neutral-700/50 focus:border-green-300 dark:focus:border-green-600 focus:ring-green-300 dark:focus:ring-green-600 shadow-lg"
            placeholder={t('conversation_name_placeholder')}
            icon="fa-comments"
            isFocused
            disabled={processing}
            required
          />
          <InputError message={errors.name} className="mt-2" />
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
            icon="fa-plus"
            disabled={processing || !data.name.trim()}
            className="rounded-xl px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            {processing ? t('creating') : t('create_conversation')}
          </PrimaryButton>
        </div>
      </form>
    </AppModal>
  );
}
