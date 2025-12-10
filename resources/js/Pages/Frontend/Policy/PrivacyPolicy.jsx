import React from 'react';
import { Head } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout/SiteLayout';
import { useTrans } from '@/Hooks/useTrans';

export default function PrivacyPolicy() {
  const { t } = useTrans();

  return (
    <SiteLayout>
      <Head title={t('privacy_policy_title')} />

      <div className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-3 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-8">
              {t('privacy_policy_title')}
            </h1>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-white/90 mb-8 leading-relaxed">
                  {t('privacy_policy_intro')}
                </p>

                <h2 className="text-2xl font-bold text-white mb-4">
                  {t('privacy_policy_section_1_title')}
                </h2>
                <p className="text-white/80 mb-6 leading-relaxed">
                  {t('privacy_policy_section_1_content')}
                </p>

                <h2 className="text-2xl font-bold text-white mb-4">
                  {t('privacy_policy_section_2_title')}
                </h2>
                <p className="text-white/80 mb-6 leading-relaxed">
                  {t('privacy_policy_section_2_content')}
                </p>

                <h2 className="text-2xl font-bold text-white mb-4">
                  {t('privacy_policy_section_3_title')}
                </h2>
                <p className="text-white/80 mb-6 leading-relaxed">
                  {t('privacy_policy_section_3_content')}
                </p>

                <h2 className="text-2xl font-bold text-white mb-4">
                  {t('privacy_policy_section_4_title')}
                </h2>
                <p className="text-white/80 mb-6 leading-relaxed">
                  {t('privacy_policy_section_4_content')}
                </p>

                <h2 className="text-2xl font-bold text-white mb-4">
                  {t('privacy_policy_section_5_title')}
                </h2>
                <p className="text-white/80 mb-6 leading-relaxed">
                  {t('privacy_policy_section_5_content')}
                </p>

                <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-white/90 text-center">
                    {t('privacy_policy_contact')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

