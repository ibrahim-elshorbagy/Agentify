import React, { useState, useRef, useEffect } from 'react';

export default function DragFileInput({
  id,
  label,
  onChange,
  accept,
  error,
  required = false,
  valid = false,
  className = '',
  helperText = '',
  value = null,
  keyValue = null,
  disabled = false,
  multiple = false,
  maxFiles = 5,
  ...rest
}) {
  const fileInputRef = useRef(null);
  const [selectedFileValue, setSelectedFileValue] = useState(keyValue?.name ?? null);
  const [selectedFiles, setSelectedFiles] = useState(multiple ? (value || []) : null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Clear the input ref when value is null or empty
  useEffect(() => {
    if (multiple) {
      if (!value?.length && fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      if (!value && fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [value, multiple]);

  useEffect(() => {
    if (multiple) {
      setSelectedFiles(value || []);
    } else {
      setSelectedFileValue(keyValue?.name ?? null);
    }
  }, [value, keyValue, multiple]);

  // Determine input state for styling
  const hasError = !!error;
  const isValid = valid && !hasError;

  const handleFileChange = (e) => {
    if (disabled) { return 0 }

    if (multiple) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    } else {
      const file = e.target.files[0];
      if (file) {
        setSelectedFileValue(file.name);
        if (onChange) {
          onChange(file);
        }
      }
    }
  };

  const handleFiles = (files) => {
    if (!multiple || files.length === 0) return;

    const newFiles = [...selectedFiles];

    files.forEach(file => {
      if (newFiles.length < maxFiles) {
        newFiles.push(file);
      }
    });

    setSelectedFiles(newFiles);
    if (onChange) {
      onChange(newFiles);
    }
  };

  const removeFile = (index) => {
    if (disabled || !multiple) return;
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    if (onChange) {
      onChange(newFiles);
    }
  };

  const handleDragOver = (e) => {
    if (disabled) { return 0 }
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    if (disabled) { return 0 }

    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);

    if (multiple) {
      handleFiles(files);
    } else {
      if (files.length > 0) {
        const file = files[0];
        setSelectedFileValue(file.name);
        if (onChange) {
          onChange(file);
        }
      }
    }
  };

  const handleChooseFile = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (!multiple) {
      setSelectedFileValue(keyValue?.name ?? null);
    }
  }, [keyValue, multiple]);

  // Container classes based on state
  const containerClasses = `
  ${disabled ? 'bg-gray-100 dark:bg-neutral-800 cursor-not-allowed' : 'bg-white dark:bg-neutral-900 cursor-pointer'}
    relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors
    ${isDragOver ? 'border-green-400 bg-green-50 dark:bg-green-900/20' :
      hasError ? 'border-red-300 hover:border-red-400 dark:border-red-600 dark:hover:border-red-500' :
        (isValid ? 'border-green-300 hover:border-green-400 dark:border-green-600 dark:hover:border-green-500' :
          'border-neutral-300 hover:border-neutral-400 dark:border-neutral-600 dark:hover:border-neutral-500')}
  `;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="block mb-2 text-neutral-900 dark:text-neutral-100">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          className={containerClasses}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleChooseFile}
        >
          <input
            ref={fileInputRef}
            id={id}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
            multiple={multiple}
            {...rest}
          />

          <div className="mb-4">
            <div>
              <i className="fa-solid fa-cloud-upload-alt text-4xl text-green-500 mb-2"></i>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center">
            {multiple ? (
              <div className="space-y-2">
                <p className="text-sm text-neutral-900 dark:text-neutral-100">
                  Drag and Drop files here or{' '}
                  <span className="underline text-green-600">Choose files</span>
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  You can upload up to {maxFiles} files
                </p>
                {accept && (
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Supported formats: {accept}
                  </p>
                )}
              </div>
            ) : selectedFileValue ? (
              <div className="space-y-2">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Selected: {selectedFileValue}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Click to change file or drag and drop a new one
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-neutral-900 dark:text-neutral-100">
                  Drag and Drop file here or{' '}
                  <span className="underline text-green-600">Choose file</span>
                </p>
                {accept && (
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Supported formats: {accept}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Status icon for validation states */}
        {isValid && (
          <div className="absolute transform -translate-y-1/2 right-3 top-1/2">
            <i className="fa-solid fa-check-circle text-green-500"></i>
          </div>
        )}
      </div>

      {/* Selected files display for multiple mode */}
      {multiple && selectedFiles?.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            Selected files ({selectedFiles.length}/{maxFiles}):
          </p>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <i className="fa-solid fa-file text-green-500 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                  disabled={disabled}
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Helper text */}
      {helperText && !hasError && !isValid && (
        <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {helperText}
        </div>
      )}

      {/* Display error message */}
      {hasError && (
        <div className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Display validation success message */}
      {isValid && !hasError && (
        <div className="mt-1 text-sm text-green-600 dark:text-green-400">
          {multiple
            ? `${selectedFiles?.length || 0} file(s) uploaded successfully`
            : 'File uploaded successfully'
          }
        </div>
      )}
    </div>
  );
}
