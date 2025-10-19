import { router } from "@inertiajs/react";

// Toggle star function - use appropriate bulk action based on current star state
export const toggleStar = (emailId, isStarred) => {
  const route_name = isStarred ? 'user.email-agent.bulk.unstar' : 'user.email-agent.bulk.star';
  router.patch(route(route_name), {
    ids: [emailId]
  }, {
    preserveState: true,
    preserveScroll: true,
  });
};

// Toggle archive function - use appropriate bulk action based on current archive state
export const toggleArchive = (emailId, isArchived) => {
  const route_name = isArchived ? 'user.email-agent.bulk.unarchive' : 'user.email-agent.bulk.archive';
  router.patch(route(route_name), {
    ids: [emailId]
  }, {
    preserveState: true,
    preserveScroll: true,
  });
};

// Toggle read function - use appropriate bulk action based on current read state
export const toggleRead = (emailId, isRead) => {
  const route_name = isRead ? 'user.email-agent.bulk.mark-unread' : 'user.email-agent.bulk.mark-read';
  router.patch(route(route_name), {
    ids: [emailId]
  }, {
    preserveState: true,
    preserveScroll: true,
  });
};

// Update folder function - unified function to move messages to any folder
export const updateFolder = (emailId, folder) => {
  router.patch(route('user.email-agent.bulk.update-folder', { folder }), {
    ids: [emailId]
  }, {
    preserveState: true,
    preserveScroll: true,
  });
};

// Individual action functions using the unified updateFolder
export const moveToSpam = (emailId) => updateFolder(emailId, 'spam');
export const moveToBin = (emailId) => updateFolder(emailId, 'bin');
export const restore = (emailId) => updateFolder(emailId, 'inbox');

// Handle Gmail button click
export const handleGetGmail = () => {
  router.post(route('user.email-agent.get-gmail'), {}, {
    preserveState: true,
    preserveScroll: true,
  });
};

// Handle Outlook button click
export const handleGetOutlook = () => {
  router.post(route('user.email-agent.get-outlook'), {}, {
    preserveState: true,
    preserveScroll: true,
  });
};

// Delete permanently function - use bulk delete-permanently action with single ID
export const deletePermanently = (emailId) => {
  router.delete(route('user.email-agent.bulk.delete-permanently'), {
    data: { ids: [emailId] },
    preserveState: true,
    preserveScroll: true,
  });
};

// Bulk action handlers
export const handleBulkMarkAsRead = async (ids) => {
  router.patch(route('user.email-agent.bulk.mark-read'), {
    ids
  }, {
    preserveState: true,
    preserveScroll: true,
  });
};

export const handleBulkMarkAsUnread = async (ids) => {
  router.patch(route('user.email-agent.bulk.mark-unread'), {
    ids
  }, {
    preserveState: true,
    preserveScroll: true,
  });
};

export const handleBulkStar = async (ids) => {
  router.patch(route('user.email-agent.bulk.star'), {
    ids
  }, {
    preserveState: true,
    preserveScroll: true,
  });
};

export const handleBulkUnStar = async (ids) => {
  router.patch(route('user.email-agent.bulk.unstar'), {
    ids
  }, {
    preserveState: true,
    preserveScroll: true,
  });
};

export const handleBulkArchive = async (ids) => {
  router.patch(route('user.email-agent.bulk.archive'), {
    ids
  }, {
    preserveState: true,
    preserveScroll: true,
  });
};

export const handleBulkUnarchive = async (ids) => {
  router.patch(route('user.email-agent.bulk.unarchive'), {
    ids
  }, {
    preserveState: true,
    preserveScroll: true,
  });
};

// Unified bulk update folder function
export const handleBulkUpdateFolder = async (ids, folder) => {
  router.patch(route('user.email-agent.bulk.update-folder', { folder }), {
    ids
  }, {
    preserveState: true,
    preserveScroll: true,
  });
};

// Bulk action handlers using the unified function
export const handleBulkMoveToSpam = async (ids) => handleBulkUpdateFolder(ids, 'spam');
export const handleBulkMoveToBin = async (ids) => handleBulkUpdateFolder(ids, 'bin');
export const handleBulkRestore = async (ids) => handleBulkUpdateFolder(ids, 'inbox');

export const handleBulkDeletePermanently = async (ids) => {
  router.delete(route('user.email-agent.bulk.delete-permanently'), {
    data: { ids },
    preserveState: true,
    preserveScroll: true,
  });
};

// Define bulk actions based on folder type
export const getBulkActions = (type, t) => {
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

  // Add archive actions for folders that can be archived (not archive/starred/spam/bin)
  if (!['archive', 'starred', 'spam', 'bin'].includes(type)) {
    baseActions.push(
      {
        label: t('archive'),
        icon: 'fa-solid fa-archive',
        handler: handleBulkArchive,
        variant: 'blue'
      }
    );
  }

  // Add unarchive action for archive folder
  if (type === 'archive') {
    baseActions.push(
      {
        label: t('unarchive'),
        icon: 'fa-solid fa-undo',
        handler: handleBulkUnarchive,
        variant: 'blue'
      }
    );
  }

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
  } else if (['promotions', 'social', 'personal', 'clients', 'team', 'finance', 'hr'].includes(type)) {
    // Label folders have similar actions to inbox
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
  }

  return baseActions;
};
