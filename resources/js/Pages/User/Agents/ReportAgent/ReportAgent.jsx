import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useTrans } from '@/Hooks/useTrans';
import ChatSidebar from './Partials/Components/ChatSidebar';
import ChatInterface from './Partials/Components/ChatInterface';
import FileUploadModal from './Partials/Modals/FileUploadModal';
import NewConversationModal from './Partials/Modals/NewConversationModal';
import EditConversationModal from './Partials/Modals/EditConversationModal';
import FileUploadPrompt from './Partials/Components/FileUploadPrompt';

export default function ReportAgent({
  conversations = [],
  files = [],
  currentConversation = null,
  messages = [],
  hasFiles = false
}) {
  const { t } = useTrans();

  // Modal states
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);
  const [isNewConversationModalOpen, setIsNewConversationModalOpen] = useState(false);
  const [isEditConversationModalOpen, setIsEditConversationModalOpen] = useState(false);
  const [editingConversation, setEditingConversation] = useState(null);

  // Sidebar state for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle modals
  const toggleFileUploadModal = () => setIsFileUploadModalOpen(!isFileUploadModalOpen);
  const toggleNewConversationModal = () => setIsNewConversationModalOpen(!isNewConversationModalOpen);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Handle conversation click (close sidebar on mobile)
  const handleConversationClick = () => {
    if (window.innerWidth < 1280) { // xl breakpoint
      setIsSidebarOpen(false);
    }
  };

  const toggleEditConversationModal = (conversation = null) => {
    setEditingConversation(conversation);
    setIsEditConversationModalOpen(!isEditConversationModalOpen);
  };

  return (
    <AppLayout>
      <Head title={t('report_agent')} />

      <div className="min-h-screen flex bg-gradient-to-br from-green-50 via-neutral-50 to-green-100 dark:from-green-900 dark:via-neutral-900 dark:to-green-800 overflow-hidden relative">

        {/* Chat Sidebar */}
        <ChatSidebar
          conversations={conversations}
          currentConversation={currentConversation}
          onNewConversation={toggleNewConversationModal}
          onEditConversation={toggleEditConversationModal}
          hasFiles={hasFiles}
          onUploadFiles={toggleFileUploadModal}
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
          onConversationClick={handleConversationClick}
        />

        {/* Main Chat Area */}
        <div className={`flex-1 flex flex-col min-h-screen overflow-hidden ${isSidebarOpen ? 'xl:ml-0' : ''}`}>
          {!hasFiles && !currentConversation ? (
            <FileUploadPrompt onUploadFiles={toggleFileUploadModal} />
          ) : (
            <ChatInterface
              currentConversation={currentConversation}
              messages={messages}
              files={files}
              onEditConversation={toggleEditConversationModal}
              hasFiles={hasFiles}
              onToggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <FileUploadModal
        isOpen={isFileUploadModalOpen}
        onClose={toggleFileUploadModal}
      />

      <NewConversationModal
        isOpen={isNewConversationModalOpen}
        onClose={toggleNewConversationModal}
      />

      <EditConversationModal
        isOpen={isEditConversationModalOpen}
        onClose={toggleEditConversationModal}
        conversation={editingConversation}
      />
    </AppLayout>
  );
}
