import ActionButton from '@/Components/ActionButton';
import SelectableTable from '@/Components/SelectableTable';
import React from 'react';
import { useTrans } from '@/Hooks/useTrans';
import { router } from '@inertiajs/react';

export default function UsersTable({ users, onEdit }) {
  const { t } = useTrans();

  // Individual user actions
  const toggleBlock = (userId, currentBlockedStatus) => {
    router.put(route('admin.users.update', userId), {
      blocked: !currentBlockedStatus
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const deleteUser = (user) => {
    if (confirm(`${t('are_you_sure_delete')} "${user.name}"?`)) {
      router.delete(route('admin.users.destroy', user.id), {
        preserveScroll: true,
      });
    }
  };

  // Bulk action handlers
  const handleBulkBlock = async (ids) => {
    router.patch(route('admin.users.bulk.block'), { ids }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleBulkUnblock = async (ids) => {
    router.patch(route('admin.users.bulk.unblock'), { ids }, {
      preserveState: true,
      preserveScroll: true,
    });
  };


  const handleBulkDelete = async (ids) => {
    router.delete(route('admin.users.bulk.delete'), {
      data: { ids },
      preserveState: true,
      preserveScroll: true,
    });
  };
  
  // Define bulk actions for users
  const bulkActions = [
    {
      label: t('block_users'),
      icon: 'fa-solid fa-ban',
      handler: handleBulkBlock,
      variant: 'yellow',
      requiresConfirmation: true,
      confirmMessageKey: 'confirm_block_users'
    },
    {
      label: t('unblock_users'),
      icon: 'fa-solid fa-check-circle',
      handler: handleBulkUnblock,
      variant: 'green',
      requiresConfirmation: true,
      confirmMessageKey: 'confirm_unblock_users'
    },
    {
      label: t('delete_users'),
      icon: 'fa-solid fa-trash-can',
      handler: handleBulkDelete,
      variant: 'delete',
      requiresConfirmation: true,
      confirmMessageKey: 'confirm_delete_users'
    }
  ];

  // Table configuration
  const columns = [
    { field: 'id', label: t('id'), icon: 'fa-hashtag' },
    { field: 'name', label: t('name'), icon: 'fa-user' },
    { field: 'email', label: t('email_address'), icon: 'fa-envelope' },
    { field: 'username', label: t('username'), icon: 'fa-at' },
    { field: 'status', label: t('status'), icon: 'fa-circle-info' },
    { field: 'roles', label: t('role'), icon: 'fa-user-shield' },
    { field: 'created_at', label: t('created_at'), icon: 'fa-calendar' },
    { field: 'actions', label: t('actions'), icon: 'fa-gear', className: 'flex justify-center' }
  ];

  const sortOptions = [
    { field: 'id', label: t('id') },
    { field: 'name', label: t('name') },
    { field: 'email', label: t('email_address') },
    { field: 'username', label: t('username') },
    { field: 'blocked', label: t('status') },
    { field: 'created_at', label: t('created_at') }
  ];

  const renderRow = (user) => (
    <>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
        {user.id}
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-user text-blue-500"></i>
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {user.name}
          </span>
        </div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-envelope text-purple-500"></i>
          <span className="text-sm text-neutral-900 dark:text-neutral-100">
            {user.email}
          </span>
        </div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-at text-green-500"></i>
          <span className="text-sm text-neutral-900 dark:text-neutral-100">
            {user.username}
          </span>
        </div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.blocked
            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        }`}>
          <i className={`fa-solid ${user.blocked ? 'fa-ban' : 'fa-check-circle'} mr-1`}></i>
          {user.blocked ? t('blocked') : t('active')}
        </span>
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        {user.roles.map(role => (
          <span
            key={role.id}
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-1 ${
              role.name === 'admin'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}
          >
            <i className="fa-solid fa-shield mr-1"></i>
            {role.name === 'admin' ? t('admin') : t('user_role')}
          </span>
        ))}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
        {new Date(user.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center justify-center gap-2">
          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              onEdit(user);
            }}
            variant="info"
            icon="fa-edit"
            size="xs"
            as="button"
          >
            {t('edit')}
          </ActionButton>

          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              toggleBlock(user.id, user.blocked);
            }}
            variant={user.blocked ? "green" : "yellow"}
            icon={user.blocked ? "fa-check-circle" : "fa-ban"}
            size="xs"
            as="button"
          >
            {user.blocked ? t('unblock') : t('block')}
          </ActionButton>

          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              deleteUser(user);
            }}
            variant="delete"
            icon="fa-trash-can"
            size="xs"
            as="button"
          >
            {t('delete')}
          </ActionButton>
        </div>
      </td>
    </>
  );

  // Row styling function - similar to InboxTable
  const getRowClassName = (user, index, isSelected) => {
    if (isSelected) return ''; // Let SelectableTable handle selected state

    if (user.blocked) {
      // Blocked users have red background
      return 'bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900';
    } else {
      // Active users alternate between neutral backgrounds
      return index % 2 === 0
        ? 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700'
        : 'bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800';
    }
  };

  return (
    <SelectableTable
      columns={columns}
      data={users ? users.data : []}
      pagination={users}
      routeName="admin.users.index"
      queryParams={{}}
      sortOptions={sortOptions}
      defaultSortField={'created_at'}
      defaultSortDirection={'desc'}
      renderRow={renderRow}
      getRowClassName={getRowClassName}
      bulkActions={bulkActions}
    />
  );
}
