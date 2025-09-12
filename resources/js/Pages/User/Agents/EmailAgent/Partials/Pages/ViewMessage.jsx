import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import SelectInput from '@/Components/SelectInput';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import AppLayout from '@/Layouts/AppLayout';

export default function ViewMessage({ message, responses = [] }) {
  const { t } = useTrans();
  const [showReplyForm, setShowReplyForm] = useState(false);

  const { data, setData, post, errors, processing } = useForm({
    body_text: '',
    from_email: message.to_email || '',
    from_name: message.to_name || '',
    to_email: message.from_email || '',
    to_name: message.from_name || '',
    status: 'draft',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('user.email-agent.store-response', message.id), {
      onSuccess: () => {
        setData('body_text', '');
        setShowReplyForm(false);
      }
    });
  };

  const statusOptions = [
    { value: 'draft', label: t('draft') },
    { value: 'sent', label: t('sent') },
  ];

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
                    href={route('user.email-agent.inbox.emails')}
                    className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                    {t('back_to_inbox')}
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
                          <span>{new Date(message.received_at || message.created_at).toLocaleString()}</span>
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
                      onClick={() => setShowReplyForm(!showReplyForm)}
                      icon="fa-reply"
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      {t('reply')}
                    </PrimaryButton>
                    <PrimaryButton
                      icon="fa-trash"
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
                            {new Date(response.created_at).toLocaleString()}
                          </div>
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

              {/* Reply Form */}
              {showReplyForm && (
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
                  <div className="border-b border-neutral-200 dark:border-neutral-700 p-4">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                      <i className="fa-solid fa-pencil"></i>
                      {t('compose_reply')}
                    </h3>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <InputLabel htmlFor="from_email" value={t('from_email')} required />
                        <TextInput
                          id="from_email"
                          name="from_email"
                          type="email"
                          value={data.from_email}
                          onChange={(e) => setData('from_email', e.target.value)}
                          icon="fa-envelope"
                          required
                        />
                        <InputError message={errors.from_email} className="mt-2" />
                      </div>

                      <div>
                        <InputLabel htmlFor="from_name" value={t('from_name')} required />
                        <TextInput
                          id="from_name"
                          name="from_name"
                          value={data.from_name}
                          onChange={(e) => setData('from_name', e.target.value)}
                          icon="fa-user"
                          required
                        />
                        <InputError message={errors.from_name} className="mt-2" />
                      </div>

                      <div>
                        <InputLabel htmlFor="to_email" value={t('to_email')} required />
                        <TextInput
                          id="to_email"
                          name="to_email"
                          type="email"
                          value={data.to_email}
                          onChange={(e) => setData('to_email', e.target.value)}
                          icon="fa-envelope"
                          required
                        />
                        <InputError message={errors.to_email} className="mt-2" />
                      </div>

                      <div>
                        <InputLabel htmlFor="to_name" value={t('to_name')} required />
                        <TextInput
                          id="to_name"
                          name="to_name"
                          value={data.to_name}
                          onChange={(e) => setData('to_name', e.target.value)}
                          icon="fa-user"
                          required
                        />
                        <InputError message={errors.to_name} className="mt-2" />
                      </div>
                    </div>

                    <div>
                      <InputLabel htmlFor="body_text" value={t('message')} required />
                      <TextArea
                        id="body_text"
                        name="body_text"
                        value={data.body_text}
                        onChange={(e) => setData('body_text', e.target.value)}
                        rows={8}
                        className="resize-none"
                        placeholder={t('type_your_response')}
                        required
                      />
                      <InputError message={errors.body_text} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SelectInput
                        label={t('status')}
                        name="status"
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        options={statusOptions}
                        error={errors.status}
                        icon="fa-paper-plane"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setShowReplyForm(false)}
                        className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                      >
                        {t('cancel')}
                      </button>

                      <div className="flex items-center gap-3">
                        <PrimaryButton
                          type="submit"
                          processing={processing}
                          icon="fa-save"
                          className="bg-gray-500 hover:bg-gray-600"
                          onClick={() => setData('status', 'draft')}
                        >
                          {t('save_as_draft')}
                        </PrimaryButton>

                        <PrimaryButton
                          type="submit"
                          processing={processing}
                          icon="fa-paper-plane"
                          className="bg-blue-500 hover:bg-blue-600"
                          onClick={() => setData('status', 'sent')}
                        >
                          {t('send_response')}
                        </PrimaryButton>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
