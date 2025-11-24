import React from 'react';
import { Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { useTrans } from '@/Hooks/useTrans';
import Squares from '@/Components/Squares';

export default function HeroSection() {
  const { t } = useTrans();

  return (
    <div id="home" className="relative bg-gradient-to-br from-green-50 via-neutral-50 to-green-100 dark:from-green-900 dark:via-neutral-900 dark:to-green-800 overflow-hidden pt-20">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 w-full h-full">
        <Squares
          direction="diagonal"
          speed={0.5}
          borderColor="#22c55e30"  // Green border with 30% opacity
          squareSize={40}
          hoverFillColor="#22c55e15"  // Very light green fill on hover
          gradientCenterColor="#00000000"  // Transparent center
          gradientEdgeColor="#10b98130"  // Green-500 with 30% opacity at edges
        />
      </div>


      <div className="relative container mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 leading-tight rtl:md:text-right max-xs:text-center">
              {t('manage_your')}
              <span className="text-green-600 dark:text-green-400 block max-xs:text-center">
                {t('finances_smartly')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-2xl">
              {t('track_expenses_manage_wallets_and_grow_your_wealth_with_our_comprehensive_finance_management_platform')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <PrimaryButton
                as="a"
                href={route('register')}
                icon="fa-rocket"
                size="large"
                className="justify-center px-8 py-4 text-lg"
              >
                {t('get_started_free')}
              </PrimaryButton>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700">
              {/* <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">50K+</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">{t('active_users')}</div>
              </div> */}
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">1K+</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">{t('ai_tasks')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">24/7</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">{t('support')}</div>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative">
            <div className="relative bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl p-8 border border-neutral-200 dark:border-neutral-700">
              {/* Mock Dashboard */}
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <i className="fa-solid fa-brain text-green-500"></i>
                    AI {t('dashboard')}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                </div>

                {/* AI Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-xl border border-green-200 dark:border-green-700">
                    <div className="text-sm text-green-600 dark:text-green-400">{t('total_balance')}</div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">3 {t('agents')}</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                    <div className="text-sm text-blue-600 dark:text-blue-400">{t('monthly_income')}</div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">1,247</div>
                  </div>
                </div>

                {/* Chart Mockup */}
                <div className="bg-neutral-50 dark:bg-neutral-700 rounded-xl p-4 h-32 flex items-end justify-between gap-2">
                  {[40, 65, 30, 80, 45, 90, 60].map((height, index) => (
                    <div
                      key={index}
                      className="bg-green-500 rounded-t"
                      style={{ height: `${height}%`, width: '12%' }}
                    ></div>
                  ))}
                </div>

                {/* Recent AI Actions */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('recent_transactions')}</h4>
                  {[
                    { icon: 'fa-envelope', name: t('email_processed'), amount: `+23 ${t('emails')}`, color: 'green' },
                    { icon: 'fa-chart-line', name: t('report_generated'), amount: `+1 ${t('report')}`, color: 'blue' },
                    { icon: 'fa-users', name: t('cv_parsed'), amount: `+5 ${t('cvs')}`, color: 'purple' }
                  ].map((action, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-600 rounded-lg flex items-center justify-center">
                          <i className={`fa-solid ${action.icon} text-xs text-neutral-600 dark:text-neutral-300`}></i>
                        </div>
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">{action.name}</span>
                      </div>
                      <span className={`text-sm font-medium ${action.color === 'green' ? 'text-green-600 dark:text-green-400' :
                        action.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                          'text-purple-600 dark:text-purple-400'
                        }`}>
                        {action.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg">
              <i className="fa-solid fa-brain text-2xl"></i>
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
              <i className="fa-solid fa-robot"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
