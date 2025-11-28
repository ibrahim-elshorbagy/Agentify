import React from 'react';
import { useTrans } from '@/Hooks/useTrans';

export default function AboutSection() {
  const { t } = useTrans();

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-3 md:px-6">

        {/* Header - Site Name and Description */}
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

          <div className="relative text-center mb-16 border-2 border-white/30 hover:border-white/50 rounded-3xl p-8 md:p-12 backdrop-blur-sm bg-white/5 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20">
            <h1 className="text-4xl pb-4 md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent mb-6 animate-gradient">
              Agentify
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed font-light mb-4">
              {t('agentify_main_description')}
            </p>
            <p className="text-base md:text-lg lg:text-xl text-white/80 max-w-4xl mx-auto font-light">
              {t('agentify_goal_description')}
            </p>
          </div>
        </div>

        {/* Three Columns - AI Agents */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">

          {/* Email Agent */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />

            <div className="relative text-center border-2 border-white/30 hover:border-green-400/50 rounded-3xl p-6 lg:p-8 backdrop-blur-sm bg-white/5 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 hover:scale-105 h-full">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                {t('email_agent_title')}
              </h3>
              <div className="text-white/90 space-y-2 text-sm md:text-base leading-relaxed">
                <p>{t('email_agent_classification')}</p>
                <p>{t('email_agent_suggestions')}</p>
                <p>{t('email_agent_query')}</p>
              </div>
            </div>
          </div>

          {/* Reports Agent */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />

            <div className="relative text-center border-2 border-white/30 hover:border-emerald-400/50 rounded-3xl p-6 lg:p-8 backdrop-blur-sm bg-white/5 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 hover:scale-105 h-full">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                {t('reports_agent_title')}
              </h3>
              <div className="text-white/90 space-y-2 text-sm md:text-base leading-relaxed">
                <p>{t('reports_agent_upload')}</p>
                <p>{t('reports_agent_process')}</p>
              </div>
            </div>
          </div>

          {/* HR Agent */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-green-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />

            <div className="relative text-center border-2 border-white/30 hover:border-teal-400/50 rounded-3xl p-6 lg:p-8 backdrop-blur-sm bg-white/5 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/20 hover:scale-105 h-full">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                {t('hr_agent_title')}
              </h3>
              <div className="text-white/90 space-y-2 text-sm md:text-base leading-relaxed">
                <p>{t('hr_agent_collection')}</p>
                <p>{t('hr_agent_analysis')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - What Makes Agentify Special */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

          <div className="relative text-center border-2 border-white/30 hover:border-white/50 rounded-3xl p-8 md:p-12 backdrop-blur-sm bg-white/5 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20">
            <h2 className="text-3xl pb-2 md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent mb-8">
              {t('what_makes_agentify_special')}
            </h2>
            <div className="text-white/90 max-w-4xl mx-auto space-y-3 text-base md:text-lg leading-relaxed">
              <p>{t('unified_platform')}</p>
              <p>{t('easy_to_use')}</p>
              <p>{t('time_saving')}</p>
              <p>{t('secure_data')}</p>
              <p>{t('email_integration')}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
