import React from 'react';
import { Link, router } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import SelectableTable from '@/Components/SelectableTable';
import ActionButton from '@/Components/ActionButton';
import SearchBar from '@/Components/SearchBar';

export default function SentTable({ emails, queryParams }) {
  const { t } = useTrans();

  // Delete sent message function
  const deleteSent = (emailId) => {
    router.delete(route('user.email-agent.response.bulk.delete-sent'), {
      data: { ids: [emailId] },
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Bulk action handlers
  const handleBulkDeleteSent = async (ids) => {
    router.delete(route('user.email-agent.response.bulk.delete-sent'), {
      data: { ids },
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Define bulk actions for sent messages
  const bulkActions = [
    {
      label: t('delete'),
      icon: 'fa-solid fa-trash-can',
      handler: handleBulkDeleteSent,
      variant: 'delete',
      requiresConfirmation: true,
      confirmMessageKey: 'confirm_delete_sent_messages'
    }
  ];

  // Table configuration
  const columns = [
    { field: 'row_number', label: t('serial'), icon: 'fa-hashtag' },
    { field: 'to_email', label: t('to'), icon: 'fa-user' },
    { field: 'from_email', label: t('from'), icon: 'fa-user' },
    { field: 'sent_at', label: t('sent_at'), icon: 'fa-calendar' },
    { field: 'actions', label: t('actions'), icon: 'fa-gear', className: 'flex justify-center' }
  ];

  const sortOptions = [
    // { field: 'id', label: t('id') },
    { field: 'to_email', label: t('to') },
    { field: 'from_email', label: t('from') },
    { field: 'sent_at', label: t('sent_at') },
    { field: 'created_at', label: t('created_at') }
  ];

  const renderRow = (email) => (
    <>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
        {email.row_number}
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-user text-blue-500"></i>
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {email.to_name || email.to_email}
            </span>
          </div>
          {email.to_name && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400 mx-6">
              {email.to_email}
            </span>
          )}
        </div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-user text-green-500"></i>
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {email.from_name || email.from_email}
            </span>
          </div>
          {email.from_name && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400 mx-6">
              {email.from_email}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
        {new Date(email.sent_at || email.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center justify-center gap-2">
          <ActionButton
            href={route('user.email-agent.view', email.message.id)}
            variant="info"
            icon="fa-eye"
            size="xs"
            as="a"
          >
            {t('view')}
          </ActionButton>
          <ActionButton
            onClick={() => deleteSent(email.id)}
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

  // Gmail-style row styling function
  const getRowClassName = (email, index, isSelected) => {
    if (isSelected) return ''; // Let SelectableTable handle selected state
    return 'bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-700';
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold leading-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <i className="fa-solid fa-paper-plane text-green-500"></i> {t('sent_emails')}
        </h2>
      </div>
      <div className="mb-4">
        <SearchBar
          placeholder={t('search')}
          defaultValue={queryParams.search || ''}
          queryKey="search"
          routeName="user.email-agent.sent.emails"
          icon="fa-magnifying-glass"
          pageParam="sent_page"

        />
      </div>
      <SelectableTable
        columns={columns}
        data={emails.data}
        renderRow={renderRow}
        pagination={emails}
        routeName="user.email-agent.sent.emails"
        sortOptions={sortOptions}
        defaultSortField="created_at"
        defaultSortDirection="desc"
        getRowClassName={getRowClassName}
        bulkActions={bulkActions}
        pageParam="sent_page"

      />
    </>
  );
}
