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

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
