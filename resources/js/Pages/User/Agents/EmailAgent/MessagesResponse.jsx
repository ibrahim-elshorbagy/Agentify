import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useTrans } from '@/Hooks/useTrans';
import SentTable from './Partials/Tables/SentTable';
import DraftTable from './Partials/Tables/DraftTable';

export default function MessagesResponse({ type, queryParams = null, emails = [], emailCounts = {} }) {
  queryParams = queryParams || {};
  const { t } = useTrans();

  const renderTable = () => {
    switch (type) {
      case 'sent':
        return <SentTable emails={emails} queryParams={queryParams} />;
      case 'draft':
        return <DraftTable emails={emails} queryParams={queryParams} />;
      default:
        return <div className="text-center py-8 text-neutral-600 dark:text-neutral-400">{t('no_emails_found')}</div>;
    }
  };

  return (
    <AppLayout>
      <div className="m-3 xl:m-5">
        {/* Email Counts Cards */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sent Emails Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 dark:hover:shadow-green-400/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fa-solid fa-paper-plane text-white text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-900 dark:text-green-100">{t('sent')}</h3>
                <p className="text-sm text-green-600 dark:text-green-400">{t('sent_emails')}</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-1">
              {emailCounts.sent || 0}
            </div>
          </div>

          {/* Draft Emails Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 dark:hover:shadow-yellow-400/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fa-solid fa-file text-white text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-100">{t('draft')}</h3>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">{t('draft_emails')}</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-100 mb-1">
              {emailCounts.draft || 0}
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
