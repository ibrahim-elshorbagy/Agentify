import { useTrans } from "@/hooks/useTrans";
import { router } from "@inertiajs/react";
import SelectableTable from "@/Components/SelectableTable";
import SearchBar from "@/Components/SearchBar";
import ActionButton from "@/Components/ActionButton";

export default function EmailTable({ emails, queryParams, type }) {
  const { t } = useTrans();

  // Toggle star function - use appropriate bulk action based on current star state
  const toggleStar = (emailId, isStarred) => {
    const route_name = isStarred ? 'user.email-agent.bulk.unstar' : 'user.email-agent.bulk.star';
    router.patch(route(route_name), {
      ids: [emailId]
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Toggle read function - use appropriate bulk action based on current read state
  const toggleRead = (emailId, isRead) => {
    const route_name = isRead ? 'user.email-agent.bulk.mark-unread' : 'user.email-agent.bulk.mark-read';
    router.patch(route(route_name), {
      ids: [emailId]
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Update folder function - unified function to move messages to any folder
  const updateFolder = (emailId, folder) => {
    router.patch(route('user.email-agent.bulk.update-folder', { folder }), {
      ids: [emailId]
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Individual action functions using the unified updateFolder
  const moveToSpam = (emailId) => updateFolder(emailId, 'spam');
  const moveToBin = (emailId) => updateFolder(emailId, 'bin');
  const restore = (emailId) => updateFolder(emailId, 'inbox');

  // Delete permanently function - use bulk delete-permanently action with single ID
  const deletePermanently = (emailId) => {
    router.delete(route('user.email-agent.bulk.delete-permanently'), {
      data: { ids: [emailId] },
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Bulk action handlers
  const handleBulkMarkAsRead = async (ids) => {
    router.patch(route('user.email-agent.bulk.mark-read'), {
      ids
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleBulkMarkAsUnread = async (ids) => {
    router.patch(route('user.email-agent.bulk.mark-unread'), {
      ids
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleBulkStar = async (ids) => {
    router.patch(route('user.email-agent.bulk.star'), {
      ids
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleBulkUnStar = async (ids) => {
    router.patch(route('user.email-agent.bulk.unstar'), {
      ids
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Unified bulk update folder function
  const handleBulkUpdateFolder = async (ids, folder) => {
    router.patch(route('user.email-agent.bulk.update-folder', { folder }), {
      ids
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Bulk action handlers using the unified function
  const handleBulkMoveToSpam = async (ids) => handleBulkUpdateFolder(ids, 'spam');
  const handleBulkMoveToBin = async (ids) => handleBulkUpdateFolder(ids, 'bin');
  const handleBulkRestore = async (ids) => handleBulkUpdateFolder(ids, 'inbox');

  const handleBulkDeletePermanently = async (ids) => {
    router.delete(route('user.email-agent.bulk.delete-permanently'), {
      data: { ids },
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Define bulk actions based on folder type
  const getBulkActions = () => {
    const baseActions = [
      {
        label: t('mark_as_read'),
        icon: 'fa-solid fa-envelope-open',
        handler: handleBulkMarkAsRead,
        variant: 'green'
      },
      {
        label: t('mark_as_unread'),
        icon: 'fa-solid fa-envelope',
        handler: handleBulkMarkAsUnread,
        variant: 'green'
      },
      {
        label: t('add_star'),
        icon: 'fa-solid fa-star',
        handler: handleBulkStar,
        variant: 'green'
      },
      {
        label: t('remove_star'),
        icon: 'fa-star fa-regular',
        handler: handleBulkUnStar,
        variant: 'green'
      }
    ];

    // Add folder-specific actions
    if (type === 'inbox') {
      baseActions.push(
        {
          label: t('move_to_spam'),
          icon: 'fa-solid fa-exclamation-circle',
          handler: handleBulkMoveToSpam,
          variant: 'yellow',
          requiresConfirmation: true,
          confirmMessageKey: 'confirm_move_to_spam'
        },
        {
          label: t('move_to_bin'),
          icon: 'fa-solid fa-trash-can',
          handler: handleBulkMoveToBin,
          variant: 'delete',
          requiresConfirmation: true,
          confirmMessageKey: 'confirm_move_to_bin'
        }
      );
    } else if (type === 'spam') {
      baseActions.push(
        {
          label: t('restore_to_inbox'),
          icon: 'fa-solid fa-undo',
          handler: handleBulkRestore,
          variant: 'blue',
          requiresConfirmation: true,
          confirmMessageKey: 'confirm_restore_emails'
        },
        {
          label: t('move_to_bin'),
          icon: 'fa-solid fa-trash-can',
          handler: handleBulkMoveToBin,
          variant: 'delete',
          requiresConfirmation: true,
          confirmMessageKey: 'confirm_move_to_bin'
        }
      );
    } else if (type === 'bin') {
      baseActions.push(
        {
          label: t('restore_to_inbox'),
          icon: 'fa-solid fa-undo',
          handler: handleBulkRestore,
          variant: 'blue',
          requiresConfirmation: true,
          confirmMessageKey: 'confirm_restore_emails'
        },
        {
          label: t('move_to_spam'),
          icon: 'fa-solid fa-exclamation-circle',
          handler: handleBulkMoveToSpam,
          variant: 'yellow',
          requiresConfirmation: true,
          confirmMessageKey: 'confirm_move_to_spam'
        },
        {
          label: t('delete_permanently'),
          icon: 'fa-solid fa-trash-can',
          handler: handleBulkDeletePermanently,
          variant: 'delete',
          requiresConfirmation: true,
          confirmMessageKey: 'confirm_permanent_delete_bulk'
        }
      );
    }

    return baseActions;
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
            {email.is_starred && <i className="fa-solid fa-star text-yellow-500"></i>}
            <i className="fa-solid fa-envelope text-green-500"></i>
            <span className={`text-sm text-neutral-900 dark:text-neutral-100 truncate max-w-xs ${!email.is_read ? 'font-bold' : 'font-normal'}`}>
              {email.subject}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
          {new Date(email.received_at || email.created_at).toLocaleDateString()}
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
      // Unread emails have a white/light background (Gmail style)
      return 'bg-white dark:bg-neutral-800 hover:bg-blue-100/10 dark:hover:bg-blue-100/10';
    } else {
      // Read emails have a slightly gray background
      return 'bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-700';
    }
  }; return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold leading-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <i className={`fa-solid ${type === 'inbox' ? 'fa-inbox text-blue-500' :
              type === 'spam' ? 'fa-exclamation-circle text-orange-500' :
                type === 'bin' ? 'fa-trash text-gray-500' :
                  'fa-inbox text-blue-500'
            }`}></i>
          {type === 'inbox' ? t('inbox_emails') :
            type === 'spam' ? t('spam_emails') :
              type === 'bin' ? t('bin_emails') :
                t('emails')}
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
        bulkActions={getBulkActions()}
        pageParam="page"
      />
    </>
  );
}
