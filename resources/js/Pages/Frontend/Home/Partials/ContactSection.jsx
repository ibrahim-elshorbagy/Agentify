import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';

export default function ContactSection() {
  const { t } = useTrans();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const formRef = useRef(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('contact.store'), {
      onSuccess: () => {
        setIsSubmitted(true);
        reset();
        setTimeout(() => setIsSubmitted(false), 5000);
      },
    });
  };

  const contactChannels = [
    {
      id: 'email',
      icon: 'fa-at',
      title: t('email'),
      subtitle: 'support@agentify.com',
      description: t('response_within_24h'),
      action: 'mailto:support@agentify.com',
      gradient: 'from-green-500 via-emerald-500 to-green-600',
      glowColor: 'rgba(34, 197, 94, 0.4)'
    },
  ];

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header with Magnetic Effect */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <div className="px-6 py-2 bg-gradient-to-r from-green-500/20 to-green-500/20 border border-green-400/30 rounded-full backdrop-blur-sm">
              <span className="text-sm font-semibold text-white">
                {t('contact_us')}
              </span>
            </div>
          </div>

          <h2 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r text-white bg-clip-text text-transparent">
              {t('lets_start_conversation')}
            </span>
          </h2>

          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t('contact_description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {/* Contact Channels - Left Side */}
          <div className="lg:col-span-2 space-y-6">


            {/* Info Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-green-500/10 to-green-500/10 border border-green-400/20 backdrop-blur-xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-500 flex items-center justify-center">
                  <i className="fa-solid fa-info text-white"></i>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">{t('quick_response_time')}</h4>
                  <p className="text-gray-100 text-sm leading-relaxed">
                    {t('quick_response_description')}
                  </p>
                </div>
              </div>
            </div>

            {contactChannels.map((channel) => (
              <a
                key={channel.id}
                href={channel.action}
                onMouseEnter={() => setHoveredCard(channel.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group block relative"
              >
                <div className="relative p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-500 hover:scale-105 hover:border-white/30 overflow-hidden">
                  {/* Animated Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${channel.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>

                  {/* Glow Effect */}
                  {hoveredCard === channel.id && (
                    <div
                      className="absolute -inset-1 rounded-3xl blur-xl transition-opacity duration-500"
                      style={{ background: channel.glowColor }}
                    ></div>
                  )}

                  <div className="relative flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${channel.gradient} flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-2xl`}>
                      <i className={`fa-solid ${channel.icon} text-white text-2xl`}></i>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                        {channel.title}
                        <i className="fa-solid ltr:rotate-180 fa-arrow-left text-white text-sm opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300"></i>
                      </h3>
                      <p className="text-gray-100 text-sm mb-1">{channel.subtitle}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-xs text-gray-100">{channel.description}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Contact Form - Right Side */}
          <div className="lg:col-span-3">
            <div
              ref={formRef}
              className="relative p-8 md:p-10 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hidden"
            >
              {/* Animated Border Gradient */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-500 via-green-500 to-green-500 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20"></div>

              {isSubmitted ? (
                <div className="text-center py-16 relative z-10">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-6 animate-bounce shadow-2xl">
                    <i className="fa-solid fa-check text-white text-4xl"></i>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">{t('message_sent_success')}</h3>
                  <p className="text-gray-100 text-lg">{t('will_contact_soon')}</p>
                </div>
              ) : (
                <>
                  <div className="mb-8 relative z-10">
                    <h3 className="text-3xl font-bold text-white mb-2">{t('send_us_message')}</h3>
                    <p className="text-gray-100">{t('fill_form_response')}</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="group">
                        <InputLabel htmlFor="name" value={t('full_name')} className="text-white/90 mb-2" />
                        <div className="relative">
                          <TextInput
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-green-400 focus:ring-green-400/50 rounded-xl px-4 py-3 transition-all duration-300"
                            placeholder={t('enter_name')}
                          />
                        </div>
                        <InputError message={errors.name} className="mt-2" />
                      </div>

                      <div className="group">
                        <InputLabel htmlFor="email" value={t('email_address')} className="text-white/90 mb-2" />
                        <TextInput
                          id="email"
                          type="email"
                          value={data.email}
                          onChange={(e) => setData('email', e.target.value)}
                          className="w-full bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-green-400 focus:ring-green-400/50 rounded-xl px-4 py-3"
                          placeholder="example@email.com"
                        />
                        <InputError message={errors.email} className="mt-2" />
                      </div>
                    </div>

                    <div>
                      <InputLabel htmlFor="subject" value={t('subject')} className="text-white/90 mb-2" />
                      <TextInput
                        id="subject"
                        value={data.subject}
                        onChange={(e) => setData('subject', e.target.value)}
                        className="w-full bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-green-400 focus:ring-green-400/50 rounded-xl px-4 py-3"
                        placeholder={t('what_subject')}
                      />
                      <InputError message={errors.subject} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="message" value={t('message')} className="text-white/90 mb-2" />
                      <TextArea
                        id="message"
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        rows={5}
                        className="w-full bg-white/5 border-white/20 text-white placeholder-white/40 focus:border-green-400 focus:ring-green-400/50 rounded-xl px-4 py-3 resize-none"
                        placeholder={t('tell_us_help')}
                      />
                      <InputError message={errors.message} className="mt-2" />
                    </div>

                    <button
                      type="submit"
                      disabled={processing}
                      className="group relative w-full py-4 px-8 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 rounded-xl font-bold text-white text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {processing ? (
                          <>
                            <i className="fa-solid fa-spinner fa-spin"></i>
                            {t('sending')}
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-paper-plane"></i>
                            {t('send_message')}
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>

                    {/* Privacy Notice */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                      <i className="fa-solid fa-lock text-green-400 mt-1"></i>
                      <p className="text-xs text-gray-100 leading-relaxed">
                        {t('privacy_notice')}
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
