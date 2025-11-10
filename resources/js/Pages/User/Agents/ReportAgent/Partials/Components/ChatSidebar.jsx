import React from 'react';
import { Link, router } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function ChatSidebar({
  conversations,
  currentConversation,
  onNewConversation,
  onEditConversation,
  hasFiles,
  onUploadFiles,
  isOpen = false,
  onToggle,
  onConversationClick,
  className = ""
}) {
  const { t } = useTrans();

  const deleteConversation = (conversation, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm(t('confirm_delete_conversation'))) {
      router.delete(route('user.report-agent.conversations.delete', conversation.id), {
        preserveScroll: true,
      });
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        xl:translate-x-0
        fixed xl:relative
        top-0 left-0
        w-80 xl:w-80
        min-h-screen
        bg-white dark:bg-neutral-900
        border-x border-neutral-200 dark:border-neutral-700
        flex flex-col
        transition-transform duration-300 ease-in-out
        z-40 xl:z-auto
        ${className}
      `.trim()}>

        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <i className="fa-solid fa-chart-bar text-green-500"></i>
              {t('report_agent')}
            </h2>
            {/* Mobile Close Button */}
            <button
              onClick={onToggle}
              className="xl:hidden p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-2">
            <PrimaryButton
              onClick={onNewConversation}
              icon="fa-plus"
              size="small"
              className="w-full justify-center"
              disabled={!hasFiles}
            >
              {t('new_chat')}
            </PrimaryButton>

            <SecondaryButton
              onClick={onUploadFiles}
              icon="fa-folder"
              size="small"
              className="w-full justify-center"
            >
              {t('manage_files')}
            </SecondaryButton>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto max-h-screen">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">
              <i className="fa-solid fa-comments text-2xl mb-2 block"></i>
              {hasFiles ? t('no_conversations_yet') : t('upload_files_first')}
            </div>
          ) : (
            <div className="p-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`mb-2 rounded-lg border transition-all duration-200 ${currentConversation?.id === conversation.id
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-750'
                    }`}
                >
                  <Link
                    href={route('user.report-agent.conversation.show', conversation.id)}
                    className="p-3 block"
                    onClick={onConversationClick}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                          {conversation.name}
                        </h3>
                        {conversation.latest_message && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate mt-1">
                            {conversation.latest_message.message}
                          </p>
                        )}
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                          {new Date(conversation.updated_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 ml-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEditConversation(conversation);
                          }}
                          className="p-1 text-neutral-400 hover:text-green-500 transition-colors"
                          title={t('edit_conversation')}
                        >
                          <i className="fa-solid fa-edit text-xs"></i>
                        </button>

                        <button
                          onClick={(e) => deleteConversation(conversation, e)}
                          className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                          title={t('delete_conversation')}
                        >
                          <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
}
