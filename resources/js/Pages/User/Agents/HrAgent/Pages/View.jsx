import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useTrans } from '@/Hooks/useTrans';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link } from '@inertiajs/react';

export default function View({ hrAgent }) {
  const { t } = useTrans();

  return (
    <AppLayout>
      <div className="m-3 xl:m-5">
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl shadow-lg border border-neutral-300 dark:border-neutral-700 overflow-hidden">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {t('candidate_details')}
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  {hrAgent.candidate_name}
                </p>
              </div>
              <Link href={route('user.hr-agent.index')}>
                <PrimaryButton>
                  <i className="fa-solid fa-arrow-left mr-2"></i>
                  {t('back_to_candidates')}
                </PrimaryButton>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Candidate Name */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow duration-200">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-user text-blue-500"></i>
                  {t('name')}
                </label>
                <div className="text-neutral-900 dark:text-neutral-100 text-lg font-medium">
                  {hrAgent.candidate_name || '-'}
                </div>
              </div>

              {/* Email Address */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow duration-200">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-envelope text-green-500"></i>
                  {t('email_address')}
                </label>
                <div className="text-neutral-900 dark:text-neutral-100 text-lg font-medium">
                  {hrAgent.email_address || '-'}
                </div>
              </div>

              {/* Contact Number */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow duration-200">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-phone text-purple-500"></i>
                  {t('contact_number')}
                </label>
                <div className="text-neutral-900 dark:text-neutral-100 text-lg font-medium">
                  {hrAgent.contact_number || '-'}
                </div>
              </div>

              {/* Score */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow duration-200">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-star text-yellow-500"></i>
                  {t('score')}
                </label>
                <div className="text-neutral-900 dark:text-neutral-100 text-lg font-medium flex items-center gap-2">
                  <span className="text-2xl">{hrAgent.score || '-'}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fa-solid fa-star ${i < (hrAgent.score || 0) ? 'text-yellow-400' : 'text-gray-300'} text-sm`}></i>
                    ))}
                  </div>
                </div>
              </div>

              {/* Analyzed At */}
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow duration-200 md:col-span-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-2">
                  <i className="fa-solid fa-calendar text-orange-500"></i>
                  {t('analyzed_at')}
                </label>
                <div className="text-neutral-900 dark:text-neutral-100 text-lg font-medium flex items-center gap-2">
                  <i className="fa-solid fa-clock text-blue-500"></i>
                  {hrAgent.analyzed_at ? new Date(hrAgent.analyzed_at).toLocaleString() : '-'}
                </div>
              </div>
            </div>

            {/* Educational Qualifications */}
            <div className="mt-6 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow duration-200">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-graduation-cap text-indigo-500"></i>
                {t('educational_qualifications')}
              </label>
              <div className="text-neutral-900 dark:text-neutral-100 text-base leading-relaxed whitespace-pre-wrap bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 min-h-[120px] border-l-4 border-indigo-500">
                {hrAgent.educational_qualifications || '-'}
              </div>
            </div>

            {/* Job History */}
            <div className="mt-6 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow duration-200">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-briefcase text-teal-500"></i>
                {t('job_history')}
              </label>
              <div className="text-neutral-900 dark:text-neutral-100 text-base leading-relaxed whitespace-pre-wrap bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 min-h-[120px] border-l-4 border-teal-500">
                {hrAgent.job_history || '-'}
              </div>
            </div>

            {/* Skills */}
            <div className="mt-6 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow duration-200">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-tools text-red-500"></i>
                {t('skills')}
              </label>
              <div className="text-neutral-900 dark:text-neutral-100 text-base leading-relaxed whitespace-pre-wrap bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 min-h-[120px] border-l-4 border-red-500">
                {hrAgent.skills || '-'}
              </div>
            </div>

            {/* Justification */}
            <div className="mt-6 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow duration-200">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-lightbulb text-amber-500"></i>
                {t('justification')}
              </label>
              <div className="text-neutral-900 dark:text-neutral-100 text-base leading-relaxed whitespace-pre-wrap bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 min-h-[120px] border-l-4 border-amber-500">
                {hrAgent.justification || '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
