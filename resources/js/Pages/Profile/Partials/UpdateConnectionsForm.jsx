import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import EmailTestModal from './Modals/EmailTestModal';

export default function UpdateConnectionsForm({ className = '' }) {
  const { t } = useTrans();
  const user = usePage().props.auth.user;
  const { flash } = usePage().props;
  const [processing, setProcessing] = useState(false);

  // Get connection status from server props
  const { hasGmailConnected, hasMicrosoftConnected } = usePage().props;
  const [connections, setConnections] = useState({
    google: hasGmailConnected || false,
    microsoft: hasMicrosoftConnected || false,
  });

  // Email test modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailTestData, setEmailTestData] = useState(null);

  const handleConnect = (provider) => {
    setProcessing(true);
    window.location.href = route('connections.connect', { provider });
  };

  const handleDisconnect = (provider) => {
    if (confirm(t('confirm_disconnect_provider', { provider: provider === 'google' ? 'Gmail' : 'Outlook' }))) {
      router.delete(route('connections.disconnect', { provider }), {
        onStart: () => setProcessing(true),
        onFinish: () => setProcessing(false),
        onSuccess: () => {
          setConnections(prev => ({ ...prev, [provider]: false }));
        }
      });
    }
  };

  const handleTest = async (provider) => {
    try {
      setProcessing(true);
      const response = await fetch(route('connections.test', { provider }));
      const data = await response.json();

      if (data.success && data.data) {
        // Show email data in modal
        setEmailTestData(data.data);
        setIsEmailModalOpen(true);
      } else if (data.success) {
        alert(`✅ ${data.message}`);
      } else {
        alert(`❌ Test Failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Test connection failed:', error);
      alert('❌ Connection test failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const closeEmailModal = () => {
    setIsEmailModalOpen(false);
    setEmailTestData(null);
  };  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {t('email_connections')}
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {t('connect_email_accounts_description')}
        </p>
      </header>

      <div className="mt-6 space-y-6">
        {/* Gmail Connection */}
        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center space-x-3 gap-2">
            <div className="flex-shrink-0">
              <i className="fab fa-google text-2xl text-red-500"></i>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Gmail
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {connections.google ? t('connected') : t('not_connected')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {connections.google ? (
              <>
                {/* <SecondaryButton
                  type="button"
                  onClick={() => handleTest('google')}
                  disabled={processing}
                  icon="fa-envelope-open-text"
                className='min-w-[180px]'

                >
                  {t('fetch_latest_email')}
                </SecondaryButton> */}
                <DangerButton
                  type="button"
                  onClick={() => handleDisconnect('google')}
                  disabled={processing}
                  icon="fa-unlink"
                className='min-w-[180px]'

                >
                  {t('disconnect')}
                </DangerButton>
              </>
            ) : (
              <PrimaryButton
                type="button"
                onClick={() => handleConnect('google')}
                disabled={processing}
                icon="fa-link"
                className='min-w-[180px]'
              >
                {t('connect_gmail')}
              </PrimaryButton>
            )}
          </div>
        </div>

        {/* Microsoft Connection */}
        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex items-center space-x-3 gap-2">
            <div className="flex-shrink-0">
              <i className="fab fa-microsoft text-2xl text-blue-500"></i>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Outlook
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {connections.microsoft ? t('connected') : t('not_connected')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {connections.microsoft ? (
              <>
                {/* <SecondaryButton
                  type="button"
                  onClick={() => handleTest('microsoft')}
                  disabled={processing}
                  icon="fa-envelope-open-text"
                className='min-w-[180px]'

                >
                  {t('fetch_latest_email')}
                </SecondaryButton> */}
                <DangerButton
                  type="button"
                  onClick={() => handleDisconnect('microsoft')}
                  disabled={processing}
                  icon="fa-unlink"
                className='min-w-[180px]'

                >
                  {t('disconnect')}
                </DangerButton>
              </>
            ) : (
              <PrimaryButton
                type="button"
                onClick={() => handleConnect('microsoft')}
                disabled={processing}
                icon="fa-link"
                className='min-w-[180px]'

              >
                {t('connect_outlook')}
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex gap-2">
          <div className="flex-shrink-0">
            <i className="fas fa-info-circle text-blue-400"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {t('about_email_connections')}
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p>{t('email_connections_description')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Email Test Modal */}
      <EmailTestModal
        isOpen={isEmailModalOpen}
        onClose={closeEmailModal}
        emailData={emailTestData}
      />
    </section>
  );
}
