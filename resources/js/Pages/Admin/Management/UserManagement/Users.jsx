import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Tabs from '@/Components/Tabs';
import SearchBar from '@/Components/SearchBar';
import PrimaryButton from '@/Components/PrimaryButton';
import CreateModal from './Partials/Modals/CreateModal';
import EditModal from './Partials/Modals//EditModal';
import UsersTable from './Partials/Tables/UsersTable';
import { useTrans } from '@/Hooks/useTrans';

export default function Users({ auth, users, admins, roles, queryParams = null }) {
  queryParams = queryParams || {};
  const { t } = useTrans();

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Toggle Create Modal
  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  // Toggle Edit Modal
  const toggleEditModal = (user = null) => {
    setEditingUser(user);
    setIsEditModalOpen(!isEditModalOpen);
  };


  // === Regular Users Tab ===
  const usersContent = (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold leading-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <i className="fa-solid fa-users text-blue-500"></i> {t('users')}
        </h2>
        <PrimaryButton
          type="button"
          onClick={toggleCreateModal}
          icon="fa-plus"
          size="large"
        >
          <span className="max-xs:hidden">{t('create_user')}</span>
        </PrimaryButton>
      </div>

      <div className="mb-4">
        <SearchBar
          placeholder={t('search_users')}
          defaultValue={queryParams.name || ''}
          pageParam="users_page"
          queryKey="name"
          routeName="admin.users.index"
          icon="fa-magnifying-glass"
        />
      </div>


      <UsersTable users={users} onEdit={toggleEditModal} pageParam="users_page" />
    </div>
  );

  // === Admins Tab ===
  const adminsContent = (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold leading-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <i className="fa-solid fa-user-shield text-red-500"></i> {t('admins')}
        </h2>
        <PrimaryButton
          type="button"
          onClick={toggleCreateModal}
          icon="fa-plus"
          size="large"
        >
          <span className="max-xs:hidden">{t('create_user')}</span>
        </PrimaryButton>
      </div>

      <div className="mb-4">
        <SearchBar
          placeholder={t('search_admins')}
          defaultValue={queryParams.name || ''}
          queryKey="name"
          routeName="admin.users.index"
          icon="fa-magnifying-glass"
        />
      </div>

      <UsersTable users={admins} onEdit={toggleEditModal} pageParam="admins_page"/>
    </div>
  );

  const tabs = [
    {
      title: t('manage_users'),
      icon: 'fa-users',
      content: usersContent,
    },
    {
      title: t('manage_admins'),
      icon: 'fa-user-shield',
      content: adminsContent,
    },
  ];

  return (
    <AppLayout user={auth.user}>
      <Head title={t('user_management')} />

      <div className="m-3 xl:m-5">
        <div className="overflow-hidden rounded-2xl shadow-lg dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
          <div className="p-4 text-neutral-900 dark:text-neutral-100">
            <Tabs tabs={tabs} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={toggleCreateModal}
        roles={roles}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => toggleEditModal()}
        user={editingUser}
        roles={roles}
      />
    </AppLayout>
  );
}
