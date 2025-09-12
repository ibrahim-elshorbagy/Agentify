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
      <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100 opacity-70">
        {email.id}
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

          <ActionButton
            href={route('user.email-agent.view', email.id)}
            variant="edit"
            icon="fa-eye"
            size="xs"
            as="a"
          >
            {t('view')}
          </ActionButton>
          <ActionButton
            // href={route('user.email-agent.restore', email.id)}
            variant="success"
            icon="fa-undo"
            size="xs"
            as="a"
          >
            {t('restore')}
          </ActionButton>
          <ActionButton
            // href={route('user.email-agent.delete-permanently', email.id)}
            variant="danger"
            icon="fa-trash-can"
            size="xs"
            as="a"
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
          placeholder={t('search_deleted_emails')}
          defaultValue={queryParams.from || queryParams.subject || ''}
          queryKey="from"
          routeName="user.email-agent.bin.emails"
          icon="fa-magnifying-glass"
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
      />
    </>
  );
}
