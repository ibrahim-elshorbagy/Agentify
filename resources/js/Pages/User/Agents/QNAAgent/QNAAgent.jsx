import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useTrans } from '@/Hooks/useTrans';
import ChatSidebar from './Partials/Components/ChatSidebar';
import ChatInterface from './Partials/Components/ChatInterface';
import NewConversationModal from './Partials/Modals/NewConversationModal';
import EditConversationModal from './Partials/Modals/EditConversationModal';

export default function QNAAgent({
  conversations = [],
  currentConversation = null,
  messages = []
}) {
  const { t } = useTrans();

  // Modal states
  const [isNewConversationModalOpen, setIsNewConversationModalOpen] = useState(false);
  const [isEditConversationModalOpen, setIsEditConversationModalOpen] = useState(false);
  const [editingConversation, setEditingConversation] = useState(null);

  // Sidebar state for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle modals
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
      <Head title={t('qna_agent')} />

      <div className="h-screen flex bg-gradient-to-br from-green-50 via-neutral-50 to-green-100 dark:from-green-900 dark:via-neutral-900 dark:to-green-800 overflow-hidden relative">

        {/* Chat Sidebar */}
        <ChatSidebar
          conversations={conversations}
          currentConversation={currentConversation}
          onNewConversation={toggleNewConversationModal}
          onEditConversation={toggleEditConversationModal}
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
          onConversationClick={handleConversationClick}
        />

        {/* Main Chat Area */}
        <div className={`flex-1 flex flex-col h-full overflow-hidden ${isSidebarOpen ? 'xl:ml-0' : ''}`}>
          {!currentConversation ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <i className="fa-solid fa-comments text-4xl text-gray-400 dark:text-gray-500 mb-4 block"></i>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {t('select_conversation')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  {t('select_conversation_description')}
                </p>
              </div>
            </div>
          ) : (
            <ChatInterface
              currentConversation={currentConversation}
              messages={messages}
              onEditConversation={toggleEditConversationModal}
              onToggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
            />
          )}
        </div>
      </div>

      {/* Modals */}
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
