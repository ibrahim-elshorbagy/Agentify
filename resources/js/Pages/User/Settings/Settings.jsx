import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import SearchBar from '@/Components/SearchBar';
import PrimaryButton from '@/Components/PrimaryButton';
import CreateModal from './Partials/Modals/CreateModal';
import EditModal from './Partials/Modals/EditModal';
import SettingsTable from './Partials/Tables/SettingsTable';
import { useTrans } from '@/Hooks/useTrans';

export default function Settings({ auth, settings, queryParams = null }) {
  queryParams = queryParams || {};
  const { t } = useTrans();

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);

  // Toggle Create Modal
  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  // Toggle Edit Modal
  const toggleEditModal = (setting = null) => {
    setEditingSetting(setting);
    setIsEditModalOpen(!isEditModalOpen);
  };

  return (
    <AppLayout>
      <Head title={t('settings')} />
      <div className="py-8 bg-gradient-to-br from-green-50 via-neutral-50 to-green-100 dark:from-green-900 dark:via-neutral-900 dark:to-green-800 min-h-screen">
        <div className="mx-auto  sm:px-6 lg:px-8">

          {/* Settings Management Section */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            <div className="p-6">

              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold leading-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <i className="fa-solid fa-gear text-green-500"></i> {t('user_settings')}
                </h2>
                <PrimaryButton
                  type="button"
                  onClick={toggleCreateModal}
                  icon="fa-plus"
                  size="large"
                >
                  <span className="max-xs:hidden">{t('create_setting')}</span>
                </PrimaryButton>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <SearchBar
                  placeholder={t('search_settings')}
                  defaultValue={queryParams.search || ''}
                  queryKey="search"
                  routeName="settings.index"
                  icon="fa-magnifying-glass"
                />
              </div>

              {/* Settings Table */}
              <SettingsTable
                settings={settings}
                onEdit={toggleEditModal}
              />

            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={toggleCreateModal}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={toggleEditModal}
        setting={editingSetting}
      />

    </AppLayout>
  );
}

