import React, { useState } from 'react';
import { useTrans } from '@/Hooks/useTrans';
import { router } from '@inertiajs/react';
import ActionButton from '@/Components/ActionButton';
import FolderModal from '../Modals/FolderModal';

export default function FolderManager({ folders = [], currentFolder = null, source = '' }) {
  const { t } = useTrans();
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);
  const [mode, setMode] = useState('create'); // 'create' or 'edit'

  const toggleFolderModal = (folder = null, modalMode = 'create') => {
    setEditingFolder(folder);
    setMode(modalMode);
    setIsFolderModalOpen(!isFolderModalOpen);
  };

  const deleteFolder = (folder) => {
    if (folder.is_default) {
      alert(t('cannot_delete_default_folder'));
      return;
    }

    if (confirm(t('confirm_delete_folder'))) {
      router.delete(route('user.email-agent.folders.destroy', folder.id));
    }
  };

  return (
    <div className="mb-4">
      {/* Folder Management Header */}
      <div className="flex items-center justify-between mb-3">
      </div>

      {/* Folders List */}
      <div className="flex justify-between">
        <div className="flex flex-wrap gap-2 mb-3">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 ${currentFolder?.id === folder.id
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                : 'border-neutral-200 dark:border-neutral-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/10'
                }`}
            >
              <a
                href={route('user.email-agent.emails', {
                  folder: folder.name,
                  source: source
                })}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <i className={`fa-solid ${folder.icon}`}></i>
                <span>{folder.name}</span>
                <span className="text-xs opacity-60">
                  ({folder.messages_count || 0})
                </span>
              </a>

              {!folder.is_default && (
                <div className="flex items-center gap-1 ml-2 border-l border-neutral-200 dark:border-neutral-700 pl-2">
                  <button
                    onClick={() => toggleFolderModal(folder, 'edit')}
                    className="text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                    title={t('edit_folder')}
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <button
                    onClick={() => deleteFolder(folder)}
                    className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    title={t('delete_folder')}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              )}
            </div>
          ))}

        </div>
        <div>
          <ActionButton
            variant="primary"
            size="xs"
            icon="fa-plus"
            onClick={() => toggleFolderModal(null, 'create')}
          >
            {t('new_folder')}
          </ActionButton>
        </div>
      </div>

      {/* Folder Modal */}
      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => toggleFolderModal()}
        folder={editingFolder}
        mode={mode}
      />
    </div>
  );
}
