
import React from 'react';
import { Link, router } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import SelectableTable from '@/Components/SelectableTable';
import ActionButton from '@/Components/ActionButton';
import SearchBar from '@/Components/SearchBar';

export default function DraftTable({ emails, queryParams }) {
  const { t } = useTrans();

  // Delete draft function
  const deleteDraft = (emailId) => {
    if (confirm(t('confirm_delete_draft_permanently'))) {
      router.delete(route('user.email-agent.response.delete-draft', emailId), {
        preserveState: true,
        preserveScroll: true,
      });
    }
  };

  // Send draft function
  const sendDraft = (emailId) => {
    router.patch(route('user.email-agent.response.send-draft', emailId), {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Bulk action handlers
  const handleBulkDeleteDrafts = async (ids) => {
    router.delete(route('user.email-agent.response.bulk.delete-drafts'), {
      data: { ids },
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleBulkSendDrafts = async (ids) => {
    router.patch(route('user.email-agent.response.bulk.send-drafts'), { ids }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Define bulk actions for draft messages
  const bulkActions = [
    {
      label: t('send_drafts'),
      icon: 'fa-solid fa-paper-plane',
      handler: handleBulkSendDrafts,
      variant: 'green',
      requiresConfirmation: true,
      confirmMessageKey: 'confirm_send_drafts'
    },
    {
      label: t('delete_drafts'),
      icon: 'fa-solid fa-trash-can',
      handler: handleBulkDeleteDrafts,
      variant: 'delete',
      requiresConfirmation: true,
      confirmMessageKey: 'confirm_delete_drafts'
    }
  ];

  // Table configuration
  const columns = [
    { field: 'row_number', label: t('serial'), icon: 'fa-hashtag' },
    { field: 'to_email', label: t('to'), icon: 'fa-user' },
    { field: 'from_email', label: t('from'), icon: 'fa-user' },
    { field: 'created_at', label: t('created_at'), icon: 'fa-calendar' },
    { field: 'actions', label: t('actions'), icon: 'fa-gear', className: 'flex justify-center' }
  ];

  const sortOptions = [
    // { field: 'id', label: t('id') },
    { field: 'to_email', label: t('to') },
    { field: 'from_email', label: t('from') },
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
        {new Date(email.created_at).toLocaleDateString()}
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
            onClick={() => sendDraft(email.id)}
            variant="success"
            icon="fa-paper-plane"
            size="xs"
            as="button"
          >
            {t('send')}
          </ActionButton>
          <ActionButton
            onClick={() => deleteDraft(email.id)}
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
    return 'bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-800/30';
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold leading-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <i className="fa-solid fa-file text-yellow-500"></i> {t('draft_emails')}
        </h2>
      </div>
      <div className="mb-4">
        <SearchBar
          placeholder={t('search')}
          defaultValue={queryParams.search || ''}
          queryKey="search"
          routeName="user.email-agent.draft.emails"
          icon="fa-magnifying-glass"
          pageParam="draft_page"

        />
      </div>
      <SelectableTable
        columns={columns}
        data={emails.data}
        renderRow={renderRow}
        pagination={emails}
        routeName="user.email-agent.draft.emails"
        sortOptions={sortOptions}
        defaultSortField="created_at"
        defaultSortDirection="desc"
        getRowClassName={getRowClassName}
        bulkActions={bulkActions}
        pageParam="draft_page"

      />
    </>
  );
}
