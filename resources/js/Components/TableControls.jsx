import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import ActionButton from '@/Components/ActionButton';
import { useTrans } from '@/Hooks/useTrans';

export default function TableControls({
  onSort,
  sortField,
  sortDirection,
  perPage = 15,
  totalItems = 0,
  onPerPageChange,
  selectedItems = [],
  onSelectAll,
  onBulkDelete,
  sortOptions = [],
  queryParams = {},
  routeName,
}) {
  const { t } = useTrans();
  const [showPerPage, setShowPerPage] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const perPageOptions = [10, 25, 50, 100];

  const handleSort = (field) => {
    let direction = 'asc';
    if (field === sortField && sortDirection === 'asc') {
      direction = 'desc';
    }
    onSort(field, direction);
    setShowSortMenu(false);
  };

  const handlePerPageChange = (value) => {
    onPerPageChange(value);
    setShowPerPage(false);
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;

    if (confirm(t('confirm_bulk_delete').replace('{count}', selectedItems.length))) {
      onBulkDelete(selectedItems);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowPerPage(false);
      setShowSortMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-sm">
      <div className="flex items-center gap-2">
        {selectedItems.length > 0 ? (
          <ActionButton
            variant="delete"
            icon="fa-trash"
            size="sm"
            onClick={handleBulkDelete}
          >
            {t('delete_selected')} ({selectedItems.length})
          </ActionButton>
        ) : (
          <div className="text-neutral-500 dark:text-neutral-400">
            {totalItems} {totalItems !== 1 ? t('items') : t('item')}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Sort dropdown */}
        {sortOptions.length > 0 && (
          <div className="relative" onClick={stopPropagation}>
            <ActionButton
              variant="primary"
              icon="fa-sort"
              size="sm"
              onClick={(e) => { e.stopPropagation(); setShowSortMenu(!showSortMenu); }}
            >
              {t('sort')}
              {sortField && <span className="hidden sm:inline ml-1">{t('by')} {t(sortField)} {sortDirection === 'asc' ? `↑ ${t('ascending')}` : `↓ ${t('descending')}`}</span>}
            </ActionButton>

            {showSortMenu && (
              <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg shadow-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option.field}
                      className={`flex items-center w-full px-4 py-2 gap-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 ${sortField === option.field ? 'text-green-600 dark:text-green-400' : 'text-neutral-700 dark:text-neutral-200'}`}
                      onClick={() => handleSort(option.field)}
                    >
                      {option.label}
                      {sortField === option.field && (
                        <i className={` fa-solid ${sortDirection === 'asc' ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Per page dropdown */}
        <div className="relative" onClick={stopPropagation}>
          <ActionButton
            variant="primary"
            icon="fa-list-ol"
            size="sm"
            className="bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600"
            onClick={(e) => { e.stopPropagation(); setShowPerPage(!showPerPage); }}
          >
            <span>{perPage}</span> {t('per_page')}
          </ActionButton>

          {showPerPage && (
            <div className="absolute right-0 z-10 mt-1 w-36 rounded-lg shadow-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
              <div className="py-1">
                {perPageOptions.map((option) => (
                  <button
                    key={option}
                    className={`flex w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 ${perPage === option ? 'text-green-600 dark:text-green-400' : 'text-neutral-700 dark:text-neutral-200'}`}
                    onClick={() => handlePerPageChange(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
