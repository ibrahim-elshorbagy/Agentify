import AppModal from '@/Components/AppModal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import { useEffect } from 'react';

export default function EditMessageModal({ isOpen, onClose, message }) {
  const { t } = useTrans();
  const { data, setData, post, errors, reset, processing } = useForm({
    body_text: '',
    from_email: '',
    from_name: '',
    to_email: '',
    to_name: '',
    status: 'draft',
    _method: 'PUT',
  });

  useEffect(() => {
    if (message && isOpen) {
      setData({
        body_text: message.body_text || '',
        from_email: message.from_email || '',
        from_name: message.from_name || '',
        to_email: message.to_email || '',
        to_name: message.to_name || '',
        status: message.status || 'draft',
        _method: 'PUT',
      });
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, isOpen]);

  if (!message) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('user.email-agent.update-message', message.id), {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const statusOptions = [
    { value: 'draft', label: t('draft') },
    { value: 'sent', label: t('sent') },
  ];

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('edit_response')}
      icon="fa-pen-to-square"
      size="xl"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <InputLabel htmlFor="from_email" value={t('from_email')} required />
          <TextInput
            id="from_email"
            name="from_email"
            type="email"
            value={data.from_email}
            className="mt-1 block w-full"
            onChange={(e) => setData('from_email', e.target.value)}
            required
            icon="fa-envelope"
          />
          <InputError message={errors.from_email} className="mt-2" />
        </div>
        <div className="mb-4">
          <InputLabel htmlFor="from_name" value={t('from_name')} required />
          <TextInput
            id="from_name"
            name="from_name"
            value={data.from_name}
            className="mt-1 block w-full"
            onChange={(e) => setData('from_name', e.target.value)}
            required
            icon="fa-user"
          />
          <InputError message={errors.from_name} className="mt-2" />
        </div>
        <div className="mb-4">
          <InputLabel htmlFor="to_email" value={t('to_email')} required />
          <TextInput
            id="to_email"
            name="to_email"
            type="email"
            value={data.to_email}
            className="mt-1 block w-full"
            onChange={(e) => setData('to_email', e.target.value)}
            required
            icon="fa-envelope"
          />
          <InputError message={errors.to_email} className="mt-2" />
        </div>
        <div className="mb-4">
          <InputLabel htmlFor="to_name" value={t('to_name')} required />
          <TextInput
            id="to_name"
            name="to_name"
            value={data.to_name}
            className="mt-1 block w-full"
            onChange={(e) => setData('to_name', e.target.value)}
            required
            icon="fa-user"
          />
          <InputError message={errors.to_name} className="mt-2" />
        </div>
        <div className="mb-4">
          <InputLabel htmlFor="body_text" value={t('body_text')} required />
          <TextArea
            id="body_text"
            name="body_text"
            value={data.body_text}
            className="mt-1 block w-full"
            onChange={(e) => setData('body_text', e.target.value)}
            required
            rows={6}
            placeholder={t('type_your_message')}
          />
          <InputError message={errors.body_text} className="mt-2" />
        </div>
        <div className="mb-4">
          <InputLabel htmlFor="status" value={t('status')} required />
          <SelectInput
            name="status"
            value={data.status}
            onChange={(e) => setData('status', e.target.value)}
            options={statusOptions}
            icon="fa-circle-check"
            required
          />
          <InputError message={errors.status} className="mt-2" />
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
