import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useTrans } from '@/Hooks/useTrans';
import InboxTable from './Partials/Tables/InboxTable';
import SpamTable from './Partials/Tables/SpamTable';
import BinTable from './Partials/Tables/BinTable';

export default function Messages({ type, queryParams = null, emails = [], emailCounts = {} }) {
  queryParams = queryParams || {};
  const { t } = useTrans();

  const renderTable = () => {
    switch (type) {
      case 'inbox':
        return <InboxTable emails={emails} queryParams={queryParams} />;
      case 'spam':
        return <SpamTable emails={emails} queryParams={queryParams} />;
      case 'bin':
        return <BinTable emails={emails} queryParams={queryParams} />;
      default:
        return <InboxTable emails={emails} queryParams={queryParams} />;
    }
  };

  return (
    <AppLayout>
      <div className="m-3 xl:m-5">
        {/* Email counts sidebar could go here */}
        <div className="mb-4 flex gap-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
            <span className="text-sm font-medium">{t('inbox')}: {emailCounts.inbox_total || 0}</span>
            <span className="text-xs text-blue-600 ml-2">({emailCounts.inbox_unread || 0} {t('unread')})</span>
          </div>
          <div className="bg-red-100 dark:bg-red-900 p-4 rounded-lg">
            <span className="text-sm font-medium">{t('spam')}: {emailCounts.spam_total || 0}</span>
            <span className="text-xs text-red-600 ml-2">({emailCounts.spam_unread || 0} {t('unread')})</span>
          </div>
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
            <span className="text-sm font-medium">{t('bin')}: {emailCounts.bin_total || 0}</span>
            <span className="text-xs text-gray-600 ml-2">({emailCounts.bin_unread || 0} {t('unread')})</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl shadow-lg dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
          <div className="p-4 text-neutral-900 dark:text-neutral-100">
            {renderTable()}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
