import AppModal from '@/Components/AppModal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import ActionButton from '@/Components/ActionButton';
import { useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import { useState, useEffect } from 'react';

export default function EmailScheduleModal({ isOpen, onClose, initialSettings = null, source = 'gmail' }) {
  const { t } = useTrans();
  const [googleTimes, setGoogleTimes] = useState(['09:00']);
  const [outlookTimes, setOutlookTimes] = useState(['09:00']);

  const { data, setData, post, errors, processing } = useForm({
    email_agent_google_fetch_time: [],
    email_agent_outlook_fetch_time: [],
  });

  // Helper function to convert old format to time string
  const convertToTimeString = (oldFormat) => {
    if (typeof oldFormat === 'string') return oldFormat; // Already new format
    const { hour, minute, period } = oldFormat;
    let hour24 = parseInt(hour);
    if (period === 'pm' && hour24 !== 12) hour24 += 12;
    if (period === 'am' && hour24 === 12) hour24 = 0;
    return `${hour24.toString().padStart(2, '0')}:${minute.padStart(2, '0')}`;
  };

  // Helper function to convert time string to old format for backend
  const convertToOldFormat = (timeString) => {
    const [hour24, minute] = timeString.split(':');
    let hour12 = parseInt(hour24);
    const period = hour12 >= 12 ? 'pm' : 'am';
    if (hour12 === 0) hour12 = 12;
    if (hour12 > 12) hour12 -= 12;
    return { hour: hour12.toString(), minute, period };
  };

  useEffect(() => {
    if (isOpen) {
      if (source === 'gmail') {
        // Parse existing Google settings if available
        const googleSettings = initialSettings?.email_agent_google_fetch_time
          ? JSON.parse(initialSettings.email_agent_google_fetch_time)
          : [{ hour: '9', minute: '0', period: 'am' }];

        // Convert to time strings
        const timeStrings = googleSettings.map(convertToTimeString);
        setGoogleTimes(timeStrings);

        // Convert back to old format for backend compatibility
        const backendFormat = timeStrings.map(convertToOldFormat);
        setData({
          email_agent_google_fetch_time: backendFormat,
          email_agent_outlook_fetch_time: [], // Keep empty for non-active source
        });
      } else {
        // Parse existing Outlook settings if available
        const outlookSettings = initialSettings?.email_agent_outlook_fetch_time
          ? JSON.parse(initialSettings.email_agent_outlook_fetch_time)
          : [{ hour: '9', minute: '0', period: 'am' }];

        // Convert to time strings
        const timeStrings = outlookSettings.map(convertToTimeString);
        setOutlookTimes(timeStrings);

        // Convert back to old format for backend compatibility
        const backendFormat = timeStrings.map(convertToOldFormat);
        setData({
          email_agent_google_fetch_time: [], // Keep empty for non-active source
          email_agent_outlook_fetch_time: backendFormat,
        });
      }
    }
  }, [initialSettings, isOpen, source]);

  const addGoogleTime = () => {
    const newTimes = [...googleTimes, '09:00'];
    setGoogleTimes(newTimes);
    const backendFormat = newTimes.map(convertToOldFormat);
    setData('email_agent_google_fetch_time', backendFormat);
  };

  const removeGoogleTime = (index) => {
    if (googleTimes.length > 1) {
      const newTimes = googleTimes.filter((_, i) => i !== index);
      setGoogleTimes(newTimes);
      const backendFormat = newTimes.map(convertToOldFormat);
      setData('email_agent_google_fetch_time', backendFormat);
    }
  };

  const updateGoogleTime = (index, value) => {
    const newTimes = [...googleTimes];
    newTimes[index] = value;
    setGoogleTimes(newTimes);
    const backendFormat = newTimes.map(convertToOldFormat);
    setData('email_agent_google_fetch_time', backendFormat);
  };

  const addOutlookTime = () => {
    const newTimes = [...outlookTimes, '09:00'];
    setOutlookTimes(newTimes);
    const backendFormat = newTimes.map(convertToOldFormat);
    setData('email_agent_outlook_fetch_time', backendFormat);
  };

  const removeOutlookTime = (index) => {
    if (outlookTimes.length > 1) {
      const newTimes = outlookTimes.filter((_, i) => i !== index);
      setOutlookTimes(newTimes);
      const backendFormat = newTimes.map(convertToOldFormat);
      setData('email_agent_outlook_fetch_time', backendFormat);
    }
  };

  const updateOutlookTime = (index, value) => {
    const newTimes = [...outlookTimes];
    newTimes[index] = value;
    setOutlookTimes(newTimes);
    const backendFormat = newTimes.map(convertToOldFormat);
    setData('email_agent_outlook_fetch_time', backendFormat);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('user.email-agent.schedule.update'), {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={source === 'gmail' ? t('google_fetch_times') : t('outlook_fetch_times')}
      icon="fa-clock"
      size="lg"
    >
      <div className="mb-4">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {t('schedule_description')}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Google Fetch Times - Only show if source is gmail */}
        {source === 'gmail' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <InputLabel value={t('google_fetch_times')} />
            <ActionButton
              type="button"
              onClick={addGoogleTime}
              icon="fa-plus"
              variant="success"
              size="xs"
            >
              {t('add_time')}
            </ActionButton>
          </div>

          <div className="space-y-3">
            {googleTimes.map((time, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className="flex-1">
                  <TextInput
                    type="time"
                    name={`google_time_${index}`}
                    value={time}
                    onChange={(e) => updateGoogleTime(index, e.target.value)}
                    className="text-sm"
                    placeholder="09:00"
                  />
                </div>
                {googleTimes.length > 1 && (
                  <ActionButton
                    type="button"
                    onClick={() => removeGoogleTime(index)}
                    icon="fa-trash"
                    variant="delete"
                    size="xs"
                  >
                    {t('remove_time')}
                  </ActionButton>
                )}
              </div>
            ))}
          </div>
          <InputError message={errors.email_agent_google_fetch_time} className="mt-2" />
        </div>
        )}

        {/* Outlook Fetch Times - Only show if source is outlook */}
        {source === 'outlook' && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <InputLabel value={t('outlook_fetch_times')} />
            <ActionButton
              type="button"
              onClick={addOutlookTime}
              icon="fa-plus"
              variant="success"
              size="xs"
            >
              {t('add_time')}
            </ActionButton>
          </div>

          <div className="space-y-3">
            {outlookTimes.map((time, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className="flex-1">
                  <TextInput
                    type="time"
                    name={`outlook_time_${index}`}
                    value={time}
                    onChange={(e) => updateOutlookTime(index, e.target.value)}
                    className="text-sm"
                    placeholder="09:00"
                  />
                </div>
                {outlookTimes.length > 1 && (
                  <ActionButton
                    type="button"
                    onClick={() => removeOutlookTime(index)}
                    icon="fa-trash"
                    variant="delete"
                    size="xs"
                  >
                    {t('remove_time')}
                  </ActionButton>
                )}
              </div>
            ))}
          </div>
          <InputError message={errors.email_agent_outlook_fetch_time} className="mt-2" />
        </div>
        )}

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
            {processing ? t('saving') : t('save')}
          </PrimaryButton>
        </div>
      </form>
    </AppModal>
  );
}
