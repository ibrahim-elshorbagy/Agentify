import React from 'react';
import { useTrans } from '@/Hooks/useTrans';
import SelectableTable from '@/Components/SelectableTable';
import { router } from '@inertiajs/react';
import ActionButton from '@/Components/ActionButton';

export default function ResponseTable({ emails, queryParams, type }) {
  const { t } = useTrans();

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

  const handleBulkDeleteSent = async (ids) => {
    router.delete(route('user.email-agent.response.bulk.delete-sent'), {
      data: { ids },
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Define bulk actions based on type (sent/draft)
  const getBulkActions = () => {
    if (type === 'draft') {
      return [
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
    }

    if (type === 'sent') {
      return [
        {
          label: t('delete'),
          icon: 'fa-solid fa-trash-can',
          handler: handleBulkDeleteSent,
          variant: 'delete',
          requiresConfirmation: true,
          confirmMessageKey: 'confirm_delete_sent_messages'
        }
      ];
    }

    return [];
  };

  // Table configuration
  const columns = [
    { field: 'row_number', label: t('serial'), icon: 'fa-hashtag' },
    { field: 'to_email', label: t('to'), icon: 'fa-user' },
    { field: 'from_email', label: t('from'), icon: 'fa-user' },
    ...(type === 'sent'
      ? [{ field: 'sent_at', label: t('sent_at'), icon: 'fa-calendar' }]
      : [{ field: 'created_at', label: t('created_at'), icon: 'fa-calendar' }]
    ),
    { field: 'actions', label: t('actions'), icon: 'fa-gear', className: 'flex justify-center' }
  ];

  const sortOptions = [
    { field: 'to_email', label: t('to') },
    { field: 'from_email', label: t('from') },
    ...(type === 'sent'
      ? [{ field: 'sent_at', label: t('sent_at') }]
      : []
    ),
    { field: 'created_at', label: t('created_at') }
  ];

  // Individual action handlers using bulk actions with single ID
  const sendDraft = (emailId) => {
    router.patch(route('user.email-agent.response.bulk.send-drafts'), { ids: [emailId] }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const deleteDraft = (emailId) => {
    router.delete(route('user.email-agent.response.bulk.delete-drafts'), {
      data: { ids: [emailId] },
      preserveState: true,
      preserveScroll: true,
    });
  };

  const deleteSent = (emailId) => {
    router.delete(route('user.email-agent.response.bulk.delete-sent'), {
      data: { ids: [emailId] },
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Custom row renderer with proper styling like DraftTable and SentTable
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
        {type === 'sent'
          ? new Date(email.sent_at || email.created_at).toLocaleDateString()
          : new Date(email.created_at).toLocaleDateString()
        }
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

          {type === 'draft' && (
            <>
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
            </>
          )}

          {type === 'sent' && (
            <ActionButton
              onClick={() => deleteSent(email.id)}
              variant="delete"
              icon="fa-trash-can"
              size="xs"
              as="button"
            >
              {t('delete')}
            </ActionButton>
          )}
        </div>
      </td>
    </>
  );

  // Gmail-style row styling function like DraftTable and SentTable
  const getRowClassName = (email, index, isSelected) => {
    if (isSelected) return ''; // Let SelectableTable handle selected state

    if (type === 'draft') {
      return 'bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-800/30';
    } else {
      return 'bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-700';
    }
  };

  const routeName = type === 'sent'
    ? 'user.email-agent.sent.emails'
    : 'user.email-agent.draft.emails';

  return (
    <SelectableTable
      columns={columns}
      data={emails.data}
      renderRow={renderRow}
      pagination={emails}
      routeName={routeName}
      sortOptions={sortOptions}
      defaultSortField="created_at"
      defaultSortDirection="desc"
      getRowClassName={getRowClassName}
      bulkActions={getBulkActions()}
      pageParam={`${type}_page`}
      queryParams={queryParams}
    />
  );
}
