import React from 'react';
import { useTrans } from '@/Hooks/useTrans';
import AppModal from '@/Components/AppModal';
import SecondaryButton from '@/Components/SecondaryButton';

export default function EmailTestModal({ isOpen, onClose, emailData }) {
  const { t } = useTrans();

  if (!emailData) return null;

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Latest Email Retrieved"
      icon="fa-envelope-open-text"
      size="lg"
    >
      <div className="space-y-4">

        {/* Success message */}
        <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex-shrink-0">
            <i className="fas fa-check-circle text-green-400"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✅ Connection successful! Email data retrieved from your mailbox.
            </p>
          </div>
        </div>

        {/* Email details */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              📌 Subject
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 p-2 rounded border">
              {emailData.subject}
            </p>
          </div>

          {/* From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              👤 From
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 p-2 rounded border">
              {emailData.from}
            </p>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              📅 Date
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 p-2 rounded border">
              {emailData.date}
            </p>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              📝 Preview
            </label>
            <p className="text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 p-2 rounded border max-h-20 overflow-y-auto">
              {emailData.snippet}
            </p>
          </div>

        </div>

        {/* Info message */}
        <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex-shrink-0">
            <i className="fas fa-info-circle text-blue-400"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              This confirms that your OAuth connection is working correctly and our AI agents can read your emails.
            </p>
          </div>
        </div>

        {/* Close button */}
        <div className="flex justify-end">
          <SecondaryButton
            type="button"
            onClick={onClose}
            icon="fa-times"
          >
            {t('close')}
          </SecondaryButton>
        </div>
      </div>
    </AppModal>
  );
}
