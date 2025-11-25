import React from 'react';
import { useTrans } from '@/Hooks/useTrans';
import PrimaryButton from '@/Components/PrimaryButton';

export default function AboutSection() {
  const { t } = useTrans();

  const coreFeatures = [
    {
      icon: 'fa-envelope',
      title: t('email_ai_automation'),
      description: t('smart_email_management_with_secure_connections_auto_replies_and_intelligent_sorting'),
      color: 'blue',
      capabilities: [
        t('secure_gmail_outlook_connection'),
        t('intelligent_email_sorting'),
        t('smart_email_assistant'),
        t('email_action_automation'),
      ]
    },
    {
      icon: 'fa-chart-bar',
      title: t('data_intelligence_reports'),
      description: t('transform_your_data_into_actionable_insights_with_ai_powered_analysis'),
      color: 'green',
      capabilities: [
        t('file_upload_analysis'),
        t('data_chat_interface'),
        t('ai_report_generation'),
      ]
    },
    {
      icon: 'fa-users',
      title: t('hr_automation_tools'),
      description: t('streamline_recruitment_with_cv_parsing_candidate_ranking_and_automated_workflows'),
      color: 'purple',
      capabilities: [
        t('cv_auto_collection'),
        t('cv_auto_collection_email'),
        t('smart_cv_parsing'),
        t('candidate_ranking'),
      ]
    }
  ];

  const platformBenefits = [
    {
      icon: 'fa-robot',
      title: t('ai_powered_automation'),
      description: t('leverage_advanced_ai_to_handle_repetitive_tasks_automatically'),
      color: 'green'
    },
    {
      icon: 'fa-shield-alt',
      title: t('bank_level_security'),
      description: t('your_data_is_protected_with_enterprise_grade_security_measures'),
      color: 'blue'
    },
    {
      icon: 'fa-clock',
      title: t('time_saving_efficiency'),
      description: t('reduce_manual_work_and_focus_on_what_matters_most_to_your_business'),
      color: 'yellow'
    },
    {
      icon: 'fa-cogs',
      title: t('seamless_integration'),
      description: t('works_with_your_existing_tools_like_gmail_outlook_and_google_sheets'),
      color: 'purple'
    }
  ];

  const stats = [
    {
      icon: 'fa-envelope',
      number: 'Based on Plan',
      label: t('emails_processed'),
      description: t('unlimited_email_automation'),
      color: 'blue'
    },
    {
      icon: 'fa-file-alt',
      number: 'Based on Plan',
      label: t('reports_generated'),
      description: t('ai_powered_insights'),
      color: 'green'
    },
    {
      icon: 'fa-user-tie',
      number: 'Based on Plan',
      label: t('cvs_analyzed'),
      description: t('smart_recruitment_tools'),
      color: 'purple'
    },
    {
      icon: 'fa-shield-alt',
      number: '100%',
      label: t('secure_connections'),
      description: t('bank_level_protection'),
      color: 'orange'
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
      orange: {
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        border: 'border-orange-200 dark:border-orange-700',
        icon: 'text-orange-600 dark:text-orange-400',
        iconBg: 'bg-orange-500',
        hover: 'hover:shadow-orange-200/50 dark:hover:shadow-orange-900/50'
      }
    };
    return colors[color] || colors.green;
  };

  return (
    <>
      {/* About Us Main Section */}
      <section id="about" className="py-20 overflow-hidden">


        <div className="relative container mx-auto px-3 md:px-6">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-full px-6 py-3 mb-8">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-brain text-white text-sm"></i>
              </div>
              <span className="text-green-700 dark:text-green-300 font-semibold">{t('about_agentify')}</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-8 leading-tight">
              {t('intelligent_ai_tools')}
              <span className="text-green-600 dark:text-green-400 block">
                {t('for_modern_workflows')}
              </span>
            </h2>

            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-4xl mx-auto leading-relaxed">
              {t('agentify_provides_powerful_ai_agents_that_automate_your_email_management_data_analysis_and_hr_processes_our_platform_connects_seamlessly_with_your_existing_tools_to_boost_productivity_and_eliminate_repetitive_tasks')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Platform Overview */}
            <div>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                {t('what_makes_agentify_different')}
              </h3>

              <div className="space-y-6 text-neutral-600 dark:text-neutral-300">
                <p className="text-lg leading-relaxed">
                  {t('agentify_specializes_in_three_core_areas_email_automation_data_intelligence_and_hr_optimization_each_ai_agent_is_designed_to_understand_context_learn_from_your_patterns_and_deliver_results_that_match_your_specific_needs')}
                </p>

                <p className="text-lg leading-relaxed">
                  {t('our_platform_integrates_with_gmail_outlook_google_sheets_and_supports_file_uploads_making_it_easy_to_connect_your_existing_workflow_without_disruption_security_is_built_in_with_bank_level_encryption_protecting_your_sensitive_information')}
                </p>

                <div className="flex items-start gap-4 bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-700">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-lightbulb text-white"></i>
                  </div>
                  <div>
                    <p className="text-green-800 dark:text-green-200 font-medium text-lg">
                      {t('focus_on_what_matters_while_ai_handles_the_rest')}
                    </p>
                    <p className="text-green-600 dark:text-green-400 text-sm mt-2">
                      {t('let_intelligent_automation_free_up_your_time_for_strategic_work')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <PrimaryButton
                  as="a"
                  href="#features-detailed"
                  icon="fa-arrow-right"
                  size="large"
                  className="justify-center ltr:flex-row-reverse px-8 py-4"
                >
                  {t('explore_features')}
                </PrimaryButton>
              </div>
            </div>

            {/* Platform Stats Dashboard */}
            <div className="relative">
              <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl p-8 border border-neutral-200 dark:border-neutral-700">
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h4 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                      {t('platform_capabilities')}
                    </h4>
                    <p className="text-neutral-600 dark:text-neutral-300">
                      {t('unlimited_ai_powered_automation')}
                    </p>
                  </div>

                  {/* Capability Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => {
                      const colorClasses = getColorClasses(stat.color);
                      return (
                        <div key={index} className={`${colorClasses.bg} ${colorClasses.border} border rounded-xl p-4 text-center`}>
                          <div className={`w-10 h-10 ${colorClasses.iconBg} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                            <i className={`fa-solid ${stat.icon} text-white text-sm`}></i>
                          </div>
                          {/* <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                            {stat.number}
                          </div> */}
                          <div className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                            {stat.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Active Features Preview */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{t('active_ai_agents')}</h4>
                    {[
                      { icon: 'fa-envelope', name: t('email_agent'), status: t('processing_emails'), color: 'blue' },
                      { icon: 'fa-chart-bar', name: t('reports_agent'), status: t('analyzing_data'), color: 'green' },
                      { icon: 'fa-users', name: t('hr_agent'), status: t('parsing_cvs'), color: 'purple' }
                    ].map((agent, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-600 rounded-lg flex items-center justify-center">
                            <i className={`fa-solid ${agent.icon} text-xs ${agent.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                                agent.color === 'green' ? 'text-green-600 dark:text-green-400' :
                                  'text-purple-600 dark:text-purple-400'
                              }`}></i>
                          </div>
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">{agent.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${agent.color === 'blue' ? 'bg-blue-500' :
                              agent.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                            } animate-pulse`}></div>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">{agent.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating AI Elements */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-12">
                <i className="fa-solid fa-brain text-2xl"></i>
              </div>
              <div className="absolute -bottom-6 -left-6 w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl -rotate-12">
                <i className="fa-solid fa-robot text-xl"></i>
              </div>
            </div>
          </div>

          {/* Platform Benefits */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformBenefits.map((benefit, index) => {
              const colorClasses = getColorClasses(benefit.color);
              return (
                <div
                  key={index}
                  className={`group bg-white dark:bg-neutral-800 rounded-2xl border-2 ${colorClasses.border} shadow-lg hover:shadow-2xl ${colorClasses.hover} transition-all duration-300 overflow-hidden`}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 ${colorClasses.bg} rounded-full -translate-y-12 translate-x-12 opacity-50 group-hover:opacity-70 transition-opacity`}></div>

                  <div className="relative p-6">
                    <div className={`w-14 h-14 ${colorClasses.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <i className={`fa-solid ${benefit.icon} text-xl text-white`}></i>
                    </div>

                    <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {benefit.title}
                    </h4>

                    <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Deep Dive Section */}
      <section id="features-detailed" className="py-20">
        <div className="container mx-auto px-3 md:px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-full px-6 py-3 mb-8">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-cogs text-white text-sm"></i>
              </div>
              <span className="text-green-700 dark:text-green-300 font-semibold">{t('ai_agents_in_detail')}</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              {t('three_powerful_ai_agents')}
              <span className="text-green-600 dark:text-green-400 block">
                {t('designed_for_your_workflow')}
              </span>
            </h2>

            <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              {t('each_ai_agent_specializes_in_specific_tasks_working_together_to_create_a_comprehensive_automation_solution_for_your_business_needs')}
            </p>
          </div>

          {/* Core Features */}
          <div className="space-y-16">
            {coreFeatures.map((feature, index) => {
              const colorClasses = getColorClasses(feature.color);
              const isReversed = index % 2 !== 0;

              return (
                <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${isReversed ? 'lg:grid-flow-col-dense' : ''}`}>
                  {/* Feature Content */}
                  <div className={isReversed ? 'lg:col-start-2 ' : ''}>
                    <div className={`inline-flex items-center gap-3 ${colorClasses.bg} ${colorClasses.border} border rounded-full px-4 py-2 mb-6 `}>
                      <div className={`w-6 h-6 ${colorClasses.iconBg} rounded-full flex items-center justify-center`}>
                        <i className={`fa-solid ${feature.icon} text-white text-xs`}></i>
                      </div>
                      <span className={`text-sm font-semibold ${colorClasses.icon}`}>{t('ai_agent')}</span>
                    </div>

                    <h3 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                      {feature.title}
                    </h3>

                    <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Capabilities List */}
                    <div className="space-y-3 mb-8">
                      {feature.capabilities.map((capability, capIndex) => (
                        <div key={capIndex} className="flex items-center gap-3">
                          <div className={`w-5 h-5 ${colorClasses.iconBg} rounded-full flex items-center justify-center`}>
                            <i className="fa-solid fa-check text-white text-xs"></i>
                          </div>
                          <span className="text-neutral-700 dark:text-neutral-300">{capability}</span>
                        </div>
                      ))}
                    </div>

                    <PrimaryButton
                      as="a"
                      href={route('register')}
                      icon="fa-rocket"
                      className={`${colorClasses.iconBg.replace('bg-', 'bg-')} hover:${colorClasses.iconBg.replace('bg-', 'bg-').replace('500', '600')} text-white justify-center px-6 py-3`}
                    >
                      {t('start_using_this_agent')}
                    </PrimaryButton>
                  </div>

                  {/* Feature Visualization */}
                  <div className={isReversed ? 'lg:col-start-1' : ''}>
                    <div className={`bg-gradient-to-br   ${colorClasses.bg} rounded-3xl p-4 md:p-8 border-2 ${colorClasses.border}`}>
                      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg">
                        {/* Agent Status */}
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="md:text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 ">
                            <i className={`fa-solid ${feature.icon} ${colorClasses.icon}`}></i>
                            {feature.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 ${colorClasses.iconBg} rounded-full animate-pulse`}></div>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">{t('active')}</span>
                          </div>
                        </div>

                        {/* Mock Interface */}
                        <div className="space-y-4">
                          {feature.capabilities.slice(0, 3).map((capability, capIndex) => (
                            <div key={capIndex} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                              <span className="text-sm text-neutral-700 dark:text-neutral-300">{capability}</span>
                              <div className={`w-2 h-2 ${colorClasses.iconBg} rounded-full`}></div>
                            </div>
                          ))}
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-6">
                          <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                            <span>{t('processing')}</span>
                            <span>100%</span>
                          </div>
                          <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2">
                            <div className={`h-2 rounded-full ${colorClasses.iconBg} w-full`}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Bottom CTA */}
          <div className="text-center mt-16 px-4 sm:px-6 lg:px-8">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-2xl p-4 sm:px-8 sm:py-6 max-w-4xl w-full sm:w-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-magic text-white text-lg sm:text-2xl"></i>
              </div>
              <div className="text-center sm:text-left flex-1 min-w-0">
                <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-base sm:text-xl mb-1">
                  {t('ready_to_automate_your_workflow')}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1">
                  {t('start_using_agentify_ai_agents_today_and_transform_how_you_work')}
                </p>
              </div>
              <PrimaryButton
                as="a"
                href={route('register')}
                icon="fa-arrow-right"
                size="large"
                className="ltr:flex-row-reverse gap-2"
              >
                {t('get_started_now')}
              </PrimaryButton>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
