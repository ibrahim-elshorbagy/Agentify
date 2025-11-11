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

  // Helper to convert old format to HH:mm string
  const convertToTimeString = (timeData) => {
    if (typeof timeData === 'string' && timeData.match(/^\d{2}:\d{2}$/)) {
      return timeData; // Already in HH:mm format
    }

    // Handle old format {hour, minute, period}
    if (timeData && typeof timeData === 'object') {
      const { hour, minute, period } = timeData;
      let hour24 = parseInt(hour);
      if (period === 'pm' && hour24 !== 12) hour24 += 12;
      if (period === 'am' && hour24 === 12) hour24 = 0;
      return `${hour24.toString().padStart(2, '0')}:${minute.padStart(2, '0')}`;
    }

    return '09:00'; // Default fallback
  };

  useEffect(() => {
    if (isOpen) {
      if (source === 'gmail') {
        const googleSettings = initialSettings?.email_agent_google_fetch_time
          ? JSON.parse(initialSettings.email_agent_google_fetch_time)
          : ['09:00'];

        const timeStrings = Array.isArray(googleSettings)
          ? googleSettings.map(convertToTimeString)
          : ['09:00'];

        setGoogleTimes(timeStrings);
        setData({
          email_agent_google_fetch_time: timeStrings,
          email_agent_outlook_fetch_time: [],
        });
      } else {
        const outlookSettings = initialSettings?.email_agent_outlook_fetch_time
          ? JSON.parse(initialSettings.email_agent_outlook_fetch_time)
          : ['09:00'];

        const timeStrings = Array.isArray(outlookSettings)
          ? outlookSettings.map(convertToTimeString)
          : ['09:00'];

        setOutlookTimes(timeStrings);
        setData({
          email_agent_google_fetch_time: [],
          email_agent_outlook_fetch_time: timeStrings,
        });
      }
    }
  }, [initialSettings, isOpen, source]);

  const addGoogleTime = () => {
    const newTimes = [...googleTimes, '09:00'];
    setGoogleTimes(newTimes);
    setData('email_agent_google_fetch_time', newTimes);
  };

  const removeGoogleTime = (index) => {
    if (googleTimes.length > 1) {
      const newTimes = googleTimes.filter((_, i) => i !== index);
      setGoogleTimes(newTimes);
      setData('email_agent_google_fetch_time', newTimes);
    }
  };

  const updateGoogleTime = (index, value) => {
    const newTimes = [...googleTimes];
    newTimes[index] = value;
    setGoogleTimes(newTimes);
    setData('email_agent_google_fetch_time', newTimes);
  };

  const addOutlookTime = () => {
    const newTimes = [...outlookTimes, '09:00'];
    setOutlookTimes(newTimes);
    setData('email_agent_outlook_fetch_time', newTimes);
  };

  const removeOutlookTime = (index) => {
    if (outlookTimes.length > 1) {
      const newTimes = outlookTimes.filter((_, i) => i !== index);
      setOutlookTimes(newTimes);
      setData('email_agent_outlook_fetch_time', newTimes);
    }
  };

  const updateOutlookTime = (index, value) => {
    const newTimes = [...outlookTimes];
    newTimes[index] = value;
    setOutlookTimes(newTimes);
    setData('email_agent_outlook_fetch_time', newTimes);
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
                      {t('remove')}
                    </ActionButton>
                  )}
                </div>
              ))}
            </div>
            {errors.email_agent_google_fetch_time && (
              <InputError message={errors.email_agent_google_fetch_time} className="mt-2" />
            )}
          </div>
        )}

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
                      {t('remove')}
                    </ActionButton>
                  )}
                </div>
              ))}
            </div>
            {errors.email_agent_outlook_fetch_time && (
              <InputError message={errors.email_agent_outlook_fetch_time} className="mt-2" />
            )}
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
