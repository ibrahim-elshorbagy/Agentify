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
        min-h-full
        bg-gradient-to-b from-white/95 via-green-50/90 to-emerald-50/95 dark:from-neutral-950/95 dark:via-neutral-900/90 dark:to-neutral-950/95
        backdrop-blur-xl
        border-x-2 border-green-200/60 dark:border-neutral-700/80
        flex flex-col
        transition-all duration-300 ease-in-out
        z-40 xl:z-auto
        shadow-2xl xl:shadow-none
        ${className}
      `.trim()}>

        {/* Header */}
        <div className="p-6 border-b-2 border-green-200/60 dark:border-neutral-700/70 ">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent flex items-center gap-3 tracking-tight">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 dark:from-green-600 dark:via-emerald-600 dark:to-green-700 flex items-center justify-center shadow-xl shadow-green-500/30">
                <i className="fa-solid fa-comments text-white text-lg drop-shadow-sm"></i>
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
        <div className="flex-1 overflow-y-auto max-h-screen">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-green-600 dark:text-green-400">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 dark:from-green-800 dark:via-emerald-800 dark:to-teal-800 flex items-center justify-center shadow-lg shadow-green-500/20">
                <i className="fa-solid fa-comments text-xl text-green-500 dark:text-green-400"></i>
              </div>
              <p className="font-semibold">{t('no_conversations_yet')}</p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`mb-3 rounded-3xl border-2 transition-all duration-300 hover:scale-[1.03] transform ${currentConversation?.id === conversation.id
                      ? 'bg-gradient-to-r from-green-100 via-emerald-50 to-green-100 dark:from-green-900/40 dark:via-emerald-900/30 dark:to-green-800/40 border-green-300 dark:border-green-600 shadow-xl shadow-green-500/20'
                      : 'bg-gradient-to-br from-white/70 via-green-50/40 to-emerald-50/60 dark:from-neutral-800/70 dark:via-green-900/20 dark:to-emerald-900/30 border-green-200/40 dark:border-green-700/40 hover:bg-gradient-to-br hover:from-white/90 hover:via-green-50/60 hover:to-emerald-50/80 dark:hover:from-neutral-800/90 dark:hover:via-green-900/30 dark:hover:to-emerald-900/40 hover:shadow-lg hover:shadow-green-500/10 backdrop-blur-sm'
                    }`}
                >
                  <Link
                    href={route('user.qna-agent.conversation.show', conversation.id)}
                    className="p-4 block group"
                    onClick={onConversationClick}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold truncate transition-colors duration-300 ${currentConversation?.id === conversation.id
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-neutral-900 dark:text-neutral-100 group-hover:text-green-600 dark:group-hover:text-green-400'
                          }`}>
                          {conversation.name}
                        </h3>
                        {conversation.latest_message && (
                          <p className={`text-sm truncate mt-2 leading-relaxed font-medium ${currentConversation?.id === conversation.id
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-neutral-600 dark:text-neutral-400 group-hover:text-green-500 dark:group-hover:text-green-400'
                            }`}>
                            {conversation.latest_message.message}
                          </p>
                        )}
                        <p className={`text-xs mt-3 font-semibold ${currentConversation?.id === conversation.id
                            ? 'text-green-500 dark:text-green-400'
                            : 'text-neutral-500 dark:text-neutral-500 group-hover:text-green-500'
                          }`}>
                          {new Date(conversation.updated_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 ml-3">
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
