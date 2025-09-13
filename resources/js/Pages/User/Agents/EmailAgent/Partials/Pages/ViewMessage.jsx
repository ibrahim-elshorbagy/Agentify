import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
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
    bin: 'user.email-agent.bin.emails',
  spam: 'user.email-agent.spam.emails',
  inbox: 'user.email-agent.inbox.emails'
};
  return (
    <AppLayout

    >
      <Head title={`${t('view_message')} - ${message.subject}`} />

      <div className="m-3 xl:m-5">
        <div className="overflow-hidden rounded-2xl shadow-lg dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
          <div className="p-6 text-neutral-900 dark:text-neutral-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">



                  <Link
                    href={route(folderRoutes[message.folder] || folderRoutes.inbox)}
                    className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  >
                    <i className="fa-solid fa-arrow-left rtl:rotate-180"></i>
                    {t('back')}
                  </Link>
                  /
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                    ${message.subject}
                  </h2>
                </div>

              </div>
            </div>

            <div className=" mx-auto">
              {/* Original Message */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 mb-6">
                {/* Message Header */}
                <div className="border-b border-neutral-200 dark:border-neutral-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                        {message.subject}
                      </h1>
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
                        {message.from_name} &lt;{message.from_email}&gt;
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{t('to')}:</span>
                      <span className="text-neutral-600 dark:text-neutral-400">
                        {message.to_name} &lt;{message.to_email}&gt;
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
                  <div className="flex items-center gap-3">
                    <PrimaryButton
                      onClick={() => setShowCreateModal(true)}
                      icon="fa-reply"
                      rounded="rounded-lg"
                      withShadow={false}
                    >
                      {t('reply')}
                    </PrimaryButton>
                    <PrimaryButton
                      icon="fa-trash"
                      rounded="rounded-lg"
                      withShadow={false}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      {t('delete')}
                    </PrimaryButton>
                  </div>
                </div>
              </div>

              {/* Responses Thread */}
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
