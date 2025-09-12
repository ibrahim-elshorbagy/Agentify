import React, { useState, useEffect } from 'react';
import Pagination from '@/Components/Pagination';
import TableControls from '@/Components/TableControls';
import { router } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function SelectableTable({
  columns,
  data,
  onRowClick = null,
  routeName,
  queryParams = {},
  renderRow = null,
  idField = 'id',
  pagination = null,
  onSort = null,
  onBulkDelete = null,
  sortOptions = [],
  defaultSortField = null,
  defaultSortDirection = 'asc',
  perPageOptions = [10, 25, 50, 100],
  defaultPerPage = 15,
  getRowClassName = null, // New prop for custom row styling
}) {
  // Initialize translation
  const { t } = useTrans();

  // State
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortField, setSortField] = useState(defaultSortField || '');
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);
  const [perPage, setPerPage] = useState(queryParams.per_page || 15);

  // Reset selections when data changes
  useEffect(() => {
    setSelectedItems([]);
    setSelectAll(false);
  }, [data]);

  // Handle row selection
  const handleSelect = (item) => {
    setSelectedItems(prev => {
      const itemId = item[idField];
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll || selectedItems.length === data.length) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      setSelectedItems(data.map(item => item[idField]));
      setSelectAll(true);
    }
  };

  // Handle sorting
  const handleSort = (field, direction) => {
    setSortField(field);
    setSortDirection(direction);

    if (onSort) {
      onSort(field, direction);
    } else if (routeName) {
      // Default behavior - update URL params
      const params = new URLSearchParams(queryParams);
      params.set('sort', field);
      params.set('direction', direction);
      router.get(route(routeName, {
        ...route().params,
        ...Object.fromEntries(params)
      }), {}, { preserveState: true });
    }
  };

  // Handle per page change
  const handlePerPageChange = (value) => {
    setPerPage(value);

    if (routeName) {
      // Force navigation to page 1 when changing per_page
      const routeParams = {...route().params};

      // Remove page parameter to reset to page 1
      if (routeParams.page) {
        delete routeParams.page;
      }

      // Set the new per_page value
      routeParams.per_page = value;

      router.get(route(routeName, routeParams), {}, { preserveState: true });
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async (ids) => {
    if (onBulkDelete) {
      await onBulkDelete(ids);
      setSelectedItems([]);
    }
  };

  return (
    <>
      <TableControls
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
        perPage={perPage}
        totalItems={pagination ? pagination.total : data.length}
        onPerPageChange={handlePerPageChange}
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onBulkDelete={handleBulkDelete}
        sortOptions={sortOptions}
        queryParams={queryParams}
        routeName={routeName}
      />

      <div className="overflow-auto">
        <table className="w-full text-sm rtl:text-right ltr:text-left text-neutral-800 dark:text-neutral-200">
          <thead className="text-neutral-700 uppercase border-b-2 border-neutral-500 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300">
            <tr>
              <th className="py-2 px-3 w-10">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-green-600 bg-neutral-100 border-neutral-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-neutral-800 dark:focus:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
                    checked={data.length > 0 && selectedItems.length === data.length}
                    onChange={handleSelectAll}
                  />
                </div>
              </th>
              {columns.map(column => (
                <th
                  key={column.field}
                  className={`py-2 px-3 font-semibold text-nowrap ${column.className || ''}`}
                >
                  <div className="flex items-center gap-1">
                    {column.icon && <i className={`fa-solid ${column.icon}`}></i>}
                    <span>{column.label}</span>
                    {sortOptions.find(opt => opt.field === column.field) && (
                      <button
                        className="ml-1"
                        onClick={() => handleSort(
                          column.field,
                          sortField === column.field && sortDirection === 'asc' ? 'desc' : 'asc'
                        )}
                      >
                        {sortField === column.field ? (
                          <i className={`fa-solid fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} text-green-500`}></i>
                        ) : (
                          <i className="fa-solid fa-sort text-neutral-400"></i>
                        )}
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => {
                const isSelected = selectedItems.includes(item[idField]);
                const customRowClass = getRowClassName ? getRowClassName(item, index, isSelected) : '';
                const defaultRowClass = index % 2 === 0 ? 'bg-neutral-100 dark:bg-neutral-800' : 'bg-neutral-50 dark:bg-neutral-900';

                return (
                  <tr
                    key={item[idField]}
                    className={`transition-colors ${customRowClass || defaultRowClass} border-b border-neutral-300 dark:border-neutral-800 ${isSelected ? 'bg-green-50 dark:bg-green-950' : ''} ${onRowClick ? 'cursor-pointer' : ''}`}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                  >
                    <td
                      className="px-3 py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(item);
                      }}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-green-600 bg-neutral-100 border-neutral-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-neutral-800 dark:focus:ring-offset-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neutral-600"
                          checked={isSelected}
                          onChange={() => {}} // onChange handled by the parent div's onClick
                        />
                      </div>
                    </td>
                    {renderRow
                      ? renderRow(item, isSelected, handleSelect)
                      : columns.map((column, i) => (
                          <td key={i} className="px-3 py-2">
                            {column.render
                              ? column.render(item)
                              : item[column.accessor] || '-'}
                          </td>
                        ))
                    }
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-3 py-2 text-center text-neutral-500 dark:text-neutral-400">
                  <i className="fa-regular fa-face-frown"></i> {t('no_items_found')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && <Pagination links={pagination.links} />}
    </>
  );
}
