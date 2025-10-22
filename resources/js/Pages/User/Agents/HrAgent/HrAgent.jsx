import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useTrans } from '@/Hooks/useTrans';
import SelectableTable from '@/Components/SelectableTable';
import ActionButton from '@/Components/ActionButton';
import SearchBar from '@/Components/SearchBar';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, router } from '@inertiajs/react';
import UploadFileModal from './Partials/UploadFileModal';

export default function Index({ hrAgents, allIds = [], queryParams }) {
  const { t } = useTrans();

  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Selection state
  const [selectedItems, setSelectedItems] = useState([]);

  // Toggle modals
  const toggleUploadModal = () => setIsUploadModalOpen(!isUploadModalOpen);

  // Bulk action handlers
  const handleBulkDelete = async (ids) => {
    router.delete(route('user.hr-agent.bulk.delete'), {
      data: { ids },
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Single delete handler
  const handleDelete = (hrAgentId) => {
    if (confirm(t('confirm_delete_hr_candidate'))) {
      router.delete(route('user.hr-agent.destroy', hrAgentId), {
        preserveState: true,
        preserveScroll: true,
      });
    }
  };

  // Handle Gmail button click
  const handleGetGmail = () => {
    router.post(route('user.hr-agent.get-gmail'), {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Handle Outlook button click
  const handleGetOutlook = () => {
    router.post(route('user.hr-agent.get-outlook'), {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Define bulk actions
  const bulkActions = [
    {
      label: t('delete'),
      icon: 'fa-solid fa-trash-can',
      handler: handleBulkDelete,
      variant: 'delete',
      requiresConfirmation: true,
      confirmMessageKey: 'confirm_delete_hr_candidates'
    }
  ];

  // Table configuration
  const columns = [
    { field: 'row_number', label: t('serial'), icon: 'fa-hashtag' },
    { field: 'candidate_name', label: t('name'), icon: 'fa-user' },
    { field: 'email_address', label: t('email_address'), icon: 'fa-envelope' },
    { field: 'contact_number', label: t('contact_number'), icon: 'fa-phone' },
    { field: 'score', label: t('score'), icon: 'fa-star' },
    { field: 'analyzed_at', label: t('analyzed_at'), icon: 'fa-calendar' },
    { field: 'actions', label: t('actions'), icon: 'fa-gear', className: 'flex justify-center' }
  ];

  const sortOptions = [
    { field: 'candidate_name', label: t('name') },
    { field: 'email_address', label: t('email_address') },
    { field: 'contact_number', label: t('contact_number') },
    { field: 'score', label: t('score') },
    { field: 'analyzed_at', label: t('analyzed_at') },
  ];

  // Render row actions
  const renderRow = (hrAgent) => (
    <>
      <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
        {hrAgent.row_number}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-user text-blue-500"></i>
          {hrAgent.candidate_name}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-envelope text-green-500"></i>
          {hrAgent.email_address}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-phone text-purple-500"></i>
          {hrAgent.contact_number}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-star text-yellow-500"></i>
          {hrAgent.score}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-calendar text-orange-500"></i>
          {hrAgent.analyzed_at ? new Date(hrAgent.analyzed_at).toLocaleDateString() : '-'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center gap-2">
        <Link
          href={route('user.hr-agent.view', hrAgent.id)}
          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
          onClick={(e) => e.stopPropagation()}
        >
          <i className="fa-solid fa-eye"></i>
        </Link>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(hrAgent.id);
          }}
          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
        >
          <i className="fa-solid fa-trash-can"></i>
        </button>
      </td>
    </>
  );

  // Gmail-style row styling function (matching inbox design)
  const getRowClassName = (hrAgent, index, isSelected) => {
    if (isSelected) return ''; // Let SelectableTable handle selected state

    // Use alternating green colors for HR candidates
    return index % 2 === 0 ? 'bg-green-50/80 dark:bg-green-900/20' : 'bg-green-100/60 dark:bg-green-800/30';
  };

  // Select All Config
  const selectAllConfig = allIds.length > 0 ? {
    checked: selectedItems.length === allIds.length && allIds.every(id => selectedItems.includes(id)),
    onChange: (e) => {
      if (e.target.checked) {
        setSelectedItems(allIds);
      } else {
        setSelectedItems([]);
      }
    },
    label: `${t('select_all')} (${allIds.length}) ${t('candidates')}`
  } : null;

  return (
    <AppLayout>
      <div className=""
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
        <div className="flex-1 p-3 xl:p-5">
          <div className="overflow-hidden rounded-2xl shadow-lg bg-green-50/80 dark:bg-green-900/20 border border-green-200 dark:border-green-700 backdrop-blur-lg">
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold leading-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <i className="fa-solid fa-users text-blue-500"></i> {t('hr_agent')}
                </h2>


              </div>
              <div className="mb-4">
                <SearchBar
                  placeholder={t('search_candidates')}
                  defaultValue={queryParams.search || ''}
                  queryKey="search"
                  routeName="user.hr-agent.index"
                  icon="fa-search"
                  routeParams={{}}
                />
              </div>


              <SelectableTable
                columns={columns}
                data={hrAgents.data}
                onRowClick={(hrAgent) => router.visit(route('user.hr-agent.view', hrAgent.id))}
                routeName="user.hr-agent.index"
                queryParams={queryParams}
                renderRow={renderRow}
                pagination={hrAgents}
                bulkActions={bulkActions}
                sortOptions={sortOptions}
                defaultSortField="analyzed_at"
                defaultSortDirection="desc"
                getRowClassName={getRowClassName}
                selectedItems={selectedItems}
                onSelectionChange={setSelectedItems}
                selectAllConfig={selectAllConfig}
                MoreButtons={
                  <>
                    {/* Action buttons */}
                    <ActionButton
                      onClick={toggleUploadModal}
                      icon="fa-upload"
                      variant="purple"
                      size="sm"
                    >
                      {t('upload_cv_files')}
                    </ActionButton>

                    <ActionButton
                      onClick={handleGetGmail}
                      icon="fa-envelope"
                      variant="delete"
                      size="sm"
                    >
                      {t('get_gmail')}
                    </ActionButton>

                    <ActionButton
                      onClick={handleGetOutlook}
                      icon="fa-envelope-open"
                      variant="info"
                      size="sm"
                    >
                      {t('get_outlook')}
                    </ActionButton>
                  </>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Upload File Modal */}
      <UploadFileModal
        isOpen={isUploadModalOpen}
        onClose={toggleUploadModal}
      />
    </AppLayout>
  );
}
