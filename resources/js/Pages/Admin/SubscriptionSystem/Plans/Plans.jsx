import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useTrans } from '@/Hooks/useTrans';
import Tabs from '@/Components/Tabs';
import SearchBar from '@/Components/SearchBar';
import PrimaryButton from '@/Components/PrimaryButton';
import PlansTable from './Partials/Tables/PlansTable';

export default function Plans({ auth, monthlyPlans, yearlyPlans, features, queryParams = null }) {
    queryParams = queryParams || {};
    const { t } = useTrans();

    // === Monthly Plans Tab ===
    const monthlyPlansContent = (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold leading-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <i className="fa-solid fa-calendar-days text-blue-500"></i> {t('monthly_plans')}
                </h2>
            </div>

            <div className="mb-4">
                <SearchBar
                    placeholder={t('search_plans')}
                    defaultValue={queryParams.name || ''}
                    queryKey="name"
                    routeName="admin.plans.index"
                    icon="fa-magnifying-glass"
                />
            </div>

            <PlansTable plans={monthlyPlans} />
        </div>
    );

    // === Yearly Plans Tab ===
    const yearlyPlansContent = (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold leading-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <i className="fa-solid fa-calendar text-green-500"></i> {t('yearly_plans')}
                </h2>

            </div>

            <div className="mb-4">
                <SearchBar
                    placeholder={t('search_plans')}
                    defaultValue={queryParams.name || ''}
                    queryKey="name"
                    routeName="admin.plans.index"
                    icon="fa-magnifying-glass"
                />
            </div>

            <PlansTable plans={yearlyPlans} />
        </div>
    );

    const tabs = [
        {
            title: t('monthly_plans'),
            icon: 'fa-calendar-days',
            content: monthlyPlansContent,
        },
        {
            title: t('yearly_plans'),
            icon: 'fa-calendar',
            content: yearlyPlansContent,
        },
    ];

    return (
        <AppLayout>
            <Head title={t('plan_management')} />

            <div className="m-3 xl:m-5">
                <div className="overflow-hidden rounded-2xl shadow-lg dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
                    <div className="p-4 text-neutral-900 dark:text-neutral-100">
                        <Tabs tabs={tabs} />
                    </div>
                </div>
            </div>


        </AppLayout>
    );
}
