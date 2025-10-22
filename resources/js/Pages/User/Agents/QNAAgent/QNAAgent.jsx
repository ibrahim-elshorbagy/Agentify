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

      <div className="min-h-screen flex bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 overflow-hidden relative"
           style={{
             backgroundImage: `
               radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.18) 2px, transparent 2px),
               radial-gradient(circle at 75% 75%, rgba(34, 197, 94, 0.14) 1px, transparent 1px),
               radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.10) 1.5px, transparent 1.5px),
               radial-gradient(circle at 10% 90%, rgba(20, 184, 166, 0.08) 1px, transparent 1px),
               radial-gradient(circle at 90% 10%, rgba(16, 185, 129, 0.06) 0.8px, transparent 0.8px)
             `,
             backgroundSize: '60px 60px, 40px 40px, 80px 80px, 100px 100px, 120px 120px',
             backgroundPosition: '0 0, 20px 20px, 40px 40px, 10px 10px, 60px 60px',
             animation: 'floatDots 20s ease-in-out infinite'
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
        <div className={`flex-1 flex flex-col min-h-screen overflow-hidden ${isSidebarOpen ? 'xl:ml-0' : ''}`}>
          <ChatInterface
            currentConversation={currentConversation}
            messages={messages}
            onEditConversation={toggleEditConversationModal}
            onToggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
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
