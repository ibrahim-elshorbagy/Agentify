import React, { useMemo } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { useTrans } from '@/Hooks/useTrans';

export default function Settings({ auth, settings }) {
  const { t } = useTrans();

  // Define folders
  const folders = useMemo(() => [
    { key: 'spam', label: t('folder_spam') },
    { key: 'promotions', label: t('folder_promotions') },
    { key: 'social', label: t('folder_social') },
    { key: 'personal', label: t('folder_personal') },
    { key: 'clients', label: t('folder_clients') },
    { key: 'team', label: t('folder_team') },
    { key: 'finance', label: t('folder_finance') },
    { key: 'hr', label: t('folder_hr') },
    { key: 'other', label: t('folder_other') },
  ], [t]);

  // Define actions
  const actions = useMemo(() => [
    { key: 'is_read', label: t('is_read'), icon: 'fa-envelope-open' },
    { key: 'is_starred', label: t('is_starred'), icon: 'fa-star' },
    { key: 'is_bin', label: t('is_bin'), icon: 'fa-trash' },
    { key: 'is_archived', label: t('is_archived'), icon: 'fa-box-archive' },
    // { key: 'write_a_draft', label: t('write_a_draft'), icon: 'fa-pen-to-square' },
    // { key: 'auto_sent', label: t('auto_sent'), icon: 'fa-paper-plane' },
  ], [t]);

  // Build settings map
  const settingsMap = useMemo(() => {
    const map = {};
    if (settings && settings.data) {
      settings.data.forEach((s) => {
        map[s.key] = s.value === 'true' || s.value === '1' || s.value === true;
      });
    }
    return map;
  }, [settings]);

  // Initialize form with all settings
  const initialData = useMemo(() => {
    const data = {};
    folders.forEach((folder) => {
      actions.forEach((action) => {
        const key = `folder_${folder.key}_${action.key}`;
        data[key] = settingsMap[key] || false;
      });
    });
    return data;
  }, [folders, actions, settingsMap]);

  const { data, setData, put, processing, reset } = useForm(initialData);

  const handleToggle = (folderKey, actionKey) => {
    const key = `folder_${folderKey}_${actionKey}`;
    setData(key, !data[key]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    put(route('settings.update'), {
      preserveScroll: true,
      onSuccess: () => {
        // Settings updated successfully
      },
    });
  };

  const handleReset = () => {
    reset();
  };

  return (
    <AppLayout>
      <Head title={t('auto_settings')} />

      <div className="py-8 bg-gradient-to-br from-green-50 via-neutral-50 to-green-100 dark:from-green-900 dark:via-neutral-900 dark:to-green-800 min-h-screen">
        <div className="mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold leading-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <i className="fa-solid fa-gear text-green-500"></i> {t('auto_settings')}
                  </h2>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    {t('auto_settings_subtitle')}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {folders.map((folder) => (
                    <div
                      key={folder.key}
                      className="p-4 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                        <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                          <i className="fa-solid fa-folder text-green-500 text-xs"></i>
                          {folder.label}
                        </div>
                      </div>
                      <div className="space-y-2">
                        {actions.map((action) => {
                          const key = `folder_${folder.key}_${action.key}`;
                          return (
                            <label
                              key={action.key}
                              className="flex items-center gap-2 p-2 rounded-lg hover:bg-white dark:hover:bg-neutral-700 transition-colors cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={data[key] || false}
                                onChange={() => handleToggle(folder.key, action.key)}
                                disabled={processing}
                                className="w-4 h-4 rounded text-green-600 border-neutral-300 dark:border-neutral-600 focus:ring-green-500 focus:ring-offset-0 disabled:opacity-50 cursor-pointer"
                              />
                              <span className="text-xs text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 flex items-center gap-1.5">
                                <i className={`fa-solid ${action.icon} text-[10px] text-neutral-400`}></i>
                                {action.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <i className="fa-solid fa-circle-info text-blue-500 mt-0.5"></i>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {t('auto_settings_note')}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <PrimaryButton
                    type="button"
                    onClick={handleReset}
                    className="bg-neutral-500 hover:bg-neutral-600"
                    icon="fa-rotate-left"
                    rounded="rounded-lg"
                    disabled={processing}
                  >
                    {t('reset')}
                  </PrimaryButton>
                  <PrimaryButton
                    type="submit"
                    icon="fa-floppy-disk"
                    rounded="rounded-lg"
                    disabled={processing}
                  >
                    {processing ? t('saving') : t('save_settings')}
                  </PrimaryButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
