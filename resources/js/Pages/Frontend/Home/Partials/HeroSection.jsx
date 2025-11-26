import React from 'react';
import { Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { useTrans } from '@/Hooks/useTrans';
import Squares from '@/Components/Squares';

export default function HeroSection() {
  const { t } = useTrans();

  return (
    <div id="home" className="relative overflow-hidden pt-20">

      {/* Floating Grid Decorations - Modern AI Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Neural Network Icon */}
        <i className="fas fa-network-wired absolute top-20 left-10 text-6xl text-green-200/70 dark:text-green-700/40 transform rotate-12 animate-float-slow" style={{ animation: 'float-slow 6s ease-in-out infinite, pulse-glow 3s ease-in-out infinite' }} />

        {/* AI Chip/Processor */}
        <i className="fas fa-microchip absolute top-10 right-10 text-5xl text-emerald-300/70 dark:text-emerald-600/40 transform rotate-30 animate-float-slow" style={{ animation: 'float-slow 7s ease-in-out infinite, pulse-glow 2.5s ease-in-out infinite alternate' }} />

        {/* Brain Circuit - AI Intelligence */}
        <i className="fas fa-brain absolute bottom-32 right-16 text-5xl text-teal-200/70 dark:text-teal-700/40 transform -rotate-6" style={{ animation: 'float-slower 8s ease-in-out infinite, pulse-glow 4s ease-in-out infinite' }} />

        {/* Data/Analytics Stream */}
        <i className="fas fa-chart-bar absolute top-1/3 right-1/4 text-4xl text-green-300/70 dark:text-green-600/40 transform rotate-45" style={{ animation: 'float 5s ease-in-out infinite, pulse-glow 3.5s ease-in-out infinite' }} />

        {/* Cloud AI / Neural Processing */}
        <i className="fas fa-cloud absolute bottom-20 left-20 text-4xl text-emerald-300/70 dark:text-emerald-600/40 transform -rotate-45" style={{ animation: 'float-slower 9s ease-in-out infinite, pulse-glow 2.8s ease-in-out infinite' }} />

        {/* Spark/Innovation Icon */}
        <i className="fas fa-sparkles absolute top-2/3 left-1/3 text-5xl text-teal-300/70 dark:text-teal-600/40 transform rotate-60" style={{ animation: 'float 6.5s ease-in-out infinite, pulse-glow 3.2s ease-in-out infinite' }} />

        {/* Automation/Workflow */}
        <i className="fas fa-diagram-project absolute bottom-10 right-1/3 text-4xl text-green-400/70 dark:text-green-500/40 transform rotate-15" style={{ animation: 'float-slow 7.5s ease-in-out infinite, pulse-glow 3.8s ease-in-out infinite' }} />

        {/* Additional Modern Icons */}
        <i className="fas fa-atom absolute top-1/2 left-10 text-3xl text-emerald-200/60 dark:text-emerald-700/30 transform rotate-90" style={{ animation: 'spin-slow 20s linear infinite, pulse-glow 4.2s ease-in-out infinite' }} />

        <i className="fas fa-bolt absolute top-40 right-1/3 text-3xl text-teal-200/60 dark:text-teal-700/30 transform -rotate-20" style={{ animation: 'float 5.5s ease-in-out infinite, pulse-glow 2.2s ease-in-out infinite' }} />
      </div>

      <div className="relative container mx-auto px-6 flex  min-h-screen">
        <div className="text-center max-w-6xl mx-auto">

          {/* AI Badge */}
          <div className="max-xl:mt-12 inline-flex items-center gap-2 px-6 py-3 mb-8 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700/50 rounded-full backdrop-blur-sm shadow-lg shadow-green-200/20 dark:shadow-green-900/20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">
              {t('ai_powered_platform')}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-neutral-900 dark:text-neutral-50 mb-6 leading-[1.1] tracking-tight drop-shadow-sm">
            <span className="bg-gradient-to-r from-white via-emerald-300 to-white dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent animate-gradient">
              {t('boost_business_efficiency_ai')}
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-100 dark:text-white mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            {t('take_control_email_files_hiring')}
          </p>

          {/* Enhanced CTA Button with Modern Design */}
          <div className="mb-20 flex flex-col sm:flex-row items-center justify-center gap-4">
            <PrimaryButton
              as="a"
              href={route('register')}
              size="large"
              className="group relative min-w-60 px-12 py-6 text-lg font-semibold overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 border-0 shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-3 justify-center flex-1">
                <i className="fa-solid fa-rocket animate-bounce"></i>
                <span>{t('get_started_now')}</span>
              </span>
              {/* Animated shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </PrimaryButton>
          </div>

          {/* AI Agent Icons Grid - Modern & Organized */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:max-w-4xl mx-auto mb-20">
            {/* Email Agent */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <div className="relative bg-white/80 dark:bg-neutral-900/60 backdrop-blur-sm border border-green-200/50 dark:border-green-700/30 rounded-2xl p-8 hover:border-green-400 dark:hover:border-green-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-green-500/30">
                  <i className="fa-solid fa-envelope text-white text-2xl group-hover:scale-110 transition-transform"></i>
                </div>
                <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  {t('email_agent')}
                </h3>
              </div>
            </div>

            {/* File Management Agent */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <div className="relative bg-white/80 dark:bg-neutral-900/60 backdrop-blur-sm border border-green-200/50 dark:border-green-700/30 rounded-2xl p-8 hover:border-green-400 dark:hover:border-green-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-emerald-500/30">
                  <i className="fa-solid fa-folder text-white text-2xl group-hover:scale-110 transition-transform"></i>
                </div>
                <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  {t('file_agent')}
                </h3>
              </div>
            </div>


            {/* Hiring Agent */}
            <div className="group relative sm:col-span-2 xl:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <div className="relative bg-white/80 dark:bg-neutral-900/60 backdrop-blur-sm border border-green-200/50 dark:border-green-700/30 rounded-2xl p-8 hover:border-green-400 dark:hover:border-green-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-600 to-teal-500 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-green-500/30">
                  <i className="fa-solid fa-user-tie text-white text-2xl group-hover:scale-110 transition-transform"></i>
                </div>
                <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  {t('hiring_agent')}
                </h3>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
