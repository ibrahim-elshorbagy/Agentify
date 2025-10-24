import React, { useState, useRef, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import AutoResizeTextarea from '@/Components/AutoResizeTextarea';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import ActionButton from '@/Components/ActionButton';

export default function ChatInterface({
  currentConversation,
  messages = [],
  onEditConversation,
  onToggleSidebar,
  isSidebarOpen = false
}) {
  const { t } = useTrans();
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const { data, setData, post, processing, reset } = useForm({
    conversation_id: currentConversation?.id || null,
    message: '',
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Set conversation ID when it changes
  useEffect(() => {
    setData('conversation_id', currentConversation?.id || null);
  }, [currentConversation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.message.trim() || !currentConversation) return;

    post(route('user.qna-agent.messages.send'), {
      preserveScroll: true,
      onSuccess: () => {
        reset('message');
        textareaRef.current?.focus();
      },
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!currentConversation) {
    return (
      <div className="flex-1 flex flex-col min-h-full overflow-hidden">
        {/* Header with Toggle Button */}
        <div className="flex-shrink-0 p-6 bg-gradient-to-r from-green-50/95 via-emerald-50/95 to-teal-50/95 dark:from-green-900/95 dark:via-emerald-900/95 dark:to-teal-900/95 backdrop-blur-xl border-b border-green-200/60 dark:border-green-700/60 shadow-lg shadow-green-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Sidebar Toggle Button */}
              <button
                onClick={onToggleSidebar}
                className="xl:hidden p-3 text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 dark:from-green-600 dark:to-emerald-600 dark:hover:from-green-700 dark:hover:to-emerald-700 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-3.774-.9L3 21l1.9-6.226A8.955 8.955 0 013 12a8 8 0 018-8c4.418 0 8 3.582 8 8z" />
                </svg>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 dark:from-green-500 dark:to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                  <i className="fa-solid fa-comments text-white text-lg"></i>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent tracking-tight">
                  {t('qna_agent')}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-b from-transparent via-green-50/20 to-transparent dark:via-green-900/10">
          <div className="text-center">
            <div className="w-28 h-28 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 dark:from-green-500 dark:via-emerald-600 dark:to-teal-600 flex items-center justify-center shadow-2xl shadow-green-500/30 animate-pulse">
              <i className="fa-solid fa-comments text-3xl text-white drop-shadow-lg"></i>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-4 tracking-tight">
              {t('select_conversation')}
            </h3>
            <p className="text-green-700 dark:text-green-300 font-medium leading-relaxed">
              {t('select_conversation_description')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">

      {/* Chat Header */}
      <div className="flex-shrink-0 p-6 bg-gradient-to-r from-green-50/95 via-emerald-50/95 to-teal-50/95 dark:from-neutral-950/95 dark:via-neutral-900/95 dark:to-neutral-950/95 backdrop-blur-xl border-b border-green-200/60 dark:border-neutral-700/60 shadow-lg shadow-green-500/10 dark:shadow-neutral-800/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={onToggleSidebar}
              className="xl:hidden p-3 text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 dark:from-green-600 dark:to-emerald-600 dark:hover:from-green-700 dark:hover:to-emerald-700 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-3.774-.9L3 21l1.9-6.226A8.955 8.955 0 013 12a8 8 0 018-8c4.418 0 8 3.582 8 8z" />
              </svg>
            </button>


            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 dark:from-green-600 dark:via-emerald-600 dark:to-green-700 flex items-center justify-center shadow-xl shadow-green-500/30">
                <i className="fa-solid fa-comments text-white text-lg drop-shadow-sm"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent tracking-tight">
                  {currentConversation.name}
                </h1>
              </div>
            </div>
          </div>

          <ActionButton
            onClick={() => onEditConversation(currentConversation)}
            icon="fa-edit"
            variant='success'
            size="md"
            className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {t('edit')}
          </ActionButton>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0 bg-gradient-to-b from-transparent via-green-50/20 to-transparent dark:via-green-900/10">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 dark:from-green-500 dark:via-emerald-600 dark:to-teal-600 flex items-center justify-center shadow-2xl shadow-green-500/30 animate-pulse">
              <i className="fa-solid fa-robot text-4xl text-white drop-shadow-lg"></i>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-4 tracking-tight">
              {t('start_conversation')}
            </h3>
            <p className="text-green-700 dark:text-green-300 leading-relaxed max-w-md mx-auto font-medium">
              {t('qna_start_conversation_description')}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'
                } animate-fadeIn`}
            >
              <div
                className={`max-w-sm lg:max-w-2xl px-6 py-5 rounded-3xl min-w-0 shadow-md transition-all duration-300 hover:shadow-lg transform hover:scale-[1.01] ${message.sender_type === 'user'
                  ?
                  'bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 text-neutral-800 border border-green-100 shadow-green-200/30 dark:from-green-500 dark:via-emerald-500 dark:to-green-600 dark:text-white dark:border-green-400/20 dark:shadow-green-500/30'
                  :
                  'bg-gradient-to-br from-white via-emerald-50/60 to-green-50/50 dark:from-neutral-800 dark:via-neutral-750 dark:to-neutral-800 text-neutral-900 dark:text-neutral-100 border border-green-100/50 dark:border-neutral-600/40 backdrop-blur-md shadow-green-200/10 dark:shadow-neutral-800/20'
                  }`}
              >
                <div className="flex items-start gap-4 min-w-0">
                  {message.sender_type === 'ai' && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-teal-500 dark:from-green-500 dark:via-emerald-600 dark:to-teal-600 flex items-center justify-center shadow-md">
                      <i className="fa-solid fa-robot text-sm text-white drop-shadow-sm"></i>
                    </div>
                  )}
                  {message.sender_type === 'user' && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-600 dark:to-emerald-700 flex items-center justify-center shadow-sm">
                      <i className="fa-solid fa-user text-sm text-emerald-700 dark:text-white drop-shadow-sm"></i>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`whitespace-pre-line break-words leading-relaxed text-sm font-medium ${message.sender_type === 'user'
                        ? 'text-green-800 dark:text-white'
                        : 'text-neutral-800 dark:text-green-100'
                        }`}
                      dir="auto"
                    >
                      {message.message}
                    </p>

                    <p
                      className={`text-xs mt-3 font-semibold ${message.sender_type === 'user'
                        ? 'text-green-600 dark:text-green-300'
                        : 'text-green-700 dark:text-green-400'
                        }`}
                    >
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          ))

        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 p-6 bg-gradient-to-r from-green-50/95 via-emerald-50/95 to-teal-50/95 dark:from-neutral-950/95 dark:via-neutral-900/95 dark:to-neutral-950/95 backdrop-blur-xl border-t-2 border-green-200/60 dark:border-neutral-700/60 shadow-2xl shadow-green-500/20 dark:shadow-neutral-800/30">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-1">
            <AutoResizeTextarea
              ref={textareaRef}
              value={data.message}
              onChange={(e) => setData('message', e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('type_message_placeholder')}
              disabled={processing}
              className="rounded-3xl border-2 border-green-200/60 dark:border-green-700/60 focus:border-green-400 dark:focus:border-green-500 focus:ring-4 focus:ring-green-300/30 dark:focus:ring-green-600/30 shadow-lg bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10"
            />
          </div>

          <PrimaryButton
            type="submit"
            icon="fa-paper-plane"
            disabled={processing || !data.message.trim()}
            className="px-6 py-3 self-end mb-2 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            {processing ? t('sending') : t('send')}
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}
