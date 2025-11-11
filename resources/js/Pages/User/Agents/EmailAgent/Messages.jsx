import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useTrans } from '@/Hooks/useTrans';
import { router } from '@inertiajs/react';
import EmailTable from './Partials/Tables/EmailTable';
import Tabs from '@/Components/Tabs';
import SearchBar from '@/Components/SearchBar';
import ActionButton from '@/Components/ActionButton';
import MoveEmailsModal from './Partials/Modals/MoveEmailsModal';
import EmailScheduleModal from './Partials/Modals/EmailScheduleModal';

export default function Messages({ type, gmailEmails, outlookEmails, emailCounts, gmailAllIds = [], outlookAllIds = [], queryParams = null , scheduleSettings = {} }) {
  queryParams = queryParams || {};
  const { t } = useTrans();

  const combinedEmailCounts = {
    inbox_total: (emailCounts.gmail?.inbox_total || 0) + (emailCounts.outlook?.inbox_total || 0),
    inbox_unread: (emailCounts.gmail?.inbox_unread || 0) + (emailCounts.outlook?.inbox_unread || 0),
    spam_total: (emailCounts.gmail?.spam_total || 0) + (emailCounts.outlook?.spam_total || 0),
    spam_unread: (emailCounts.gmail?.spam_unread || 0) + (emailCounts.outlook?.spam_unread || 0),
    bin_total: (emailCounts.gmail?.bin_total || 0) + (emailCounts.outlook?.bin_total || 0),
    bin_unread: (emailCounts.gmail?.bin_unread || 0) + (emailCounts.outlook?.bin_unread || 0),
    starred_total: (emailCounts.gmail?.starred_total || 0) + (emailCounts.outlook?.starred_total || 0),
    archive_total: (emailCounts.gmail?.archive_total || 0) + (emailCounts.outlook?.archive_total || 0),
  };

  const [selectedItems, setSelectedItems] = useState([]);
  const allIds = [...gmailAllIds, ...outlookAllIds];

  // Modal state for moving emails
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [selectedEmailsForMove, setSelectedEmailsForMove] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(type);

  // Handle move emails modal
  const handleMoveEmails = (selectedEmails) => {
    setSelectedEmailsForMove(selectedEmails);
    setCurrentFolder(type);
    setIsMoveModalOpen(true);
  };

  // Schedule modal state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [currentSource, setCurrentSource] = useState('gmail'); // Track current active tab

  const gmailContent = (
    <div>
      <div className="text-neutral-900 dark:text-neutral-100">
        <EmailTable emails={gmailEmails} queryParams={queryParams} type={type} source="gmail" selectedItems={selectedItems} onSelectionChange={setSelectedItems} allIds={gmailAllIds} onMoveEmails={handleMoveEmails} setIsScheduleModalOpen={setIsScheduleModalOpen} setCurrentSource={setCurrentSource} scheduleSettings={scheduleSettings} />
      </div>
    </div>
  );

  const outlookContent = (
    <div>
      <div className="text-neutral-900 dark:text-neutral-100">
        <EmailTable emails={outlookEmails} queryParams={queryParams} type={type} source="outlook" selectedItems={selectedItems} onSelectionChange={setSelectedItems} allIds={outlookAllIds} onMoveEmails={handleMoveEmails} setIsScheduleModalOpen={setIsScheduleModalOpen} setCurrentSource={setCurrentSource} scheduleSettings={scheduleSettings} />
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
      <div className="min-h-screen"
        style={{
          backgroundImage: `
               radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.18) 2px, transparent 2px),
               radial-gradient(circle at 75% 75%, rgba(34, 197, 94, 0.14) 1px, transparent 1px),
               radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.10) 1.5px, transparent 1.5px),
               radial-gradient(circle at 10% 90%, rgba(20, 184, 166, 0.08) 1px, transparent 1px),
               radial-gradient(circle at 90% 10%, rgba(16, 185, 129, 0.06) 0.8px, transparent 0.8px)
             `,
          backgroundSize: '60px 60px, 40px 40px, 80px 80px, 100px 100px, 120px 120px',
          backgroundPosition: '0 0, 20px 20px, 40px 40px, 10px 10px, 60px 60px',
          animation: 'floatDots 20s ease-in-out infinite'
        }}>
        <div className="flex-1 p-3 xl:p-5">
          {/* Email counts sidebar */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-4">
            {/* Inbox Count */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 backdrop-blur-lg">
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
                    {combinedEmailCounts.inbox_total || 0}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    {combinedEmailCounts.inbox_unread || 0} {t('unread')}
                  </div>
                </div>
                <div className="w-2 h-16 bg-blue-500 rounded-full opacity-20"></div>
              </div>
            </div>

            {/* Spam Count */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 dark:hover:shadow-red-400/10 backdrop-blur-lg">
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
                    {combinedEmailCounts.spam_total || 0}
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {combinedEmailCounts.spam_unread || 0} {t('unread')}
                  </div>
                </div>
                <div className="w-2 h-16 bg-red-500 rounded-full opacity-20"></div>
              </div>
            </div>

            {/* Bin Count */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950/30 dark:to-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/10 dark:hover:shadow-gray-400/10 backdrop-blur-lg">
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
                    {combinedEmailCounts.bin_total || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {combinedEmailCounts.bin_unread || 0} {t('unread')}
                  </div>
                </div>
                <div className="w-2 h-16 bg-gray-500 rounded-full opacity-20"></div>
              </div>
            </div>
          </div>


          <div className=" rounded-2xl shadow-lg bg-green-50/80 dark:bg-green-900/20 border border-green-200 dark:border-green-700 backdrop-blur-lg">
            <Tabs tabs={tabs} />
          </div>
        </div>
      </div>

      {/* Move Emails Modal - Rendered at root level */}
      <MoveEmailsModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        selectedEmails={selectedEmailsForMove}
        currentFolder={currentFolder}
      />

      {/* Email Schedule Modal */}
      <EmailScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        initialSettings={scheduleSettings}
        source={currentSource}
      />
    </AppLayout>
  );
}
