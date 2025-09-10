import React from 'react';
import { useTrans } from '@/Hooks/useTrans';
import PrimaryButton from '@/Components/PrimaryButton';

export default function FeaturesSection() {
  const { t } = useTrans();

  const features = [
    {
      icon: 'fa-envelope',
      title: t('email_management'),
      description: t('create_and_manage_multiple_wallets_with_different_currencies'),
      color: 'green'
    },
    {
      icon: 'fa-chart-bar',
      title: t('ai_reports'),
      description: t('track_your_daily_expenses_and_monitor_spending_patterns'),
      color: 'blue'
    },
    {
      icon: 'fa-users',
      title: t('hr_automation'),
      description: t('get_notified_about_important_financial_activities_and_budgets'),
      color: 'purple'
    },
    {
      icon: 'fa-shield-alt',
      title: t('secure_platform'),
      description: t('bank_level_security_with_encryption_and_secure_data_storage'),
      color: 'indigo'
    },
    {
      icon: 'fa-link',
      title: t('smart_integration'),
      description: t('access_your_finances_anywhere_with_responsive_mobile_design'),
      color: 'pink'
    },
    {
      icon: 'fa-brain',
      title: t('ai_powered'),
      description: t('generate_comprehensive_reports_and_analytics_for_better_insights'),
      color: 'yellow'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        border: 'border-green-200 dark:border-green-700',
        icon: 'text-green-600 dark:text-green-400',
        iconBg: 'bg-green-500',
        hover: 'hover:shadow-green-200/50 dark:hover:shadow-green-900/50'
      },
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        border: 'border-blue-200 dark:border-blue-700',
        icon: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-500',
        hover: 'hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50'
      },
      yellow: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        border: 'border-yellow-200 dark:border-yellow-700',
        icon: 'text-yellow-600 dark:text-yellow-400',
        iconBg: 'bg-yellow-500',
        hover: 'hover:shadow-yellow-200/50 dark:hover:shadow-yellow-900/50'
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        border: 'border-purple-200 dark:border-purple-700',
        icon: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-purple-500',
        hover: 'hover:shadow-purple-200/50 dark:hover:shadow-purple-900/50'
      },
      pink: {
        bg: 'bg-pink-100 dark:bg-pink-900/30',
        border: 'border-pink-200 dark:border-pink-700',
        icon: 'text-pink-600 dark:text-pink-400',
        iconBg: 'bg-pink-500',
        hover: 'hover:shadow-pink-200/50 dark:hover:shadow-pink-900/50'
      },
      indigo: {
        bg: 'bg-indigo-100 dark:bg-indigo-900/30',
        border: 'border-indigo-200 dark:border-indigo-700',
        icon: 'text-indigo-600 dark:text-indigo-400',
        iconBg: 'bg-indigo-500',
        hover: 'hover:shadow-indigo-200/50 dark:hover:shadow-indigo-900/50'
      }
    };
    return colors[color];
  };

  return (
    <section id="features" className="py-20 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            {t('powerful_features')}
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            {t('discover_comprehensive_financial_management_tools_designed_to_help_you_take_control_of_your_money')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const colorClasses = getColorClasses(feature.color);
            return (
              <div
                key={index}
                className={`group relative bg-white dark:bg-neutral-800 rounded-2xl border ${colorClasses.border} shadow-lg hover:shadow-xl ${colorClasses.hover} transition-all duration-300 overflow-hidden`}
              >
                {/* Background Pattern */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${colorClasses.bg} rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:opacity-70 transition-opacity`}></div>

                <div className="relative p-8">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${colorClasses.iconBg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`fa-solid ${feature.icon} text-2xl text-white`}></i>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {feature.description}
                  </p>

                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 px-4 sm:px-6 lg:px-8">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-2xl p-4 sm:px-8 sm:py-4 max-w-4xl w-full sm:w-auto">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-rocket text-white"></i>
            </div>
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm sm:text-base">
                {t('ready_to_get_started')}
              </h4>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1">
                {t('join_thousands_of_users_managing_their_finances')}
              </p>
            </div>
            <PrimaryButton
              as='a'
              href={route('register')}
              icon={'fa-arrow-right'}
              className='ltr:flex-row-reverse gap-2'
            >
              {t('start_free_trial')}
            </PrimaryButton>
          </div>
        </div>

      </div>
    </section>
  );
}
