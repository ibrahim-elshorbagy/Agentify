// EmailTablePartials.jsx - Shared functions for EmailTable component

// Function to get folder color classes
export const getFolderColorClasses = (folder) => {
  switch (folder) {
    case 'inbox':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'spam':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case 'bin':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    case 'starred':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'archive':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'promotions':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'social':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'personal':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
    case 'clients':
      return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200';
    case 'team':
      return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
    case 'finance':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
    case 'hr':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
    case 'other':
      return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200';
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  }
};

// Function to get folder icon class
export const getFolderIconClass = (type) => {
  switch (type) {
    case 'inbox':
      return 'fa-inbox text-blue-500';
    case 'spam':
      return 'fa-exclamation-circle text-orange-500';
    case 'bin':
      return 'fa-trash text-gray-500';
    case 'starred':
      return 'fa-star text-yellow-500';
    case 'archive':
      return 'fa-archive text-purple-500';
    case 'promotions':
      return 'fa-bullhorn text-purple-500';
    case 'social':
      return 'fa-users text-green-500';
    case 'personal':
      return 'fa-user text-indigo-500';
    case 'clients':
      return 'fa-handshake text-teal-500';
    case 'team':
      return 'fa-users-cog text-cyan-500';
    case 'finance':
      return 'fa-dollar-sign text-emerald-500';
    case 'hr':
      return 'fa-user-tie text-pink-500';
    case 'other':
      return 'fa-folder text-slate-500';
    default:
      return 'fa-inbox text-blue-500';
  }
};

// Function to get folder title
export const getFolderTitle = (type, t) => {
  switch (type) {
    case 'inbox':
      return t('inbox_emails');
    case 'spam':
      return t('spam_emails');
    case 'bin':
      return t('bin_emails');
    case 'starred':
      return t('starred');
    case 'archive':
      return t('archive');
    case 'promotions':
      return t('promotions');
    case 'social':
      return t('social');
    case 'personal':
      return t('personal');
    case 'clients':
      return t('clients');
    case 'team':
      return t('team');
    case 'finance':
      return t('finance');
    case 'hr':
      return t('hr');
    case 'other':
      return t('other');
    default:
      return t('emails');
  }
};
