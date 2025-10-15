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
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header with Toggle Button */}
        <div className="flex-shrink-0 p-6 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-700/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Sidebar Toggle Button */}
              <button
                onClick={onToggleSidebar}
                className="xl:hidden p-3 text-green-600 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-800 dark:to-green-900 hover:from-green-100 hover:to-green-200 dark:hover:from-green-700 dark:hover:to-green-800 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-3.774-.9L3 21l1.9-6.226A8.955 8.955 0 013 12a8 8 0 018-8c4.418 0 8 3.582 8 8z" />
                </svg>
              </button>


              <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                {t('report_agent')}
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <i className="fa-solid fa-comments text-2xl text-green-500"></i>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              {t('select_conversation')}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
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
      <div className="flex-shrink-0 p-6 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-700/50 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Toggle Button */}
            <button
              onClick={onToggleSidebar}
              className="xl:hidden p-3 text-green-600 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-800 dark:to-green-900 hover:from-green-100 hover:to-green-200 dark:hover:from-green-700 dark:hover:to-green-800 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-3.774-.9L3 21l1.9-6.226A8.955 8.955 0 013 12a8 8 0 018-8c4.418 0 8 3.582 8 8z" />
              </svg>
            </button>


            <div>
              <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                {currentConversation.name}
              </h1>
              {/* <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {t('files_available', { count: files.length })}
              </p> */}
            </div>
          </div>

          <ActionButton
            onClick={() => onEditConversation(currentConversation)}
            icon="fa-edit"
            variant='info'
            className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {t('edit')}
          </ActionButton>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 flex items-center justify-center shadow-xl">
              <i className="fa-solid fa-robot text-3xl text-green-600 dark:text-green-400"></i>
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3 tracking-tight">
              {t('start_conversation')}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-md mx-auto">
              {t('start_conversation_description')}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-sm lg:max-w-2xl px-6 py-4 rounded-2xl min-w-0 shadow-lg transition-all duration-200 hover:shadow-xl ${
                  message.sender_type === 'user'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-500/25'
                    : 'bg-white/90 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 border border-neutral-200/50 dark:border-neutral-700/50 backdrop-blur-sm'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  {message.sender_type === 'ai' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 flex items-center justify-center shadow-md">
                      <i className="fa-solid fa-robot text-sm text-green-600 dark:text-green-400"></i>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className="whitespace-pre-line break-words leading-relaxed text-sm"
                      dir="auto"
                    >
                      {message.message}
                    </p>

                    <p
                      className={`text-xs mt-3 font-medium ${
                        message.sender_type === 'user'
                          ? 'text-green-100'
                          : 'text-neutral-500 dark:text-neutral-400'
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
      <div className="flex-shrink-0 p-6 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-200/50 dark:border-neutral-700/50 shadow-lg">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-1">
            <AutoResizeTextarea
              ref={textareaRef}
              value={data.message}
              onChange={(e) => setData('message', e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('type_message_placeholder')}
              disabled={processing}
              className="rounded-2xl border-neutral-200/50 dark:border-neutral-700/50 focus:border-green-300 dark:focus:border-green-600 focus:ring-green-300 dark:focus:ring-green-600 shadow-sm"
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
