import React from 'react';
import { Link } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import SelectableTable from '@/Components/SelectableTable';
import ActionButton from '@/Components/ActionButton';
import SearchBar from '@/Components/SearchBar';

export default function InboxTable({ emails, queryParams }) {
  const { t } = useTrans();

  // Table configuration
  const columns = [
    { field: 'id', label: t('id'), icon: 'fa-hashtag' },
    { field: 'from', label: t('from'), icon: 'fa-user' },
    { field: 'subject', label: t('subject'), icon: 'fa-envelope' },
    { field: 'status', label: t('status'), icon: 'fa-circle-info' },
    { field: 'received_at', label: t('received_at'), icon: 'fa-calendar' },
    { field: 'actions', label: t('actions'), icon: 'fa-gear', className: 'flex justify-center' }
  ];

  const sortOptions = [
    { field: 'id', label: t('id') },
    { field: 'from_email', label: t('from') },
    { field: 'subject', label: t('subject') },
    { field: 'received_at', label: t('received_at') },
    { field: 'created_at', label: t('created_at') }
  ];

  const renderRow = (email) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
        {email.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-user text-blue-500"></i>
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {email.from_name || email.from_email}
            </span>
          </div>
          {email.from_name && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-6">
              {email.from_email}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-envelope text-green-500"></i>
          <span className="text-sm text-neutral-900 dark:text-neutral-100 truncate max-w-xs">
            {email.subject}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            !email.is_read
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
          }`}>
            <i className={`fa-solid ${!email.is_read ? 'fa-circle' : 'fa-circle-check'} mr-1`}></i>
            {!email.is_read ? t('unread') : t('read')}
          </span>
          {email.is_starred && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
              <i className="fa-solid fa-star mr-1"></i>
              {t('starred')}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
        {new Date(email.received_at || email.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center justify-center space-x-2">
          <ActionButton
            // href={route('user.email-agent.view', email.id)}
            variant="edit"
            icon="fa-eye"
            size="xs"
            as="a"
          >
            {t('view')}
          </ActionButton>
        </div>
      </td>
    </>
  );

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold leading-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <i className="fa-solid fa-inbox text-blue-500"></i> {t('inbox_emails')}
        </h2>
      </div>
      <div className="mb-4">
        <SearchBar
          placeholder={t('search_from_subject')}
          defaultValue={queryParams.from || queryParams.subject || ''}
          queryKey="from"
          routeName="user.email-agent.inbox.emails"
          icon="fa-magnifying-glass"
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
      />
    </>
  );
}
