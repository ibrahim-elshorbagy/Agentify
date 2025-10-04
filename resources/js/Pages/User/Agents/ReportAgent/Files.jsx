import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useTrans } from '@/Hooks/useTrans';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import FileUploadModal from './Partials/Modals/FileUploadModal';
import EditFileModal from './Partials/Modals/EditFileModal';

export default function Files({ files = [] }) {
  const { t } = useTrans();

  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFile, setEditingFile] = useState(null);

  // Toggle modals
  const toggleUploadModal = () => setIsUploadModalOpen(!isUploadModalOpen);

  const toggleEditModal = (file = null) => {
    setEditingFile(file);
    setIsEditModalOpen(!isEditModalOpen);
  };

  const deleteFile = (file) => {
    if (confirm(t('confirm_delete_file'))) {
      router.delete(route('user.report-agent.files.delete', file.id), {
        preserveScroll: true,
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.includes('pdf')) return 'fa-file-pdf text-red-500';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'fa-file-word text-blue-500';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'fa-file-excel text-green-600';
    if (mimeType.includes('text')) return 'fa-file-alt text-neutral-500';
    return 'fa-file text-neutral-500';
  };

  return (
    <AppLayout>
      <Head title={t('manage_files')} />

      <div className="py-4 sm:py-6 lg:py-8 bg-gradient-to-br from-green-50 via-neutral-50 to-green-100 dark:from-green-900 dark:via-neutral-900 dark:to-green-800 min-h-screen">
        <div className='mx-2 sm:mx-4'>
          <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-4 sm:p-6 lg:p-8">

            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 sm:gap-3">
                    <i className="fa-solid fa-folder text-green-500 text-lg sm:text-xl lg:text-2xl"></i>
                    {t('manage_files')}
                  </h1>
                  <p className="text-xs sm:text-sm lg:text-base text-neutral-600 dark:text-neutral-400 mt-1 sm:mt-2">
                    {t('manage_files_description')}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <PrimaryButton
                    onClick={toggleUploadModal}
                    icon="fa-upload"
                    size="large"
                    className="w-full sm:w-auto text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">{t('upload_files')}</span>
                    <span className="sm:hidden">{t('upload')}</span>
                  </PrimaryButton>
                </div>
              </div>
            </div>

            {/* Files Grid */}
            {files.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <i className="fa-solid fa-folder-open text-2xl sm:text-3xl lg:text-4xl text-green-500"></i>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  {t('no_files_uploaded')}
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-4 sm:mb-6 px-4">
                  {t('upload_files_to_get_started')}
                </p>
                <PrimaryButton
                  onClick={toggleUploadModal}
                  icon="fa-upload"
                  className="text-sm sm:text-base"
                >
                  {t('upload_first_files')}
                </PrimaryButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 sm:p-5 lg:p-6 hover:shadow-lg transition-shadow"
                  >

                    {/* File Icon & Info */}
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                          <i className={`fa-solid ${getFileIcon(file.mime_type)} text-lg sm:text-xl`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base font-medium text-neutral-900 dark:text-neutral-100 truncate leading-tight" title={file.original_name}>
                            {file.original_name}
                          </h3>
                          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                            {formatFileSize(file.file_size)}
                          </p>
                          <p className="text-xs text-neutral-400 dark:text-neutral-500">
                            {new Date(file.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2">
                      {/* <SecondaryButton
                        onClick={() => toggleEditModal(file)}
                        icon="fa-edit"
                        size="small"
                        className="flex-1 text-xs sm:text-sm"
                      >
                        <span className=" sm:inline">{t('replace')}</span>
                      </SecondaryButton> */}

                      <button
                        onClick={() => deleteFile(file)}
                        className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors flex-shrink-0"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={toggleUploadModal}
      />

      <EditFileModal
        isOpen={isEditModalOpen}
        onClose={toggleEditModal}
        file={editingFile}
      />
    </AppLayout>
  );
}
