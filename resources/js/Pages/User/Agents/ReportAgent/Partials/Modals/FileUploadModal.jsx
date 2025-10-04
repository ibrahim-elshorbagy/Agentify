import React, { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import AppModal from '@/Components/AppModal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import InputError from '@/Components/InputError';
import DragFileInput from '@/Components/DragFileInput';

export default function FileUploadModal({ isOpen, onClose }) {
  const { t } = useTrans();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const { data, setData, post, processing, errors, reset } = useForm({
    files: [],
  });

  const handleFilesChange = (files) => {
    setSelectedFiles(files);
    setData('files', files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route('user.report-agent.files.upload'), {
      forceFormData: true,
      onSuccess: () => {
        reset();
        setSelectedFiles([]);
        onClose();
      },
    });
  };

  const handleClose = () => {
    if (!processing) {
      reset();
      setSelectedFiles([]);
      onClose();
    }
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('upload_files')}
      icon="fa-upload"
      size="lg"
    >
      <form onSubmit={handleSubmit}>

        {/* File Input */}
        <DragFileInput
          id="file-upload"
          multiple={true}
          maxFiles={10}
          accept=".pdf,.txt,.xlsx,.csv"
          onChange={handleFilesChange}
          value={selectedFiles}
          disabled={processing}
          error={errors.files || errors['files.0']}
          helperText="PDF, TXT, XLSX, CSV files are supported"
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
            icon="fa-upload"
            disabled={processing || selectedFiles.length === 0}
          >
            {processing ? t('uploading') : t('upload_files')}
          </PrimaryButton>
        </div>
      </form>
    </AppModal>
  );
}
