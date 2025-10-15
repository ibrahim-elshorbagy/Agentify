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
      router.delete(route('user.qna-agent.conversations.delete', conversation.id), {
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
        h-full
        bg-white/95 dark:bg-neutral-900/95
        backdrop-blur-xl
        border-r border-neutral-200/50 dark:border-neutral-700/50
        flex flex-col
        transition-all duration-300 ease-in-out
        z-40 xl:z-auto
        shadow-2xl xl:shadow-none
        ${className}
      `.trim()}>

        {/* Header */}
        <div className="p-6 border-b border-neutral-200/50 dark:border-neutral-700/50">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-3 tracking-tight">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <i className="fa-solid fa-chart-bar text-white text-sm"></i>
              </div>
              {t('qna_agent')}
            </h2>
            {/* Mobile Close Button */}
            <button
              onClick={onToggle}
              className="xl:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

        <div className="space-y-3">
          <PrimaryButton
            onClick={onNewConversation}
            icon="fa-plus"
            size="small"
            className="w-full justify-center rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {t('new_chat')}
          </PrimaryButton>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-6 text-center text-neutral-500 dark:text-neutral-400">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center">
              <i className="fa-solid fa-comments text-lg text-neutral-400 dark:text-neutral-500"></i>
            </div>
            {t('no_conversations_yet')}
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`mb-2 rounded-2xl border transition-all duration-200 hover:scale-[1.02] ${
                  currentConversation?.id === conversation.id
                    ? 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-700 shadow-lg shadow-green-500/10'
                    : 'bg-white/60 dark:bg-neutral-800/60 border-neutral-200/50 dark:border-neutral-700/50 hover:bg-white/80 dark:hover:bg-neutral-800/80 hover:shadow-md backdrop-blur-sm'
                }`}
              >
                <Link
                  href={route('user.qna-agent.conversation.show', conversation.id)}
                  className="p-4 block group"
                  onClick={onConversationClick}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {conversation.name}
                      </h3>
                      {conversation.latest_message && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate mt-1.5 leading-relaxed">
                          {conversation.latest_message.message}
                        </p>
                      )}
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2 font-medium">
                        {new Date(conversation.updated_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onEditConversation(conversation);
                        }}
                        className="p-1.5 text-neutral-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all duration-200"
                        title={t('edit_conversation')}
                      >
                        <i className="fa-solid fa-edit text-xs"></i>
                      </button>

                      <button
                        onClick={(e) => deleteConversation(conversation, e)}
                        className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
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
