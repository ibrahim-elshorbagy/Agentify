import React, { useState, useRef, useEffect } from 'react';
import { useTrans } from '@/Hooks/useTrans';
import PrimaryButton from '@/Components/PrimaryButton';
import { SARIcon } from './Icons/Icons';

export default function PricingSection({ plans = [] }) {
  const floatingAnimation = `
    @keyframes float {
      0%, 100% {
        transform: translateY(10px);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.8;
      }
    }
    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  `;

  const { t } = useTrans();
  const [isYearly, setIsYearly] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(true);

  const monthlyPlans = plans.filter(plan => plan.type === 'monthly');
  const yearlyPlans = plans.filter(plan => plan.type === 'yearly');
  const displayPlans = isYearly ? yearlyPlans : monthlyPlans;

  const getPlanColor = (plan) => {
    if (plan.id === 1 || plan.id === 5) return 'green'; // Basic - Green
    if (plan.id === 2 || plan.id === 6) return 'green-black'; // Pro - Green + Black
    if (plan.id === 3 || plan.id === 7) return 'green-gold'; // Business - Green + Gold + Black
    return 'green';
  };

  const getPlanIcon = (plan) => {
    if (plan.id === 1 || plan.id === 5) return 'fa-user'; // Basic - Single person
    if (plan.id === 2 || plan.id === 6) return 'fa-chart-line'; // Pro - Multiple people
    if (plan.id === 3 || plan.id === 7) return 'fa-building'; // Business - Building
    return 'fa-star';
  };

  const isPlanPopular = (plan) => {
    return plan.id === 3 || plan.id === 7;
  };

  const findMatchingPlan = (currentPlan, targetPlans) => {
    const planIdMap = {
      2: 5, 3: 6, 4: 7,
      5: 2, 6: 3, 7: 4
    };
    const matchingId = planIdMap[currentPlan.id];
    return targetPlans.find(plan => plan.id === matchingId);
  };

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
    return percents.length ? Math.max(...percents) : 0;
  };
  const discount = calculateAverageDiscount(plans);

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
      if (!feature.pivot?.active) return;
      const featureKey = feature.key;
      if (sections[featureKey]) {
        const featureName = feature.name_value || feature.name?.en || '';
        const limitValue = feature.pivot?.limit_value;
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

    Object.keys(sections).forEach(key => {
      if (sections[key].features.length === 0) {
        delete sections[key];
      }
    });
    return sections;
  };

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
      green: {
        border: 'border-green-200 dark:border-green-700',
        headerBg: 'bg-green-50 dark:bg-green-900/30',
        button: 'bg-green-600 hover:bg-green-700',
        text: 'text-green-600 dark:text-green-400',
        popular: 'border-green-500'
      },
      'green-black': {
        border: 'border-green-200 dark:border-green-700',
        headerBg: 'bg-green-50 dark:bg-green-900/30',
        button: 'bg-green-600 hover:bg-green-700',
        text: 'text-green-600 dark:text-green-400',
        popular: 'border-green-500'
      },
      'green-gold': {
        border: 'border-green-200 dark:border-green-700',
        headerBg: 'bg-green-50 dark:bg-green-900/30',
        button: 'bg-green-600 hover:bg-green-700',
        text: 'text-green-600 dark:text-green-400',
        popular: 'border-green-500'
      }
    };
    return colors[color] || colors.green;
  };

  if (!displayPlans || displayPlans.length === 0) {
    return (
      <section id="pricing" className="py-12 sm:py-16 pb-10 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {t('plans')}
          </h2>
          <p className="text-white/70">
            {isYearly ? t('no_yearly_plans_available') : t('no_plans_available')}
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <style>{floatingAnimation}</style>
      <section id="pricing" className="py-12 sm:py-16 pb-10 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 animate-[pulse_3s_ease-in-out_infinite]">
              {t('plans')}
            </h2>
            <p className="text-base sm:text-lg text-white max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              {t('choose_the_plan_that_fits_your_needs_no_hidden_fees_cancel_anytime')}
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${!isYearly
                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
                  }`}
              >
                {t('monthly')}
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 relative text-sm sm:text-base ${isYearly
                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
                  }`}
              >
                {t('yearly')}
                {discount > 0 && (
                  <span className="absolute -top-2 rtl:-left-2 ltr:-right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap animate-[pulse_2s_ease-in-out_infinite]">
                    {t('save')} {discount}%
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-8 max-w-7xl mx-auto">
            {displayPlans.map((plan, index) => {
              const color = getPlanColor(plan);
              const isPopular = isPlanPopular(plan);
              const sections = organizeFeatures(plan.features);
              const keyFeatures = getKeyFeatures(sections);
              const savings = isYearly ? calculateSavings(plan) : 0;

              const gradientColors = {
                1: 'from-green-400 via-green-500 to-green-600', // Basic - Pure green
                5: 'from-green-400 via-green-500 to-green-600', // Basic Yearly
                2: 'from-green-500 via-green-700 to-gray-900', // Pro - Green + Black
                6: 'from-green-500 via-green-700 to-gray-900', // Pro Yearly
                3: 'from-green-500 via-yellow-500 to-gray-900', // Business - Green + Gold + Black
                7: 'from-green-500 via-yellow-500 to-gray-900', // Business Yearly
              };

              const gradient = gradientColors[plan.id] || 'from-green-400 via-green-500 to-green-600';
              const planIcon = getPlanIcon(plan);

              return (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  color={color}
                  isPopular={isPopular}
                  sections={sections}
                  keyFeatures={keyFeatures}
                  savings={savings}
                  gradient={gradient}
                  planIcon={planIcon}
                  isYearly={isYearly}
                  showAllFeatures={showAllFeatures}
                  t={t}
                />
              );
            })}
          </div>

          {/* Show/Hide All Features Button */}
          {/* {displayPlans.length > 0 && (
            <div className="text-center mt-8 sm:mt-12">
              <button
                onClick={() => setShowAllFeatures(!showAllFeatures)}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
              >
                <i className={`fa-solid ${showAllFeatures ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                {showAllFeatures ? t('show_less_features') : t('show_all_features')}
              </button>
            </div>
          )} */}
        </div>
      </section>
    </>
  );
}

// Separate component for pricing card with mouse tracking
function PricingCard({ plan, color, isPopular, sections, keyFeatures, savings, gradient, planIcon, isYearly, showAllFeatures, t }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  // Get radial gradient color based on plan
  const getRadialColor = () => {
    if (plan.id === 1 || plan.id === 5) return 'rgba(34, 197, 94, 0.4)'; // Green for Basic
    if (plan.id === 2 || plan.id === 6) return 'rgba(34, 197, 94, 0.3)'; // Green for Pro
    if (plan.id === 3 || plan.id === 7) return 'rgba(234, 179, 8, 0.3)'; // Gold tint for Business
    return 'rgba(34, 197, 94, 0.4)';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group relative w-80 h-[700px] flex justify-center items-center my-10 mx-8 transition-all duration-500"
      style={{
        '--mouse-x': '0px',
        '--mouse-y': '0px'
      }}
    >
      {/* Background - Static (no more moving boxes) */}
      <div className={`absolute top-0 left-12 w-1/2 h-full bg-gradient-to-br ${gradient} rounded-lg transform skew-x-12 transition-all duration-500 group-hover:skew-x-0 group-hover:left-5 group-hover:w-[calc(100%-5.625rem)] group-hover:animate-[pulse_3s_ease-in-out_infinite]`}></div>

      {/* Blurred Background */}
      <div className={`absolute top-0 left-12 w-1/2 h-full bg-gradient-to-br ${gradient} rounded-lg transform skew-x-12 transition-all duration-500 blur-[30px] group-hover:skew-x-0 group-hover:left-5 group-hover:w-[calc(100%-5.625rem)]`}></div>

      {/* Plan Icon at top center */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg animate-[pulse_3s_ease-in-out_infinite]`}>
          <i className={`fa-solid ${planIcon} text-white text-2xl`}></i>
        </div>
      </div>

      {/* Most Popular Badge */}
      {/* {isPopular && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 mt-12">
          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg whitespace-nowrap animate-[pulse_2s_ease-in-out_infinite]">
            <i className="fa-solid fa-star mr-2"></i>
            {t('most_popular')}
          </div>
        </div>
      )} */}

      {/* Content Card with Mouse-Following Border Glow */}
      <div
        className="relative left-0 px-10 py-8 bg-white/5 backdrop-blur-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.1)] rounded-lg z-[1] transition-all duration-500 text-white group-hover:-left-6 group-hover:px-10 group-hover:py-12 h-full flex flex-col overflow-hidden"
        style={{
          border: '2px solid transparent',
          background: `
      radial-gradient(circle 150px at var(--mouse-x) var(--mouse-y), ${getRadialColor()}, transparent 100%) border-box,
      linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)) padding-box
    `,
          backgroundClip: 'border-box, padding-box',
          WebkitBackgroundClip: 'border-box, padding-box'
        }}
      >
        {/* Radial glow effect that follows mouse */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg"
          style={{
            background: `radial-gradient(circle 200px at var(--mouse-x) var(--mouse-y), ${getRadialColor()}, transparent 70%)`,
            mixBlendMode: 'screen'
          }}
        ></div>

        {/* Plan Header */}
        <div className="mb-6 flex-shrink-0 relative z-10">
          <h3 className="text-2xl font-bold text-white mb-2 truncate">
            {plan.name_value || plan.name?.en || plan.name}
          </h3>
          <p className="text-white/80 mb-4 text-sm line-clamp-2">
            {plan.description_value || plan.description?.en || plan.description}
          </p>

          {/* Price */}
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-white flex gap-2 items-center" dir='ltr'>
              <SARIcon /> {plan.price}
            </span>
            <span className="text-white/70 mb-1 text-sm">
              /{isYearly ? t('year') : t('month')}
            </span>
          </div>

          {/* Savings Display */}
          {isYearly && savings > 0 && (
            <p className="text-sm text-green-300 flex gap-1 items-center" >
              {t('save')}  <span dir="ltr" className='inline-flex gap-2 items-center'><SARIcon /> {Math.round(savings)}</span> {t('per_year')}
            </p>
          )}
        </div>

        {/* Features - Scrollable */}
        <div className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar min-h-0 relative z-10">
          {showAllFeatures ? (
            <div className="space-y-4">
              {Object.values(sections).map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <i className={`fa-solid ${section.icon} text-white/80`}></i>
                    <span className="truncate">{section.title}</span>
                  </h4>
                  <ul className="space-y-2">
                    {section.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${feature.included ? 'bg-green-500/20' : 'bg-white/10'}`}>
                          <i className={`fa-solid ${feature.included ? 'fa-check text-green-400' : 'fa-times text-white/40'} text-xs`}></i>
                        </div>
                        <span className={`leading-relaxed ${feature.included ? 'text-white/90' : 'text-white/40 line-through'}`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-2">
              {keyFeatures.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-2 text-sm">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${feature.included ? 'bg-green-500/20' : 'bg-white/10'}`}>
                    <i className={`fa-solid ${feature.included ? 'fa-check text-green-400' : 'fa-times text-white/40'} text-xs`}></i>
                  </div>
                  <span className={`leading-relaxed ${feature.included ? 'text-white/90' : 'text-white/40 line-through'}`}>
                    {feature.name}
                  </span>
                </li>
              ))}
              {Object.values(sections).reduce((total, section) => total + section.features.length, 0) > 5 && (
                <li className="flex items-center gap-2 pt-2">
                  <span className="text-sm text-white/70 font-medium">
                    +{Object.values(sections).reduce((total, section) => total + section.features.length, 0) - 5} {t('more_features')}
                  </span>
                </li>
              )}
            </ul>
          )}
        </div>

        {/* CTA Button */}
        <a
          href={route('register')}
          className="inline-block text-center text-neutral-900 bg-white px-4 py-2.5 rounded font-bold transition-all duration-300 hover:bg-green-300 hover:border hover:border-pink-400/40 hover:shadow-[0_1px_15px_rgba(1,1,1,0.2)] hover:scale-105 flex-shrink-0 relative z-10"
        >
          {isPopular ? t('get_started_now') : t('choose_plan')}
        </a>
      </div>
    </div>
  );
}
