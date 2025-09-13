import ActionButton from '@/Components/ActionButton';
import SelectableTable from '@/Components/SelectableTable';
import React from 'react';
import { useTrans } from '@/Hooks/useTrans';
import { router } from '@inertiajs/react';

export default function UsersTable({ users, onEdit }) {
  const { t } = useTrans();

  const deleteUser = (user) => {
    if (confirm(`${t('are_you_sure_delete')} "${user.name}"?`)) {
      router.delete(route('admin.users.destroy', user.id), {
        preserveScroll: true,
      });
    }
  };

  // Bulk delete handler
  const handleBulkDelete = (ids) => {
    if (confirm(t('confirm_bulk_delete').replace(':count', ids.length))) {
      router.delete(route('admin.users.bulk-destroy'), {
        data: { ids },
        preserveScroll: true,
      });
    }
  };

  // Table configuration
  const columns = [
    { field: 'id', label: t('id'), icon: 'fa-hashtag' },
    { field: 'name', label: t('name'), icon: 'fa-user' },
    { field: 'email', label: t('email_address'), icon: 'fa-envelope' },
    { field: 'username', label: t('username'), icon: 'fa-at' },
    { field: 'roles', label: t('role'), icon: 'fa-user-shield' },
    { field: 'created_at', label: t('created_at'), icon: 'fa-calendar' },
    { field: 'actions', label: t('actions'), icon: 'fa-gear', className: 'flex justify-center' }
  ];

  const sortOptions = [
    { field: 'id', label: t('id') },
    { field: 'name', label: t('name') },
    { field: 'email', label: t('email_address') },
    { field: 'username', label: t('username') },
    { field: 'created_at', label: t('created_at') }
  ];

  return (
    <SelectableTable
      columns={columns}
      data={users ? users.data : []}
      pagination={users}
      routeName="admin.users.index"
      queryParams={{}}
      sortOptions={sortOptions}
      defaultSortField={'id'}
      defaultSortDirection={'desc'}
      onBulkDelete={handleBulkDelete}
      renderRow={(user) => (
        <>
          <td className="px-3 py-2 font-mono">{user.id}</td>
          <td className="px-3 py-2">{user.name}</td>
          <td className="px-3 py-2">{user.email}</td>
          <td className="px-3 py-2">{user.username}</td>
          <td className="px-3 py-2">
            {user.roles.map(role => (
              <span
                key={role.id}
                className={`inline-block px-2 py-1 text-xs rounded-full mr-1 ${
                  role.name === 'admin'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                }`}
              >
                {role.name === 'admin' ? t('admin') : t('user_role')}
              </span>
            ))}
          </td>
          <td className="px-3 py-2">{new Date(user.created_at).toLocaleDateString()}</td>
          <td className="px-3 py-2 flex justify-center gap-2">
            <ActionButton
              variant="edit"
              icon="fa-pen-to-square"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(user);
              }}
            >
              {t('edit')}
            </ActionButton>
            <ActionButton
              variant="delete"
              icon="fa-trash"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                deleteUser(user);
              }}
            >
              {t('delete')}
            </ActionButton>
          </td>
        </>
      )}
    />
  );
}
