import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';

export default function Subscription() {
  const { t } = useTrans();
  const { subscription, plan, usages } = usePage().props;

  // Helper function to get plan color
  const getPlanColor = (planId) => {
    if (planId === 1 || planId === 5) return 'blue';
    if (planId === 2 || planId === 6) return 'green';
    if (planId === 3 || planId === 7) return 'purple';
    if (planId === 4 || planId === 8) return 'orange';
    return 'blue';
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        gradient: 'from-blue-500 to-blue-600',
        glow: 'shadow-blue-500/50',
        border: 'border-blue-500/20',
        text: 'text-blue-600',
        bg: 'bg-blue-500',
      },
      green: {
        gradient: 'from-green-500 to-emerald-600',
        glow: 'shadow-green-500/50',
        border: 'border-green-500/20',
        text: 'text-green-600',
        bg: 'bg-green-500',
      },
      purple: {
        gradient: 'from-purple-500 to-purple-600',
        glow: 'shadow-purple-500/50',
        border: 'border-purple-500/20',
        text: 'text-purple-600',
        bg: 'bg-purple-500',
      },
      orange: {
        gradient: 'from-orange-500 to-orange-600',
        glow: 'shadow-orange-500/50',
        border: 'border-orange-500/20',
        text: 'text-orange-600',
        bg: 'bg-orange-500',
      },
    };
    return colors[color] || colors.blue;
  };

  // Group features by agent key
  const groupFeaturesByAgent = (usages) => {
    const groups = {
      email_agent: {
        title: t('email_agent'),
        icon: 'fa-envelope',
        color: 'green',
        features: []
      },
      hr: {
        title: t('hr_agent'),
        icon: 'fa-users',
        color: 'blue',
        features: []
      },
      reports: {
        title: t('agent_reports'),
        icon: 'fa-file',
        color: 'purple',
        features: []
      },

    };

    usages.forEach(usage => {
      const key = usage.feature?.key;
      if (groups[key]) {
        groups[key].features.push(usage);
      }
    });

    return Object.values(groups).filter(group => group.features.length > 0);
  };

  const planColor = plan ? getPlanColor(plan.id) : 'blue';
  const colorClasses = getColorClasses(planColor);
  const featureGroups = subscription ? groupFeaturesByAgent(usages) : [];

  const getAgentColorClasses = (color) => getColorClasses(color);

  return (
    <AppLayout>
      <Head title={t('my_subscription')} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-neutral-50 to-stone-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {!subscription ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center max-w-md">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                  <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                    <i className="fa-solid fa-rocket text-white text-5xl"></i>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-4 text-neutral-800 dark:text-neutral-100">
                  {t('no_active_subscription')}
                </h3>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
                  {t('subscribe_to_plan_to_access_features')}
                </p>
                <Link href={route('home')+"#pricing"} className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <i className="fa-solid fa-star mr-2"></i>
                  {t('explore_plans')}
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Premium Plan Card */}
              <div className="mb-12">
                <div className={`relative overflow-hidden bg-gradient-to-br ${colorClasses.gradient} rounded-3xl shadow-2xl ${colorClasses.glow} border ${colorClasses.border}`}>
                  {/* Decorative Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                      backgroundSize: '40px 40px'
                    }}></div>
                  </div>

                  <div className="relative p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-floating">
                            <i className="fa-solid fa-crown text-white text-2xl"></i>
                          </div>
                          <div>
                            <div className="text-white/80 text-sm font-medium uppercase tracking-wider mb-1">
                              {t('current_plan')}
                            </div>
                            <h2 className="text-4xl font-bold text-white">
                              {plan?.name_value || plan?.name?.en || 'Plan'}
                            </h2>
                          </div>
                        </div>
                        <p className="text-white/90 text-lg max-w-2xl">
                          {plan?.description_value || plan?.description?.en}
                        </p>
                      </div>

                      <div className="flex flex-col md:items-end gap-4">
                        <div className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-semibold text-lg border border-white/30">
                          <i className="fa-solid fa-calendar-alt mr-2"></i>
                          {subscription.type === 'monthly' ? t('monthly') : t('yearly')}
                        </div>
                        <div className="text-5xl font-bold text-white">
                          SAR{plan?.price}
                          <span className="text-xl font-normal text-white/80">
                            /{subscription.type === 'monthly' ? t('month') : t('year')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Subscription Timeline */}
                    <div className="mt-8 pt-8 border-t border-white/20">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-floating">
                            <i className="fa-solid fa-play text-white"></i>
                          </div>
                          <div>
                            <div className="text-white/70 text-sm font-medium">{t('start_date')}</div>
                            <div className="text-white font-semibold text-lg">
                              {new Date(subscription.starts_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-floating">
                            <i className="fa-solid fa-flag-checkered text-white"></i>
                          </div>
                          <div>
                            <div className="text-white/70 text-sm font-medium">{t('end_date')}</div>
                            <div className="text-white font-semibold text-lg">
                              {new Date(subscription.ends_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-floating">
                            <i className="fa-solid fa-sync text-white"></i>
                          </div>
                          <div>
                            <div className="text-white/70 text-sm font-medium">
                              {subscription.type === 'yearly' ? t('next_reset') : t('status')}
                            </div>
                            <div className="text-white font-semibold text-lg capitalize">
                              {subscription.type === 'yearly' ?
                                (usages.length > 0 && usages.reset_date ?
                                  new Date(usages.reset_date).toLocaleDateString() :
                                  t('monthly')
                                ) :
                                t(subscription.status)
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Groups by Agent */}
              <div className="space-y-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center ">
                      <i className="fa-solid fa-chart-line text-white"></i>
                    </div>
                    {t('feature_usage')}
                  </h3>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                    {t('usage_overview')}
                  </div>
                </div>

                {featureGroups.map((group, groupIndex) => {
                  const agentColors = getAgentColorClasses(group.color);

                  return (
                    <div key={groupIndex} className="relative">
                      {/* Agent Header */}
                      <div className={`relative overflow-hidden bg-gradient-to-br ${agentColors.gradient} rounded-2xl shadow-xl ${agentColors.glow} mb-6 border ${agentColors.border}`}>
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '30px 30px'
                          }}></div>
                        </div>

                        <div className="relative px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-floating">
                              <i className={`fa-solid ${group.icon} text-white text-2xl`}></i>
                            </div>
                            <div>
                              <h4 className="text-2xl font-bold text-white">
                                {group.title}
                              </h4>
                              <p className="text-white/80 text-sm">
                                {t('agent_features_description')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Features Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {group.features.map((usage, index) => {
                          // Special handling for Max File Size (ID 6) - display as note
                          if (usage.feature?.id === 7) {
                            return (
                              <div
                                key={usage.id}
                                className="col-span-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <i className="fa-solid fa-info text-white text-sm"></i>
                                  </div>
                                  <div>
                                    <h6 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                      {usage.feature?.name_value || usage.feature?.name?.en}
                                    </h6>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                      {usage.feature?.description_value || usage.feature?.description?.en}
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex gap-1 items-center">
                                      <i className="fa-solid fa-file"></i>
                                      {usage.limit_value} MB
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          const percentage = usage.limit_value ? (usage.used_value / usage.limit_value) * 100 : 0;
                          const isNearLimit = percentage > 80;
                          const isOverLimit = percentage > 100;

                          return (
                            <div
                              key={usage.id}
                              className="group relative bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:scale-105"
                            >
                              {/* Top Accent Bar */}
                              <div className={`h-1.5 bg-gradient-to-r ${agentColors.gradient}`}></div>

                              <div className="p-6">
                                {/* Feature Header */}
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1">
                                    <h5 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                      {usage.feature?.name_value || usage.feature?.name?.en}
                                    </h5>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                      {usage.feature?.description_value || usage.feature?.description?.en}
                                    </p>
                                  </div>
                                </div>

                                {/* Usage Stats */}
                                <div className="space-y-4">
                                  {/* Progress Bar */}
                                  {usage.limit_value ? (
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between text-sm font-semibold">
                                        <span className="text-neutral-700 dark:text-neutral-300">
                                          {usage.used_value.toLocaleString()} {t('used')}
                                        </span>
                                        <span className="text-neutral-500 dark:text-neutral-400">
                                          {usage.limit_value.toLocaleString()} {t('limit')}
                                        </span>
                                      </div>

                                      <div className="relative h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                                        <div
                                          className={`absolute h-full rounded-full transition-all duration-700 ${
                                            isOverLimit ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                            isNearLimit ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                            `bg-gradient-to-r ${agentColors.gradient}`
                                          }`}
                                          style={{ width: `${Math.min(percentage, 100)}%` }}
                                        >
                                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-between">
                                        <span className={`text-sm font-bold ${
                                          isOverLimit ? 'text-red-600 dark:text-red-400' :
                                          isNearLimit ? 'text-yellow-600 dark:text-yellow-400' :
                                          'text-green-600 dark:text-green-400'
                                        }`}>
                                          {percentage.toFixed(1)}% {t('used')}
                                        </span>

                                        {isOverLimit && (
                                          <span className="text-xs text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                                            <i className="fa-solid fa-exclamation-triangle"></i>
                                            {t('limit_exceeded')}
                                          </span>
                                        )}

                                        {isNearLimit && !isOverLimit && (
                                          <span className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold flex items-center gap-1">
                                            <i className="fa-solid fa-exclamation-circle"></i>
                                            {t('near_limit')}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-between py-2">
                                      <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                        {usage.used_value.toLocaleString()} {t('used')}
                                      </span>
                                      <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold rounded-full">
                                        <i className="fa-solid fa-infinity mr-1"></i>
                                        {t('unlimited')}
                                      </span>
                                    </div>
                                  )}

                                  {/* Reset Date */}
                                  {usage.reset_date && (
                                    <div className="flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                      <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
                                        <i className="fa-solid fa-clock text-neutral-600 dark:text-neutral-400 text-sm"></i>
                                      </div>
                                      <div className="flex-1">
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                                          {t('resets_on')}
                                        </div>
                                        <div className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                                          {new Date(usage.reset_date).toLocaleDateString()}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
