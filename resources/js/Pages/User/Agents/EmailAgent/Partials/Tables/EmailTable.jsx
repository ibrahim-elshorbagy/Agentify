import { useTrans } from "@/hooks/useTrans";
import { router } from "@inertiajs/react";
import { useState } from "react";
import SelectableTable from "@/Components/SelectableTable";
import SearchBar from "@/Components/SearchBar";
import ActionButton from "@/Components/ActionButton";
import MoveEmailsModal from "../Modals/MoveEmailsModal";
import { getFolderColorClasses, getFolderIconClass, getFolderTitle } from "./Partials/EmailTablePartials";
import {
  toggleStar,
  toggleArchive,
  toggleRead,
  updateFolder,
  moveToSpam,
  moveToBin,
  restore,
  handleGetGmail,
  handleGetOutlook,
  deletePermanently,
  getBulkActions
} from "./Partials/EmailTableActions";

export default function EmailTable({ emails, queryParams, type, source }) {
  const { t } = useTrans();

  // Modal state
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [selectedEmailsForMove, setSelectedEmailsForMove] = useState([]);

  // Handle move emails modal
  const handleMoveEmails = (selectedEmails) => {
    setSelectedEmailsForMove(selectedEmails);
    setIsMoveModalOpen(true);
  };

  // Table configuration
  const columns = [
    { field: 'row_number', label: t('serial'), icon: 'fa-hashtag' },
    { field: 'from', label: t('from'), icon: 'fa-user' },
    { field: 'subject', label: t('subject'), icon: 'fa-envelope' },
    { field: 'received_at', label: t('received_at'), icon: 'fa-calendar' },
    { field: 'actions', label: t('actions'), icon: 'fa-gear', className: 'flex justify-center' }
  ];

  const sortOptions = [
    { field: 'id', label: t('id') },
    { field: 'from_email', label: t('from') },
    { field: 'subject', label: t('subject') },
    { field: 'received_at', label: t('received_at') },
    { field: 'created_at', label: t('created_at') },
    { field: 'is_starred', label: t('starred') },
    { field: 'is_read', label: t('read') }
  ];

  // Custom row renderer with proper table structure
  const renderRow = (email) => {
    // Get actions based on folder type
    const getActionButtons = () => {
      const buttons = [
        // View button (always present)
        <ActionButton
          key="view"
          href={route('user.email-agent.view', email.id)}
          variant="info"
          icon="fa-eye"
          size="xs"
          as="a"
        >
          {t('view')}
        </ActionButton>
      ];

      // Add folder-specific action buttons
      if (type === 'inbox') {
        buttons.push(
          <ActionButton
            key="spam"
            onClick={() => moveToSpam(email.id)}
            variant="warning"
            icon="fa-exclamation-circle"
            size="xs"
            as="button"
          >
            {t('spam')}
          </ActionButton>,
          <ActionButton
            key="bin"
            onClick={() => moveToBin(email.id)}
            variant="delete"
            icon="fa-trash-can"
            size="xs"
            as="button"
          >
            {t('bin')}
          </ActionButton>
        );
      } else if (type === 'spam') {
        buttons.push(
          <ActionButton
            key="restore"
            onClick={() => restore(email.id)}
            variant="success"
            icon="fa-undo"
            size="xs"
            as="button"
          >
            {t('restore')}
          </ActionButton>,
          <ActionButton
            key="bin"
            onClick={() => moveToBin(email.id)}
            variant="delete"
            icon="fa-trash-can"
            size="xs"
            as="button"
          >
            {t('bin')}
          </ActionButton>
        );
      } else if (type === 'bin') {
        buttons.push(
          <ActionButton
            key="restore"
            onClick={() => restore(email.id)}
            variant="success"
            icon="fa-undo"
            size="xs"
            as="button"
          >
            {t('restore')}
          </ActionButton>,
          <ActionButton
            key="spam"
            onClick={() => moveToSpam(email.id)}
            variant="warning"
            icon="fa-exclamation-circle"
            size="xs"
            as="button"
          >
            {t('spam')}
          </ActionButton>,
          <ActionButton
            key="delete"
            onClick={() => deletePermanently(email.id)}
            variant="delete"
            icon="fa-trash-can"
            size="xs"
            as="button"
          >
            {t('delete_permanently')}
          </ActionButton>
        );
      } else {
        // For all other folders (promotions, social, personal, clients, team, finance, hr, starred, archive)
        buttons.push(
          <ActionButton
            key="bin"
            onClick={() => moveToBin(email.id)}
            variant="delete"
            icon="fa-trash-can"
            size="xs"
            as="button"
          >
            {t('bin')}
          </ActionButton>
        );
      }

      return buttons;
    };

    return (
      <>
        <td className="px-3 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
          {email.row_number}
        </td>
        <td className="px-3 py-4 whitespace-nowrap">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-user text-blue-500"></i>
              <span className={`text-sm font-medium text-neutral-900 dark:text-neutral-100 ${!email.is_read ? 'font-bold' : 'font-normal'}`}>
                {email.from_name || email.from_email}
              </span>
            </div>
            {email.from_name && (
              <span className="text-xs text-neutral-500 dark:text-neutral-400 mx-6">
                {email.from_email}
              </span>
            )}
          </div>
        </td>
        <td className="px-3 py-4 whitespace-nowrap">
          <div className="flex items-center gap-2">
            {type === 'inbox' && email.folder !== 'inbox' && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getFolderColorClasses(email.folder)}`}>
                {t(email.folder)}
              </span>
            )}
            <span className={`text-sm text-neutral-900 dark:text-neutral-100 truncate max-w-xs ${!email.is_read ? 'font-bold' : 'font-normal'}`}>
              {email.subject}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
          {email.received_at || email.created_at}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex items-center justify-center gap-2">
            {/* Star */}
            <button
              onClick={() => toggleStar(email.id, email.is_starred)}
              className="hover:scale-110 transition-transform duration-200"
            >
              {email.is_starred ? (
                <i className="fa-solid fa-star text-yellow-500 text-lg hover:text-yellow-600"></i>
              ) : (
                <i className="fa-regular fa-star text-gray-400 text-lg hover:text-yellow-500"></i>
              )}
            </button>

            {/* Read/Unread toggle */}
            <button
              onClick={() => toggleRead(email.id, email.is_read)}
              className="hover:scale-110 transition-transform duration-200"
              title={email.is_read ? t('mark_as_unread') : t('mark_as_read')}
            >
              {email.is_read ? (
                <i className="fa-solid fa-envelope-open text-blue-500 text-lg hover:text-blue-600"></i>
              ) : (
                <i className="fa-solid fa-envelope text-green-500 text-lg hover:text-green-600"></i>
              )}
            </button>

            {/* Archive toggle - only show for folders that can be archived */}
            {(!['archive', 'starred', 'spam', 'bin'].includes(type) || type === 'archive') && (
              <button
                onClick={() => toggleArchive(email.id, email.is_archived)}
                className="hover:scale-110 transition-transform duration-200"
                title={email.is_archived ? t('unarchive') : t('archive')}
              >
                {email.is_archived ? (
                  <i className="fa-solid fa-undo text-purple-500 text-lg hover:text-purple-600"></i>
                ) : (
                  <i className="fa-solid fa-archive text-purple-500 text-lg hover:text-purple-600"></i>
                )}
              </button>
            )}

            {/* Dynamic Action Buttons */}
            {getActionButtons()}
          </div>
        </td>
      </>
    );
  };

  // Gmail-style row styling function
  const getRowClassName = (email, index, isSelected) => {
    if (isSelected) return ''; // Let SelectableTable handle selected state

    if (!email.is_read) {
      // Unread emails have a slightly lighter green background (Gmail style)
      return 'bg-green-50/80 dark:bg-green-900/40 hover:bg-green-100/60 dark:hover:bg-green-800/30';
    } else {
      // Read emails have a slightly darker green background
      return 'bg-green-100/60 dark:bg-green-800/30 hover:bg-green-200/50 dark:hover:bg-green-700/20';
    }
  }; return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold leading-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <i className={`fa-solid ${getFolderIconClass(type)}`}></i>
          {getFolderTitle(type, t)}
        </h2>
      </div>
      <div className="mb-4">
        <SearchBar
          placeholder={t('search')}
          defaultValue={queryParams.search || ''}
          queryKey="search"
          routeName="user.email-agent.emails"
          routeParams={{ folder: type }}
          icon="fa-magnifying-glass"
          pageParam="page"
        />
      </div>
      <SelectableTable
        columns={columns}
        data={emails.data}
        renderRow={renderRow}
        pagination={emails}
        routeName="user.email-agent.emails"
        queryParams={{ ...queryParams, folder: type }}
        sortOptions={sortOptions}
        defaultSortField="created_at"
        defaultSortDirection="desc"
        getRowClassName={getRowClassName}
        bulkActions={getBulkActions(type, t, handleMoveEmails)}
        pageParam="page"
        MoreButtons={<>
          {/* Action buttons for getting emails */}
          <div className="flex gap-3 justify-center">
            {source === 'gmail' && (
              <ActionButton
                onClick={handleGetGmail}
                icon="fa-envelope"
                variant="delete"
                size="sm"
              >
                {t('fetch_emails')}
              </ActionButton>
            )}
            {source === 'outlook' && (
              <ActionButton
                onClick={handleGetOutlook}
                icon="fa-envelope-open"
                variant="info"
                size="sm"
              >
                {t('fetch_emails')}
              </ActionButton>
            )}
          </div>
        </>}
      />

      <MoveEmailsModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        selectedEmails={selectedEmailsForMove}
        currentFolder={type}
      />
    </>
  );
}
