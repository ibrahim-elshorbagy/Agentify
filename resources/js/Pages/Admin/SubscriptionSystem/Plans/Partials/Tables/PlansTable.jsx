import React from 'react';
import { Link } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import SelectableTable from '@/Components/SelectableTable';
import ActionButton from '@/Components/ActionButton';

export default function PlansTable({ plans }) {
    const { t } = useTrans();

    // Table configuration
    const columns = [
        { field: 'id', label: t('id'), icon: 'fa-hashtag' },
        { field: 'name', label: t('name'), icon: 'fa-tag' },
        { field: 'price', label: t('price'), icon: 'fa-dollar-sign' },
        { field: 'type', label: t('type'), icon: 'fa-calendar' },
        { field: 'updated_at', label: t('updated_at'), icon: 'fa-calendar' },
        { field: 'actions', label: t('actions'), icon: 'fa-gear', className: 'flex justify-center' }
    ];

    const sortOptions = [
        { field: 'id', label: t('id') },
        { field: 'price', label: t('price') },
        { field: 'type', label: t('type') },
        { field: 'updated_at', label: t('updated_at') }
    ];

    const renderRow = (plan) => (
        <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                {plan.id}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <i className="fa-solid fa-tag text-green-500"></i>
                    <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {plan.name_value}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-900 dark:text-neutral-100">
                        ${plan.price}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    plan.type === 'monthly'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                }`}>
                    <i className={`fa-solid ${plan.type === 'monthly' ? 'fa-calendar-days' : 'fa-calendar'} mx-1`}></i>
                    {plan.type === 'monthly' ? t('monthly') : t('yearly')}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {new Date(plan.updated_at).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center justify-center gap-2">
                    <ActionButton
                        href={route('admin.plans.edit', plan.id)}
                        variant="edit"
                        icon="fa-edit"
                        size="xs"
                        as="a"
                    >
                        {t('edit_plan')}
                    </ActionButton>
                </div>
            </td>
        </>
    );

    return (
        <SelectableTable
            columns={columns}
            data={plans.data}
            renderRow={renderRow}
            pagination={plans}
            routeName="admin.plans.index"
            sortOptions={sortOptions}
            defaultSortField="id"
            defaultSortDirection="desc"
            showSelection={false}
        />
    );
}
