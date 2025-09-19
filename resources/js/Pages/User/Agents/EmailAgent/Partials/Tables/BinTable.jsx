import React from 'react';
import { Link, router } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import SelectableTable from '@/Components/SelectableTable';
import ActionButton from '@/Components/ActionButton';
import SearchBar from '@/Components/SearchBar';

export default function BinTable({ emails, queryParams }) {
  const { t } = useTrans();

  // Toggle star function
  const toggleStar = (emailId) => {
    router.patch(route('user.email-agent.toggle-star', emailId), {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Toggle read function
  const toggleRead = (emailId) => {
    router.patch(route('user.email-agent.toggle-read', emailId), {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Restore to inbox function
  const restore = (emailId) => {
    router.patch(route('user.email-agent.restore', emailId), {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Delete permanently function
  const deletePermanently = (emailId) => {
    if (confirm(t('confirm_delete_permanently'))) {
      router.delete(route('user.email-agent.delete-permanently', emailId), {
        preserveState: true,
        preserveScroll: true,
      });
    }
  };

  // Bulk action handlers
  const handleBulkMarkAsRead = async (ids) => {
    router.patch(route('user.email-agent.bulk.mark-read'), { ids }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleBulkMarkAsUnread = async (ids) => {
    router.patch(route('user.email-agent.bulk.mark-unread'), { ids }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleBulkStar = async (ids) => {
    router.patch(route('user.email-agent.bulk.star'), { ids }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleBulkUnStar = async (ids) => {
    router.patch(route('user.email-agent.bulk.unstar'), { ids }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleBulkMoveToSpam = async (ids) => {
    router.patch(route('user.email-agent.bulk.move-to-spam'), { ids }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleBulkRestore = async (ids) => {
    router.patch(route('user.email-agent.bulk.restore'), { ids }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleBulkDeletePermanently = async (ids) => {
    router.delete(route('user.email-agent.bulk.delete-permanently'), {
      data: { ids },
      preserveState: true,
      preserveScroll: true,
    });
  };


  // Define bulk actions for inbox
  const bulkActions = [
    {
      label: t('mark_as_read'),
      icon: 'fa-solid fa-envelope-open',
      handler: handleBulkMarkAsRead,
      variant: 'green'
    },
    {
      label: t('mark_as_unread'),
      icon: 'fa-solid fa-envelope',
      handler: handleBulkMarkAsUnread,
      variant: 'green'
    },
    {
      label: t('add_star'),
      icon: ' fa-solid fa-star ',
      handler: handleBulkStar,
      variant: 'green'
    },
    {
      label: t('remove_star'),
      icon: ' fa-star fa-regular ',
      handler: handleBulkUnStar,
      variant: 'green'
    },
    {
      label: t('restore_to_inbox'),
      icon: 'fa-solid fa-undo',
      handler: handleBulkRestore,
      variant: 'blue',
      requiresConfirmation: true,
      confirmMessageKey: 'confirm_restore_emails'
    },
    {
      label: t('move_to_spam'),
      icon: 'fa-solid fa-exclamation-circle',
      handler: handleBulkMoveToSpam,
      variant: 'yellow',
      requiresConfirmation: true,
      confirmMessageKey: 'confirm_move_to_spam'
    },
    {
      label: t('delete_permanently'),
      icon: 'fa-solid fa-trash-can',
      handler: handleBulkDeletePermanently,
      variant: 'delete',
      requiresConfirmation: true,
      confirmMessageKey: 'confirm_permanent_delete_bulk'
    },

  ];


  // Table configuration
  const columns = [
    { field: 'row_number', label: t('serial'), icon: 'fa-hashtag' },
    { field: 'from', label: t('from'), icon: 'fa-user' },
    { field: 'subject', label: t('subject'), icon: 'fa-envelope' },
    { field: 'received_at', label: t('received_at'), icon: 'fa-calendar' },
    { field: 'actions', label: t('actions'), icon: 'fa-gear', className: 'flex justify-center' }
  ];

  const sortOptions = [
    // { field: 'id', label: t('id') },
    { field: 'from_email', label: t('from') },
    { field: 'subject', label: t('subject') },
    { field: 'received_at', label: t('received_at') },
    { field: 'created_at', label: t('created_at') },
    { field: 'is_starred', label: t('starred') },
    { field: 'is_read', label: t('read') }
  ];

  const renderRow = (email) => (
    <>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100 opacity-70">
        {email.row_number}
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="flex flex-col opacity-70">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-user text-gray-500"></i>
            <span className="text-sm text-neutral-900 dark:text-neutral-100 ">
              {email.from_name || email.from_email}
            </span>
          </div>
          {email.from_name && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400 mx-6 ">
              {email.from_email}
            </span>
          )}
        </div>
      </td>
      <td className="px-3 py-4 whitespace-nowrap opacity-70">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-envelope text-gray-500"></i>
          <span className="text-sm text-neutral-900 dark:text-neutral-100 truncate max-w-xs ">
            {email.subject}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400 opacity-70">
        {new Date(email.received_at || email.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center justify-center gap-2">
          {/* Star - interactive but dimmed for deleted emails */}
          <button
            onClick={() => toggleStar(email.id)}
            className="hover:scale-110 transition-transform duration-200 opacity-50 hover:opacity-70"
          >
            {email.is_starred ? (
              <i className="fa-solid fa-star text-yellow-500 text-lg"></i>
            ) : (
              <i className="fa-regular fa-star text-gray-400 text-lg"></i>
            )}
          </button>

          {/* Read/Unread toggle - dimmed for deleted emails */}
          <button
            onClick={() => toggleRead(email.id)}
            className="hover:scale-110 transition-transform duration-200 opacity-50 hover:opacity-70"
            title={email.is_read ? t('mark_as_unread') : t('mark_as_read')}
          >
            {email.is_read ? (
              <i className="fa-solid fa-envelope-open text-blue-500 text-lg"></i>
            ) : (
              <i className="fa-solid fa-envelope text-green-500 text-lg"></i>
            )}
          </button>

          <ActionButton
            href={route('user.email-agent.view', email.id)}
            variant="info"
            icon="fa-eye"
            size="xs"
            as="a"
          >
            {t('view')}
          </ActionButton>
          <ActionButton
            onClick={() => restore(email.id)}
            variant="success"
            icon="fa-undo"
            size="xs"
            as="button"
          >
            {t('restore')}
          </ActionButton>
          <ActionButton
            onClick={() => deletePermanently(email.id)}
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

  // Gmail-style row styling function for deleted emails
  const getRowClassName = (email, index, isSelected) => {
    if (isSelected) return ''; // Let SelectableTable handle selected state

    if (!email.is_read) {
      // Unread emails have a white/light background (Gmail style)
      return 'bg-white dark:bg-neutral-800 hover:bg-blue-100/10 dark:hover:bg-blue-100/10';
    } else {
      // Read emails have a slightly gray background
      return 'bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-700';
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold leading-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <i className="fa-solid fa-trash text-gray-500"></i> {t('bin_emails')}
        </h2>
      </div>
      <div className="mb-4">
        <SearchBar
          placeholder={t('search')}
          defaultValue={queryParams.search || ''}
          queryKey="search"
          routeName="user.email-agent.bin.emails"
          icon="fa-magnifying-glass"
          pageParam="bin_page"
        />
      </div>
      <SelectableTable
        columns={columns}
        data={emails.data}
        renderRow={renderRow}
        pagination={emails}
        routeName="user.email-agent.bin.emails"
        sortOptions={sortOptions}
        defaultSortField="created_at"
        defaultSortDirection="desc"
        getRowClassName={getRowClassName}
        bulkActions={bulkActions}
        pageParam="bin_page"


      />
    </>
  );
}
