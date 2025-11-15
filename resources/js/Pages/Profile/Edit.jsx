import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateLanguagePreferences from './Partials/UpdateLanguagePreferences';
import UpdateProfileImageForm from './Partials/UpdateProfileImageForm';
import UpdateConnectionsForm from './Partials/UpdateConnectionsForm';
import AppLayout from '@/Layouts/AppLayout';
import ThemeToggle from '@/Components/ThemeToggle';
import { useState, useEffect } from 'react';
import { useTrans } from '@/Hooks/useTrans';

export default function Edit({ mustVerifyEmail, status }) {
  const { t } = useTrans();
  const [activeSection, setActiveSection] = useState('profile-info');

  // Check if URL has a hash and set the active section on load
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      setActiveSection(hash);
    }

    // Listen for hash changes
    const handleHashChange = () => {
      const newHash = window.location.hash.substring(1);
      if (newHash) {
        setActiveSection(newHash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Handle menu item click
  const handleMenuClick = (section) => {
    setActiveSection(section);
    window.location.hash = section;
  };

  return (
    <AppLayout>
      <Head title={t('profile_settings')} />

      <div className='m-3 xl:m-5'>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {t('profile_settings')}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            {t('manage_account_settings')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar with navigation */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden sticky top-4">
              <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30">
                <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {t('settings_menu')}
                </h2>
              </div>
              <div className="p-2 space-y-2">
                <button
                  onClick={() => handleMenuClick('profile-info')}
                  className={`flex w-full items-center gap-2 p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all ${activeSection === 'profile-info' ? 'bg-green-500/10 text-black dark:text-white font-medium' : ''}`}
                >
                  <i className={`fa-solid fa-user-circle ${activeSection === 'profile-info' ? 'text-green-500' : ''}`}></i>
                  <span>{t('profile_information')}</span>
                </button>
                <button
                  onClick={() => handleMenuClick('security')}
                  className={`flex w-full items-center gap-2 p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all ${activeSection === 'security' ? 'bg-green-500/10 text-black dark:text-white font-medium' : ''}`}
                >
                  <i className={`fa-solid fa-shield-alt ${activeSection === 'security' ? 'text-green-500' : ''}`}></i>
                  <span>{t('security')}</span>
                </button>
                <button
                  onClick={() => handleMenuClick('account')}
                  className={`flex w-full items-center gap-2 p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all ${activeSection === 'account' ? 'bg-green-500/10 text-black dark:text-white font-medium' : ''}`}
                >
                  <i className="fa-solid fa-user-minus text-red-500"></i>
                  <span>{t('account_management')}</span>
                </button>
                <button
                  onClick={() => handleMenuClick('connections')}
                  className={`flex w-full items-center gap-2 p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all ${activeSection === 'connections' ? 'bg-green-500/10 text-black dark:text-white font-medium' : ''}`}
                >
                  <i className={`fa-solid fa-link ${activeSection === 'connections' ? 'text-green-500' : ''}`}></i>
                  <span>{t('email_connections')}</span>
                </button>
                <button
                  onClick={() => handleMenuClick('appearance')}
                  className={`flex w-full items-center gap-2 p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all ${activeSection === 'appearance' ? 'bg-green-500/10 text-black dark:text-white font-medium' : ''}`}
                >
                  <i className={`fa-solid fa-palette ${activeSection === 'appearance' ? 'text-green-500' : ''}`}></i>
                  <span>{t('appearance')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-2 min-h-[60vh]">
            {/* Content based on active section */}
            {activeSection === 'profile-info' && (
              <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-fadeIn">
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30 flex items-center justify-between">
                  <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <i className="fa-solid fa-user-circle text-green-500"></i>
                    {t('profile_information')}
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-8">
                    <UpdateProfileImageForm />
                    <hr className="border-neutral-200 dark:border-neutral-700" />
                    <UpdateProfileInformationForm
                      mustVerifyEmail={mustVerifyEmail}
                      status={status}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-fadeIn">
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30 flex items-center justify-between">
                  <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <i className="fa-solid fa-shield-alt text-green-500"></i>
                    {t('security')}
                  </h2>
                </div>
                <div className="p-6">
                  <UpdatePasswordForm />
                </div>
              </div>
            )}

            {/* Account Management Section */}
            {activeSection === 'account' && (
              <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-red-200 dark:border-red-900/30 overflow-hidden animate-fadeIn">
                <div className="p-4 border-b border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/10 flex items-center justify-between">
                                    <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <i className="fa-solid fa-exclamation-triangle text-red-500"></i>
                    {t('danger_zone')}
                  </h2>
                </div>
                <div className="p-6">
                  <DeleteUserForm />
                </div>
              </div>
            )}

            {/* Email Connections Section */}
            {activeSection === 'connections' && (
              <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-fadeIn">
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30 flex items-center justify-between">
                  <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <i className="fa-solid fa-link text-green-500"></i>
                    {t('email_connections')}
                  </h2>
                </div>
                <div className="p-6">
                  <UpdateConnectionsForm />
                </div>
              </div>
            )}

            {/* Appearance Section */}
            {activeSection === 'appearance' && (
              <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800  animate-fadeIn">
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/30 flex items-center justify-between">
                  <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <i className="fa-solid fa-palette text-green-500"></i>
                    {t('appearance')}
                  </h2>
                </div>
                <div className="p-6">
                  <div className="max-w-xl">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">{t('theme_settings')}</h3>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                          {t('customize_appearance')}
                        </p>
                      </div>

                      <div className="mt-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            <div>
                              <h4 className="font-medium text-neutral-900 dark:text-neutral-100">{t('theme_mode')}</h4>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                {t('choose_theme')}
                              </p>
                            </div>
                            <div>
                              <ThemeToggle className="px-3 py-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors" />
                            </div>
                          </div>

                          <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            <UpdateLanguagePreferences />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
