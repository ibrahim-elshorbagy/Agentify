import React, { useRef, useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import AppModal from '@/Components/AppModal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputError from '@/Components/InputError';
import DragFileInput from '@/Components/DragFileInput';

export default function EditFileModal({ isOpen, onClose, file }) {
  const { t } = useTrans();
  const [selectedFile, setSelectedFile] = useState(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    file: null,
    _method: 'PUT',
  });

  const handleFileChange = (newFile) => {
    setSelectedFile(newFile);
    setData('file', newFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) return;

    post(route('user.report-agent.files.update', file.id), {
      forceFormData: true,
      onSuccess: () => {
        reset();
        setSelectedFile(null);
        onClose();
      },
    });
  };

  const handleClose = () => {
    if (!processing) {
      reset();
      setSelectedFile(null);
      onClose();
    }
  };

    // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
    }
  }, [isOpen]);

  if (!file) return null;

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
    <AppModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('replace_file')}
      icon="fa-edit"
      size="md"
    >
      <form onSubmit={handleSubmit}>

        {/* Current File Info */}
        <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3">
            {t('current_file')}
          </h4>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
              <i className={`fa-solid ${getFileIcon(file.mime_type)} text-lg`}></i>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {file.original_name}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {formatFileSize(file.file_size)}
              </p>
            </div>
          </div>
        </div>

        {/* File Input */}
        <DragFileInput
          id="file-replace"
          label={t('choose_replacement_file')}
          multiple={false}
          accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv"
          onChange={handleFileChange}
          value={selectedFile}
          disabled={processing}
          error={errors.file}
          helperText={"PDF, DOC, DOCX, TXT, XLS, XLSX, CSV"+" "+t('files_are_supported')}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <SecondaryButton
            type="button"
            onClick={handleClose}
            disabled={processing}
          >
            {t('cancel')}
          </SecondaryButton>

          <PrimaryButton
            type="submit"
            icon="fa-save"
            disabled={processing || !selectedFile}
          >
            {processing ? t('replacing') : t('replace_file')}
          </PrimaryButton>
        </div>
      </form>
    </AppModal>
  );
}
