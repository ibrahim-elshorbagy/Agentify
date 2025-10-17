import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useTrans } from '@/Hooks/useTrans';
import ResponseTable from './Partials/Tables/ResponseTable';
import Tabs from '@/Components/Tabs';
import SearchBar from '@/Components/SearchBar';

export default function MessagesResponse({ type, gmailEmails, outlookEmails, emailCounts, queryParams = null }) {
  queryParams = queryParams || {};
  const { t } = useTrans();

  const combinedEmailCounts = {
    sent_total: (emailCounts.gmail?.sent_total || 0) + (emailCounts.outlook?.sent_total || 0),
    draft_total: (emailCounts.gmail?.draft_total || 0) + (emailCounts.outlook?.draft_total || 0),
  };

  const gmailContent = (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold leading-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <i className={`fa-solid ${type === 'sent' ? 'fa-paper-plane text-green-500' : 'fa-file text-yellow-500'}`}></i>
          {type === 'sent' ? t('sent_emails') : t('draft_emails')} - Gmail
        </h2>
      </div>
      <div className="mb-4">
        <SearchBar
          placeholder={t('search')}
          defaultValue={queryParams.search || ''}
          queryKey="search"
          routeName={type === 'sent' ? 'user.email-agent.sent.emails' : 'user.email-agent.draft.emails'}
          icon="fa-magnifying-glass"
          pageParam="gmail_page"
        />
      </div>
      <div className="text-neutral-900 dark:text-neutral-100">
        <ResponseTable emails={gmailEmails} queryParams={queryParams} type={type} />
      </div>
    </div>
  );

  const outlookContent = (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold leading-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <i className={`fa-solid ${type === 'sent' ? 'fa-paper-plane text-green-500' : 'fa-file text-yellow-500'}`}></i>
          {type === 'sent' ? t('sent_emails') : t('draft_emails')} - Outlook
        </h2>
      </div>
      <div className="mb-4">
        <SearchBar
          placeholder={t('search')}
          defaultValue={queryParams.search || ''}
          queryKey="search"
          routeName={type === 'sent' ? 'user.email-agent.sent.emails' : 'user.email-agent.draft.emails'}
          icon="fa-magnifying-glass"
          pageParam="outlook_page"
        />
      </div>
      <div className="text-neutral-900 dark:text-neutral-100">
        <ResponseTable emails={outlookEmails} queryParams={queryParams} type={type} />
      </div>
    </div>
  );

  const tabs = [
    {
      title: 'Gmail',
      icon: 'fa-envelope',
      content: gmailContent,
    },
    {
      title: 'Outlook',
      icon: 'fa-envelope',
      content: outlookContent,
    },
  ];

  return (
    <AppLayout>
      <div className="m-3 xl:m-5">
        {/* Email Counts Cards */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sent Emails Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 dark:hover:shadow-green-400/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <i className="fa-solid fa-paper-plane text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-900 dark:text-green-100">{t('sent')}</h3>
                  <p className="text-sm text-green-600 dark:text-green-400">{t('sent_emails')}</p>
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-1">
                  {combinedEmailCounts.sent_total || 0}
                </div>
              </div>
              <div className="w-2 h-16 bg-green-500 rounded-full opacity-20"></div>
            </div>
          </div>

          {/* Draft Emails Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 dark:hover:shadow-yellow-400/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <i className="fa-solid fa-file text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-100">{t('draft')}</h3>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">{t('draft_emails')}</p>
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-100 mb-1">
                  {combinedEmailCounts.draft_total || 0}
                </div>
              </div>
              <div className="w-2 h-16 bg-yellow-500 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl shadow-lg dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </AppLayout>
  );
}
