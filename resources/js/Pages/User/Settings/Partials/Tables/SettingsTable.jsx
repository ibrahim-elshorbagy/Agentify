import ActionButton from '@/Components/ActionButton';
import SelectableTable from '@/Components/SelectableTable';
import React from 'react';
import { useTrans } from '@/Hooks/useTrans';
import { router } from '@inertiajs/react';

export default function SettingsTable({ settings, onEdit }) {
  const { t } = useTrans();

  // Individual setting actions
  const deleteSetting = (setting) => {
    if (confirm(t('are_you_sure_delete_setting'))) {
      router.delete(route('settings.destroy', setting.id), {
        preserveState: true,
        preserveScroll: true,
      });
    }
  };

  // Bulk action handlers
  const handleBulkDelete = async (ids) => {
    router.delete(route('settings.bulk.delete'), {
      data: { ids },
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Define bulk actions for settings
  const bulkActions = [
    {
      label: t('delete_settings'),
      icon: 'fa-solid fa-trash-can',
      handler: handleBulkDelete,
      variant: 'delete',
      requiresConfirmation: true,
      confirmMessageKey: 'confirm_delete_settings'
    }
  ];

  // Table configuration
  const columns = [
    { field: 'row_number', label: t('serial'), icon: 'fa-hashtag' },
    { field: 'name', label: t('setting_name'), icon: 'fa-tag' },
    { field: 'key', label: t('setting_key'), icon: 'fa-key' },
    { field: 'value', label: t('setting_value'), icon: 'fa-file-text' },
    { field: 'created_at', label: t('created_at'), icon: 'fa-calendar' },
    { field: 'actions', label: t('actions'), icon: 'fa-gear', className: 'flex justify-center' }
  ];

  const sortOptions = [
    { field: 'id', label: t('serial') },
    { field: 'name', label: t('setting_name') },
    { field: 'key', label: t('setting_key') },
    { field: 'created_at', label: t('created_at') }
  ];

  // Row renderer
  const renderRow = (setting) => (
    <>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
        {setting.row_number}
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-tag text-blue-500"></i>
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {setting.name}
          </span>
        </div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-key text-purple-500"></i>
          <span className="text-sm font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
            {setting.key}
          </span>
        </div>
      </td>
      <td className="px-3 py-4">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-file-text text-green-500"></i>
          <span className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xs truncate">
            {setting.value}
          </span>
        </div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
        {new Date(setting.created_at).toLocaleDateString()}
      </td>
      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center justify-center gap-2">

          {/* Edit Button */}
          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              onEdit(setting);
            }}
            variant="info"
            icon="fa-edit"
            size="xs"
            as="button"
          >
            {t('edit')}
          </ActionButton>

          {/* Delete Button */}
          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              deleteSetting(setting);
            }}
            variant="delete"
            icon="fa-trash"
            size="xs"
            as="button"
          >
            {t('delete')}
          </ActionButton>

        </div>
      </td>
    </>
  );

  return (
    <SelectableTable
      columns={columns}
      data={settings ? settings.data : []}
      pagination={settings}
      routeName="settings.index"
      queryParams={{}}
      renderRow={renderRow}
      idField="id"
      bulkActions={bulkActions}
      sortOptions={sortOptions}
      defaultSortField="id"
      defaultSortDirection="desc"
      getRowClassName={(setting) =>
        'hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors'
      }
    />
  );
}
