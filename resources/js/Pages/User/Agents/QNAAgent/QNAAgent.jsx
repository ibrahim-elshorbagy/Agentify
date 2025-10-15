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

      <div className="h-screen flex bg-gradient-to-br from-green-50 via-neutral-50 to-green-100 dark:from-green-900 dark:via-neutral-900 dark:to-green-800 overflow-hidden relative"
           style={{
             backgroundImage: `
               radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.15) 2px, transparent 2px),
               radial-gradient(circle at 75% 75%, rgba(34, 197, 94, 0.12) 1px, transparent 1px),
               radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.08) 1.5px, transparent 1.5px)
             `,
             backgroundSize: '60px 60px, 40px 40px, 80px 80px',
             backgroundPosition: '0 0, 20px 20px, 40px 40px'
           }}>

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
                <div className="backdrop-blur-sm bg-white/80 dark:bg-neutral-900/80 rounded-3xl p-8 mx-4 shadow-2xl border border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 flex items-center justify-center shadow-lg">
                    <i className="fa-solid fa-comments text-3xl text-green-600 dark:text-green-400"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 tracking-tight">
                    {t('select_conversation')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 max-w-md leading-relaxed">
                    {t('select_conversation_description')}
                  </p>
                </div>
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
