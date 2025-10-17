import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import PrimaryButton from '@/Components/PrimaryButton';
import AppLayout from '@/Layouts/AppLayout';
import CreateMessageModal from '../Modals/CreateMessageModal';
import EditMessageModal from '../Modals/EditMessageModal';

export default function ViewMessage({ message, responses = [] }) {
  const { t } = useTrans();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);

  const folderRoutes = {
    bin: 'user.email-agent.emails',
    spam: 'user.email-agent.emails',
    inbox: 'user.email-agent.emails'
  };

  // Toggle star function - use bulk star/unstar action based on current state
  const toggleStar = (emailId, isStarred) => {
    const route_name = isStarred ? 'user.email-agent.bulk.unstar' : 'user.email-agent.bulk.star';
    router.patch(route(route_name), {
      ids: [emailId]
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Unified function to update folder and redirect
  const updateFolderAndRedirect = (emailId, folder) => {
    router.patch(route('user.email-agent.bulk.update-folder', { folder }), {
      ids: [emailId]
    }, {
      onSuccess: () => {
        // Redirect to the target folder after successful move
        router.visit(route('user.email-agent.emails', { folder }));
      }
    });
  };

  // Individual action functions using the unified function
  const restoreToInbox = (emailId) => updateFolderAndRedirect(emailId, 'inbox');
  const moveToSpam = (emailId) => updateFolderAndRedirect(emailId, 'spam');
  const moveToBin = (emailId) => updateFolderAndRedirect(emailId, 'bin');

  // Delete draft function - use bulk delete action for response messages
  const deleteDraft = (emailId) => {
    if (confirm(t('confirm_delete_draft_permanently'))) {
      router.delete(route('user.email-agent.response.bulk.delete-drafts'), {
        data: { ids: [emailId] },
        preserveState: true,
        preserveScroll: true,
      });
    }
  };

  // Delete permanently function - use bulk delete-permanently action and redirect
  const deletePermanently = (emailId) => {
    if (confirm(t('confirm_delete_permanently'))) {
      router.delete(route('user.email-agent.bulk.delete-permanently'), {
        data: { ids: [emailId] },
        onSuccess: () => {
          // Redirect to bin folder after successful deletion
          router.visit(route('user.email-agent.emails', { folder: 'bin' }));
        }
      });
    }
  };

  return (
    <AppLayout>
      <Head title={`${t('view_message')} - ${message.subject}`} />

      <div className="m-3 xl:m-5">
        <div className="overflow-hidden rounded-2xl shadow-lg dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
          <div className="p-6 text-neutral-900 dark:text-neutral-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link
                    href={route(folderRoutes[message.folder] || folderRoutes.inbox, { folder: message.folder || 'inbox' })}
                    className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  >
                    <i className="fa-solid fa-arrow-left rtl:rotate-180"></i>
                    {t('back')}
                  </Link>
                  /
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {message.subject}
                  </h2>
                </div>
              </div>
            </div>

            <div className="mx-auto">
              {/* Original Message */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 mb-6">
                {/* Message Header */}
                <div className="border-b border-neutral-200 dark:border-neutral-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                          {message.subject}
                        </h1>
                        {/* Star Toggle Button */}
                        <button
                          onClick={() => toggleStar(message.id, message.is_starred)}
                          className="hover:scale-110 transition-transform duration-200"
                          title={message.is_starred ? t('remove_star') : t('add_star')}
                        >
                          {message.is_starred ? (
                            <i className="fa-solid fa-star text-yellow-500 text-xl hover:text-yellow-600"></i>
                          ) : (
                            <i className="fa-regular fa-star text-gray-400 text-xl hover:text-yellow-500"></i>
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-user"></i>
                          <span className="font-medium">{message.from_name || message.from_email}</span>
                          <span className="text-neutral-500">&lt;{message.from_email}&gt;</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-calendar"></i>
                          <span>{new Date(message.received_at || message.updated_at).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* To/From Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{t('from')}:</span>
                      <span className="text-neutral-600 dark:text-neutral-400">
                        {message.from_name} - {message.from_email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{t('to')}:</span>
                      <span className="text-neutral-600 dark:text-neutral-400">
                        {message.to_name} - {message.to_email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap text-neutral-900 dark:text-neutral-100">
                      {message.body_text || t('no_message_content')}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-neutral-200 dark:border-neutral-700 p-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <PrimaryButton
                      onClick={() => setShowCreateModal(true)}
                      icon="fa-reply"
                      rounded="rounded-lg"
                      withShadow={false}
                    >
                      {t('reply')}
                    </PrimaryButton>
                    {/* Show restore to inbox for spam and bin folders */}
                    {(message.folder === 'spam' || message.folder === 'bin') && (
                      <PrimaryButton
                        onClick={() => restoreToInbox(message.id)}
                        icon="fa-inbox"
                        rounded="rounded-lg"
                        withShadow={false}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        {t('restore_to_inbox')}
                      </PrimaryButton>
                    )}

                    {/* Show different actions based on current folder */}
                    {message.folder !== 'spam' && (
                      <PrimaryButton
                        onClick={() => moveToSpam(message.id)}
                        icon="fa-exclamation-circle"
                        rounded="rounded-lg"
                        withShadow={false}
                        className="bg-yellow-500 hover:bg-yellow-600"
                      >
                        {t('move_to_spam')}
                      </PrimaryButton>
                    )}

                    {message.folder !== 'bin' && (
                      <PrimaryButton
                        onClick={() => moveToBin(message.id)}
                        icon="fa-trash-can"
                        rounded="rounded-lg"
                        withShadow={false}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        {t('move_to_bin')}
                      </PrimaryButton>
                    )}

                    {/* Show delete permanently for bin and spam folders */}
                    <PrimaryButton
                      onClick={() => deletePermanently(message.id)}
                      icon="fa-trash"
                      rounded="rounded-lg"
                      withShadow={false}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {t('delete_permanently')}
                    </PrimaryButton>
                  </div>
                </div>
              </div>

              {/* Responses Thread - same as before */}
              {responses.length > 0 && (
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <i className="fa-solid fa-comments"></i>
                    {t('responses')} ({responses.length})
                  </h3>

                  {responses.map((response, index) => (
                    <div key={response.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
                      {/* Response Header */}
                      <div className="border-b border-neutral-200 dark:border-neutral-700 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <i className="fa-solid fa-reply text-blue-500"></i>
                              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                                {response.from_name}
                              </span>
                              <span className="text-neutral-500 text-sm">&lt;{response.from_email}&gt;</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${response.status === 'sent'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                              }`}>
                              {t(response.status)}
                            </span>
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {t('updated_at')}: {new Date(response.updated_at).toLocaleString()}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {response.sent_at && (t('sent_at') + ': ' + new Date(response.sent_at).toLocaleString())}
                          </div>
                          {response.status === 'draft' && (
                            <div className='flex items-center gap-4'>
                              <PrimaryButton
                                onClick={() => deleteDraft(response.id)}
                                variant="delete"
                                icon="fa-trash-can"
                                size="xs"
                                as="button"
                                className='bg-red-600'
                              >
                                {t('delete')}
                              </PrimaryButton>

                              <PrimaryButton
                                onClick={() => {
                                  setSelectedResponse(response);
                                  setShowEditModal(true);
                                }}
                                icon="fa-pen-to-square"
                                rounded="rounded-lg"
                                size="sm"
                                withShadow={false}
                              >
                                {t('edit')}
                              </PrimaryButton>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Response Body */}
                      <div className="p-4">
                        <div className="whitespace-pre-wrap text-neutral-900 dark:text-neutral-100">
                          {response.body_text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Modals */}
              <CreateMessageModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                toEmail={message.from_email}
                toName={message.from_name}
                messageId={message.id}
              />

              <EditMessageModal
                isOpen={showEditModal}
                onClose={() => {
                  setShowEditModal(false);
                  setSelectedResponse(null);
                }}
                message={selectedResponse}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
