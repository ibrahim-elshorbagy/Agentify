import AppModal from '@/Components/AppModal';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { useTrans } from '@/Hooks/useTrans';

export default function MoveEmailsModal({ isOpen, onClose, selectedEmails, currentFolder }) {
  const { t } = useTrans();
  const [folder, setFolder] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    router.patch(route('user.email-agent.bulk.update-folder', { folder }), {
      ids: selectedEmails
    }, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setProcessing(false);
        setFolder('');
        onClose();
      },
      onError: () => {
        setProcessing(false);
      },
    });
  };

  const folderOptions = [
    { value: '', label: t('select') },
    { value: 'inbox', label: t('inbox_emails') },
    { value: 'promotions', label: t('promotions') },
    { value: 'social', label: t('social') },
    { value: 'personal', label: t('personal') },
    { value: 'clients', label: t('clients') },
    { value: 'team', label: t('team') },
    { value: 'finance', label: t('finance') },
    { value: 'hr', label: t('hr') },
    { value: 'spam', label: t('spam_emails') },
    { value: 'bin', label: t('bin_emails') },
  ].filter(option => option.value !== currentFolder);

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('move_emails_to_folder')}
      icon="fa-folder"
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <SelectInput
            name="folder"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            options={folderOptions}
            label={t('select_destination_folder')}
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <SecondaryButton type="button" onClick={onClose}>
            {t('cancel')}
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={processing}>
            {t('move')}
          </PrimaryButton>
        </div>
      </form>
    </AppModal>
  );
}
