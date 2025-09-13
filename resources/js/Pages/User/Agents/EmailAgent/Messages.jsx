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
        {/* Email counts sidebar */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Inbox Count */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <i className="fa-solid fa-inbox text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">{t('inbox')}</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">{t('email_management')}</p>
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                  {emailCounts.inbox_total || 0}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  {emailCounts.inbox_unread || 0} {t('unread')}
                </div>
              </div>
              <div className="w-2 h-16 bg-blue-500 rounded-full opacity-20"></div>
            </div>
          </div>

          {/* Spam Count */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 dark:hover:shadow-red-400/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <i className="fa-solid fa-exclamation-circle text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-900 dark:text-red-100">{t('spam')}</h3>
                  <p className="text-sm text-red-600 dark:text-red-400">{t('filtered_emails')}</p>
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-red-900 dark:text-red-100 mb-1">
                  {emailCounts.spam_total || 0}
                </div>
                <div className="text-sm text-red-600 dark:text-red-400">
                  {emailCounts.spam_unread || 0} {t('unread')}
                </div>
              </div>
              <div className="w-2 h-16 bg-red-500 rounded-full opacity-20"></div>
            </div>
          </div>

          {/* Bin Count */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/30 dark:to-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/10 dark:hover:shadow-gray-400/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center shadow-lg">
                  <i className="fa-solid fa-trash text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('bin')}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('deleted_emails')}</p>
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {emailCounts.bin_total || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {emailCounts.bin_unread || 0} {t('unread')}
                </div>
              </div>
              <div className="w-2 h-16 bg-gray-500 rounded-full opacity-20"></div>
            </div>
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
