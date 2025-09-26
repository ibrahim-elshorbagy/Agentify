import React from 'react';
import { useTrans } from '@/Hooks/useTrans';
import PrimaryButton from '@/Components/PrimaryButton';

export default function FileUploadPrompt({ onUploadFiles }) {
  const { t } = useTrans();

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <i className="fa-solid fa-file-upload text-4xl text-green-500"></i>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            {t('upload_files_to_start')}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            {t('upload_files_description')}
          </p>
        </div>

        <div className='flex items-center justify-center'>
          <PrimaryButton
            onClick={onUploadFiles}
            icon="fa-upload"
            size="large"
            className="px-8 py-4"
          >
            {t('upload_files')}
          </PrimaryButton>
        </div>

        <div className="mt-8 text-sm text-neutral-500 dark:text-neutral-400">
          <p className="mb-2">{t('supported_formats')}:</p>
          <p>PDF, DOC, DOCX, TXT, XLS, XLSX, CSV</p>
          {/* <p>{t('max_file_size')}: 10MB</p> */}
        </div>
      </div>
    </div>
  );
}
