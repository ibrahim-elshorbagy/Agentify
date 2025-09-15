import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { useTrans } from '@/Hooks/useTrans';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import CheckboxInput from '@/Components/CheckboxInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function EditPlan({ plan, features }) {
  const { t } = useTrans();
  const { data, setData, put, errors, processing } = useForm({
    price: plan.price || '',
    features: plan.features?.map((f) => ({
      id: f.id,
      limit_value: f.pivot?.limit_value ?? (f.type === 'boolean' ? 0 : ''),
      active: f.pivot?.active ?? true,
    })) || [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route('admin.plans.update', plan.id), { preserveScroll: true });
  };

  // Function to update individual feature
  const updateFeature = (id, field, value, featureType) => {
    setData(prevData => {
      let processedValue = value;
      if (featureType === 'boolean' && field === 'limit_value') {
        processedValue = value ? 1 : 0;
      }

      const featureExists = prevData.features.some(f => f.id === id);
      if (featureExists) {
        return {
          ...prevData,
          features: prevData.features.map(f =>
            f.id === id ? { ...f, [field]: processedValue } : f
          ),
        };
      } else {
        const newFeature = {
          id,
          limit_value: featureType === 'boolean' ? 0 : '',
          active: true
        };
        newFeature[field] = processedValue;
        return {
          ...prevData,
          features: [...prevData.features, newFeature],
        };
      }
    });
  };

  // Function to toggle all features in a section
  const toggleSectionFeatures = (sectionKey, isActive) => {
    setData(prevData => {
      const sectionFeatures = allFeatures.filter(f => f.key.startsWith(sectionKey));

      // Update existing features or add new ones
      let updatedFeatures = [...prevData.features];

      sectionFeatures.forEach(feature => {
        const existingIndex = updatedFeatures.findIndex(f => f.id === feature.id);

        if (existingIndex >= 0) {
          // Update existing feature
          updatedFeatures[existingIndex] = {
            ...updatedFeatures[existingIndex],
            active: isActive
          };
        } else {
          // Add new feature
          updatedFeatures.push({
            id: feature.id,
            limit_value: feature.type === 'boolean' ? 0 : '',
            active: isActive
          });
        }
      });

      return {
        ...prevData,
        features: updatedFeatures
      };
    });
  };

  const allFeatures = features.map((feature) => {
    const planFeature = plan.features.find(f => f.id === feature.id);
    return {
      ...feature,
      limit_value: planFeature?.pivot?.limit_value ?? (feature.type === 'boolean' ? 0 : null),
      active: planFeature?.pivot?.active ?? false,
    };
  });

  const sections = {
    email_agent: {
      title: "📧 Email Agent",
      key: "email_agent",
      features: allFeatures.filter(f => f.key.startsWith("email_agent")),
    },
    email_smart_answer: {
      title: "🤖 Email Smart Answer",
      key: "email_smart_answer",
      features: allFeatures.filter(f => f.key.startsWith("email_smart_answer")),
    },
    reports: {
      title: "📊 Reports Agent",
      key: "reports",
      features: allFeatures.filter(f => f.key.startsWith("reports")),
    },
    hr: {
      title: "👨‍💼 HR Agent",
      key: "hr",
      features: allFeatures.filter(f => f.key.startsWith("hr")),
    },
  };

  // Helper function to check if all features in a section are active
  const isSectionActive = (sectionKey) => {
    const sectionFeatures = allFeatures.filter(f => f.key.startsWith(sectionKey));
    return sectionFeatures.every(feature => {
      const current = data.features.find(f => f.id === feature.id);
      return current?.active ?? feature.active;
    });
  };

  return (
    <AppLayout>
      <Head title={`${t('edit_plan')} - ${plan.name_value}`} />
      <div className="m-3 xl:m-5">
        <div className="overflow-hidden rounded-2xl shadow-lg dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700">
          <div className="p-6 text-neutral-900 dark:text-neutral-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Link
                  href={route('admin.plans.index')}
                  className="flex items-center text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
                >
                  <i className="fa-solid fa-arrow-left rtl:rotate-180 mx-2"></i>
                  {t('plans')}
                </Link>
                <span className="text-neutral-400 dark:text-neutral-600">/</span>
                <h1 className="text-2xl font-bold leading-tight text-neutral-900 dark:text-neutral-100">
                  <i className="fa-solid fa-edit text-green-500 mx-2"></i>
                  {t('edit_plan')} - {plan.name_value}
                </h1>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <InputLabel htmlFor="price" value={t('plan_price')} />
                  <TextInput
                    id="price"
                    type="number"
                    name="price"
                    value={data.price}
                    className="mt-1 block w-1/2"
                    onChange={(e) => setData('price', e.target.value)}
                    step="0.01"
                    min="0"
                    required
                  />
                  <InputError message={errors.price} className="mt-2" />
                </div>
              </div>

              {/* Features Sections */}
              <div className="mt-8 space-y-10">
                {Object.values(sections).map(section => (
                  section.features.length > 0 && (
                    <div key={section.title}>
                      {/* Section Header with Toggle */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center">
                          {section.title}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {isSectionActive(section.key) ? t('active') : t('inactive')}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={isSectionActive(section.key)}
                              onChange={(e) => toggleSectionFeatures(section.key, e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg">
                          <thead className="bg-neutral-100 dark:bg-neutral-800">
                            <tr>
                              <th className="px-4 w-1/2 py-2 rtl:text-right ltr:text-left">{t('feature')}</th>
                              <th className="px-4 w-1/2 py-2 rtl:text-right ltr:text-left">{t('limit_value')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {section.features.map((feature, featureIndex) => {
                              const current = data.features.find(f => f.id === feature.id);
                              const currentIndex = data.features.findIndex(f => f.id === feature.id);
                              const isActive = current?.active ?? feature.active;
                              const isSectionEnabled = isSectionActive(section.key);

                              return (
                                <tr
                                  key={feature.id}
                                  className={`border-t border-neutral-200 dark:border-neutral-700 ${!isSectionEnabled ? 'opacity-50' : ''
                                    }`}
                                >
                                  <td className="px-4 py-2 font-medium relative group cursor-help">
                                    <div className="flex items-center gap-2">
                                      <span>{feature.name_value}</span>
                                    </div>
                                    <div className="absolute z-10 hidden group-hover:block bg-green-500 text-white text-xs rounded px-2 py-1 w-90 top-1 ltr:right-0 rtl:left-0">
                                      {feature.description_value}
                                    </div>
                                  </td>

                                  {/* Limit Value Column */}
                                  <td className="px-4 py-2">
                                    {feature.type === 'boolean' ? (
                                      <div className="flex items-center gap-2">
                                        {/* <CheckboxInput
                                          checked={current?.limit_value == 1}
                                          onChange={(e) => updateFeature(feature.id, 'limit_value', e.target.checked, 'boolean')}
                                          disabled={!isSectionEnabled}
                                        />
                                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                          {current?.limit_value == 1 ? t('enabled') : t('disabled')}
                                        </span> */}
                                      </div>
                                    ) : (
                                      <TextInput
                                        type="number"
                                        value={current?.limit_value ?? ''}
                                        onChange={(e) => updateFeature(feature.id, 'limit_value', e.target.value, 'counter')}
                                        className="w-24"
                                        min="0"
                                        disabled={!isSectionEnabled}
                                        placeholder={isSectionEnabled ? "0" : "Disabled"}
                                      />
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                <SecondaryButton icon={'fa-times'} as={Link} href={route('admin.plans.index')}>
                  {t('cancel')}
                </SecondaryButton>
                <PrimaryButton icon={"fa-save"} type="submit" disabled={processing}>
                  {processing ? t('updating') : t('save_changes')}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
