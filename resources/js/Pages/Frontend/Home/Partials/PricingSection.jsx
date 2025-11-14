import React, { useState } from 'react';
import { useTrans } from '@/Hooks/useTrans';
import PrimaryButton from '@/Components/PrimaryButton';

export default function PricingSection({ plans = [] }) {
  const { t } = useTrans();
  const [isYearly, setIsYearly] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(true);

  // Simply filter by type - keep ALL plans including Trial
  const monthlyPlans = plans.filter(plan => plan.type === 'monthly');
  const yearlyPlans = plans.filter(plan => plan.type === 'yearly');
  const displayPlans = isYearly ? yearlyPlans : monthlyPlans;

  // Helper function to get plan color based on ID
  const getPlanColor = (plan) => {
    if (plan.id === 1 || plan.id === 5) return 'gray';   // Basic
    if (plan.id === 2 || plan.id === 6) return 'blue';   // Starter
    if (plan.id === 3 || plan.id === 7) return 'green';  // Pro
    if (plan.id === 4 || plan.id === 8) return 'purple'; // Business
    return 'blue';
  };

  // Helper function to check if plan is popular (Pro plans)
  const isPlanPopular = (plan) => {
    return plan.id === 3 || plan.id === 7; // Pro monthly and yearly
  };

  // Helper function to find matching yearly/monthly plan for savings calculation
  const findMatchingPlan = (currentPlan, targetPlans) => {
    const planIdMap = {
      2: 5, 3: 6, 4: 7, // monthly to yearly
      5: 2, 6: 3, 7: 4  // yearly to monthly
    };

    const matchingId = planIdMap[currentPlan.id];
    return targetPlans.find(plan => plan.id === matchingId);
  };

  // Calculate savings for yearly plans
  const calculateSavings = (yearlyPlan) => {
    const monthlyPlan = findMatchingPlan(yearlyPlan, monthlyPlans);
    if (!monthlyPlan) return 0;

    const monthlyTotal = parseFloat(monthlyPlan.price) * 12;
    const yearlyCost = parseFloat(yearlyPlan.price);
    return Math.max(0, monthlyTotal - yearlyCost);
  };

  const calculateAverageDiscount = (plans) => {
    const yearlyPlans = plans.filter(p => p.type === 'yearly');
    let percents = [];

    yearlyPlans.forEach(yearly => {
      const monthly = plans.find(
        m => m.type === 'monthly' && m.name.en === yearly.name.en.replace(' Yearly', '')
      );
      if (monthly) {
        const savings = (monthly.price * 12 - yearly.price);
        const percent = Math.round((savings / (monthly.price * 12)) * 100);
        percents.push(percent);
      }
    });

    return percents.length ? Math.max(...percents) : 0; // show biggest discount
  };
  const discount = calculateAverageDiscount(plans);

  // Organize features by sections with proper translation
  const organizeFeatures = (planFeatures) => {
    if (!planFeatures || !Array.isArray(planFeatures)) return {};

    const sections = {
      email_agent: {
        title: t('email_agent'),
        icon: 'fa-envelope',
        features: []
      },
      email_smart_answer: {
        title: t('email_smart_answer'),
        icon: 'fa-brain',
        features: []
      },
      reports: {
        title: t('agent_reports'),
        icon: 'fa-chart-line',
        features: []
      },
      hr: {
        title: t('hr_agent'),
        icon: 'fa-users',
        features: []
      }
    };

    planFeatures.forEach(feature => {
      // Only show active features
      if (!feature.pivot?.active) return;

      const featureKey = feature.key;
      if (sections[featureKey]) {
        // 🔥 USE MODEL ACCESSOR FOR TRANSLATION
        const featureName = feature.name_value || feature.name?.en || '';
        const limitValue = feature.pivot?.limit_value;

        // Format feature display based on type
        let displayName = featureName;
        if (feature.type === 'counter' && limitValue > 0) {
          displayName = `${featureName} (${limitValue})`;
        }

        sections[featureKey].features.push({
          name: displayName,
          type: feature.type,
          limit: limitValue,
          included: feature.type === 'boolean' ? limitValue === 1 : limitValue > 0
        });
      }
    });

    // Remove empty sections
    Object.keys(sections).forEach(key => {
      if (sections[key].features.length === 0) {
        delete sections[key];
      }
    });

    return sections;
  };

  // Get key features to show initially (first 5)
  const getKeyFeatures = (sections) => {
    const allFeatures = [];
    Object.values(sections).forEach(section => {
      section.features.forEach(feature => {
        allFeatures.push({
          ...feature,
          sectionTitle: section.title
        });
      });
    });
    return allFeatures.slice(0, 5);
  };

  const getColorClasses = (color) => {
    const colors = {
      gray: {
        border: 'border-gray-200 dark:border-gray-700',
        headerBg: 'bg-gray-50 dark:bg-gray-900/30',
        button: 'bg-gray-600 hover:bg-gray-700',
        text: 'text-gray-600 dark:text-gray-400',
        popular: 'border-gray-500'
      },
      blue: {
        border: 'border-blue-200 dark:border-blue-700',
        headerBg: 'bg-blue-50 dark:bg-blue-900/30',
        button: 'bg-blue-600 hover:bg-blue-700',
        text: 'text-blue-600 dark:text-blue-400',
        popular: 'border-blue-500'
      },
      green: {
        border: 'border-green-200 dark:border-green-700',
        headerBg: 'bg-green-50 dark:bg-green-900/30',
        button: 'bg-green-600 hover:bg-green-700',
        text: 'text-green-600 dark:text-green-400',
        popular: 'border-green-500'
      },
      purple: {
        border: 'border-purple-200 dark:border-purple-700',
        headerBg: 'bg-purple-50 dark:bg-purple-900/30',
        button: 'bg-purple-600 hover:bg-purple-700',
        text: 'text-purple-600 dark:text-purple-400',
        popular: 'border-purple-500'
      }
    };
    return colors[color] || colors.green;
  };

  // If no plans to display, show a message
  if (!displayPlans || displayPlans.length === 0) {
    return (
      <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-neutral-50 dark:bg-neutral-800">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            {t('simple_transparent_pricing')}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            {isYearly ? t('no_yearly_plans_available') : t('no_plans_available')}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-20 bg-neutral-50 dark:bg-neutral-800">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 sm:mb-6">
            {t('simple_transparent_pricing')}
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            {t('choose_the_plan_that_fits_your_needs_no_hidden_fees_cancel_anytime')}
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-2xl p-2 shadow-lg">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${!isYearly
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-green-600 dark:hover:text-green-400'
                }`}
            >
              {t('monthly')}
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 relative text-sm sm:text-base ${isYearly
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-green-600 dark:hover:text-green-400'
                }`}
            >
              {t('yearly')}
              {discount > 0 && (
                <span className="absolute -top-2 rtl:-left-2 ltr:-right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                  {t('save')} {discount}%
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-12 md:gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto ${displayPlans.length === 4 ? 'lg:grid-cols-4' :
            displayPlans.length === 3 ? 'lg:grid-cols-3' :
              'lg:grid-cols-3'
          }`}>
          {displayPlans.map((plan, index) => {
            const color = getPlanColor(plan);
            const isPopular = isPlanPopular(plan);
            const colorClasses = getColorClasses(color);
            const sections = organizeFeatures(plan.features);
            const keyFeatures = getKeyFeatures(sections);
            const savings = isYearly ? calculateSavings(plan) : 0;

            return (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-neutral-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${isPopular
                    ? `${colorClasses.popular} scale-105 order-first sm:order-none`
                    : `${colorClasses.border} hover:border-green-300 dark:hover:border-green-600`
                  }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="bg-green-500 text-white px-4 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg whitespace-nowrap">
                      <i className="fa-solid fa-star mr-1 sm:mr-2"></i>
                      {t('most_popular')}
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className={`${colorClasses.headerBg} rounded-t-2xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 ${isPopular ? 'pt-8 sm:pt-12' : ''}`}>
                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 truncate">
                    {plan.name_value || plan.name?.en || plan.name}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-4 text-sm sm:text-base line-clamp-2">
                    {plan.description_value || plan.description?.en || plan.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-end gap-1 sm:gap-2 mb-2">
                    <span className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                      SAR {plan.price}
                    </span>
                    <span className="text-neutral-600 dark:text-neutral-300 mb-1 text-sm sm:text-base">
                      /{isYearly ? t('year') : t('month')}
                    </span>
                  </div>

                  {/* Savings Display */}
                  {isYearly && savings > 0 && (
                    <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                      {t('save')} SAR {Math.round(savings)} {t('per_year')}
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-grow">
                  {showAllFeatures ? (
                    /* Show All Features by Section */
                    <div className="space-y-4 sm:space-y-6">
                      {Object.values(sections).map((section, sectionIndex) => (
                        <div key={sectionIndex}>
                          <h4 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-2 sm:mb-3 flex items-center gap-2">
                            <i className={`fa-solid ${section.icon} ${colorClasses.text}`}></i>
                            <span className="truncate">{section.title}</span>
                          </h4>
                          <ul className="space-y-2 sm:space-y-3">
                            {section.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start gap-2 sm:gap-3">
                                <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${feature.included
                                    ? 'bg-green-100 dark:bg-green-900/30'
                                    : 'bg-neutral-100 dark:bg-neutral-700'
                                  }`}>
                                  <i className={`fa-solid ${feature.included ? 'fa-check text-green-600 dark:text-green-400' : 'fa-times text-neutral-400'
                                    } text-xs`}></i>
                                </div>
                                <span className={`text-xs sm:text-sm leading-relaxed ${feature.included
                                    ? 'text-neutral-700 dark:text-neutral-300'
                                    : 'text-neutral-400 dark:text-neutral-500 line-through'
                                  }`}>
                                  {feature.name}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Show Key Features Only */
                    <ul className="space-y-2 sm:space-y-3">
                      {keyFeatures.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2 sm:gap-3">
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${feature.included
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : 'bg-neutral-100 dark:bg-neutral-700'
                            }`}>
                            <i className={`fa-solid ${feature.included ? 'fa-check text-green-600 dark:text-green-400' : 'fa-times text-neutral-400'
                              } text-xs`}></i>
                          </div>
                          <span className={`text-xs sm:text-sm leading-relaxed ${feature.included
                              ? 'text-neutral-700 dark:text-neutral-300'
                              : 'text-neutral-400 dark:text-neutral-500 line-through'
                            }`}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                      {Object.values(sections).reduce((total, section) => total + section.features.length, 0) > 5 && (
                        <li className="flex items-center gap-2 sm:gap-3 pt-2">
                          <span className={`text-xs sm:text-sm ${colorClasses.text} font-medium`}>
                            +{Object.values(sections).reduce((total, section) => total + section.features.length, 0) - 5} {t('more_features')}
                          </span>
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                {/* CTA Button */}
                <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
                  <PrimaryButton
                    as="a"
                    href={route('register')}
                    className={`w-full ${colorClasses.button} text-white py-3 sm:py-4 justify-center gap-2 ltr:flex-row-reverse text-sm sm:text-base`}
                    icon={isPopular ? 'fa-star' : 'fa-arrow-right'}
                  >
                    {isPopular ? t('get_started_now') : t('choose_plan')}
                  </PrimaryButton>
                </div>

              </div>
            );
          })}
        </div>

        {/* Show/Hide All Features Button */}
        {displayPlans.length > 0 && (
          <div className="text-center mt-8 sm:mt-12">
            <button
              onClick={() => setShowAllFeatures(!showAllFeatures)}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <i className={`fa-solid ${showAllFeatures ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              {showAllFeatures ? t('show_less_features') : t('show_all_features')}
            </button>
          </div>
        )}

        {/* Bottom Info */}
        {/* <div className="text-center mt-12 sm:mt-16">
          <div className="inline-flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-shield-alt text-green-500"></i>
              <span>{t('30_day_money_back_guarantee')}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-credit-card text-green-500"></i>
              <span>{t('no_setup_fees')}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-times-circle text-green-500"></i>
              <span>{t('cancel_anytime')}</span>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
