import React from 'react';
import { Link, router } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import SelectableTable from '@/Components/SelectableTable';
import ActionButton from '@/Components/ActionButton';
import SearchBar from '@/Components/SearchBar';

export default function InboxTable({ emails, queryParams }) {
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

  // Move to spam function
  const moveToSpam = (emailId) => {
    router.patch(route('user.email-agent.move-to-spam', emailId), {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Move to bin function
  const moveToBin = (emailId) => {
    router.patch(route('user.email-agent.move-to-bin', emailId), {}, {
      preserveState: true,
      preserveScroll: true,
    });
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

  const handleBulkMoveToBin = async (ids) => {
    router.patch(route('user.email-agent.bulk.move-to-bin'), { ids }, {
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
      label: t('move_to_spam'),
      icon: 'fa-solid fa-exclamation-circle',
      handler: handleBulkMoveToSpam,
      variant: 'yellow',
      requiresConfirmation: true,
      confirmMessageKey: 'confirm_move_to_spam'
    },
    {
      label: t('move_to_bin'),
      icon: 'fa-solid fa-trash-can',
      handler: handleBulkMoveToBin,
      variant: 'delete',
      requiresConfirmation: true,
      confirmMessageKey: 'confirm_move_to_bin'
    }
  ];

  // Table configuration
  const columns = [
    { field: 'id', label: t('id'), icon: 'fa-hashtag' },
    { field: 'from', label: t('from'), icon: 'fa-user' },
    { field: 'subject', label: t('subject'), icon: 'fa-envelope' },
    { field: 'received_at', label: t('received_at'), icon: 'fa-calendar' },
    { field: 'actions', label: t('actions'), icon: 'fa-gear', className: 'flex justify-center' }
  ];

  const sortOptions = [
    { field: 'id', label: t('id') },
    { field: 'from_email', label: t('from') },
    { field: 'subject', label: t('subject') },
    { field: 'received_at', label: t('received_at') },
    { field: 'created_at', label: t('created_at') },
    { field: 'is_starred', label: t('starred') },
    { field: 'is_read', label: t('read') }
  ];

  const renderRow = (email) => (
    <>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
        {email.id}
      </td>
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-user text-blue-500"></i>
            <span className={`text-sm font-medium text-neutral-900 dark:text-neutral-100 ${!email.is_read ? 'font-bold' : 'font-normal'}`}>
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
      <td className="px-3 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-envelope text-green-500"></i>
          <span className={`text-sm text-neutral-900 dark:text-neutral-100 truncate max-w-xs ${!email.is_read ? 'font-bold' : 'font-normal'}`}>
            {email.subject}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
        {new Date(email.received_at || email.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center justify-center gap-2">
          {/* Star */}
          <button
            onClick={() => toggleStar(email.id)}
            className="hover:scale-110 transition-transform duration-200"
          >
            {email.is_starred ? (
              <i className="fa-solid fa-star text-yellow-500 text-lg hover:text-yellow-600"></i>
            ) : (
              <i className="fa-regular fa-star text-gray-400 text-lg hover:text-yellow-500"></i>
            )}
          </button>

          {/* Read/Unread toggle */}
          <button
            onClick={() => toggleRead(email.id)}
            className="hover:scale-110 transition-transform duration-200"
            title={email.is_read ? t('mark_as_unread') : t('mark_as_read')}
          >
            {email.is_read ? (
              <i className="fa-solid fa-envelope-open text-blue-500 text-lg hover:text-blue-600"></i>
            ) : (
              <i className="fa-solid fa-envelope text-green-500 text-lg hover:text-green-600"></i>
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
            onClick={() => moveToSpam(email.id)}
            variant="delete"
            icon="fa-exclamation-circle"
            size="xs"
            as="button"
          >
            {t('spam')}
          </ActionButton>
          <ActionButton
            onClick={() => moveToBin(email.id)}
            variant="delete"
            icon="fa-trash-can"
            size="xs"
            as="button"
          >
            {t('bin')}
          </ActionButton>
        </div>
      </td>
    </>
  );

  // Gmail-style row styling function
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
          <i className="fa-solid fa-inbox text-blue-500"></i> {t('inbox_emails')}
        </h2>
      </div>
      <div className="mb-4">
        <SearchBar
          placeholder={t('search')}
          defaultValue={queryParams.search || ''}
          queryKey="search"
          routeName="user.email-agent.inbox.emails"
          icon="fa-magnifying-glass"
        pageParam="inbox_page"

        />
      </div>
      <SelectableTable
        columns={columns}
        data={emails.data}
        renderRow={renderRow}
        pagination={emails}
        routeName="user.email-agent.inbox.emails"
        sortOptions={sortOptions}
        defaultSortField="created_at"
        defaultSortDirection="desc"
        getRowClassName={getRowClassName}
        bulkActions={bulkActions}
        pageParam="inbox_page"
      />
    </>
  );
}
