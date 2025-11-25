import React, { useState } from 'react';
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
      },
    });
  };

  const contactMethods = [
    {
      icon: 'fa-envelope',
      title: t('email_us'),
      description: t('send_us_an_email_and_we_will_respond_within_24_hours'),
      value: 'support@agentify.com',
      action: 'mailto:support@agentify.com',
      color: 'blue'
    },
    // {
    //   icon: 'fa-phone',
    //   title: t('call_us'),
    //   description: t('speak_directly_with_our_support_team'),
    //   value: '+966 59 966 9870',
    //   action: 'tel:+966599669870',
    //   color: 'green'
    // },
    // {
    //   icon: 'fa-comments',
    //   title: t('live_chat'),
    //   description: t('chat_with_us_in_real_time_for_instant_help'),
    //   value: t('available_24_7'),
    //   action: '#',
    //   color: 'purple'
    // },
    // {
    //   icon: 'fa-map-marker-alt',
    //   title: t('visit_us'),
    //   description: t('come_visit_our_office_for_a_face_to_face_meeting'),
    //   value: '123 Business St, City, Country',
    //   action: 'https://maps.google.com',
    //   color: 'orange'
    // }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        border: 'border-blue-200 dark:border-blue-700',
        icon: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-500',
        hover: 'hover:border-blue-300 dark:hover:border-blue-600'
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/30',
        border: 'border-green-200 dark:border-green-700',
        icon: 'text-green-600 dark:text-green-400',
        iconBg: 'bg-green-500',
        hover: 'hover:border-green-300 dark:hover:border-green-600'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/30',
        border: 'border-purple-200 dark:border-purple-700',
        icon: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-purple-500',
        hover: 'hover:border-purple-300 dark:hover:border-purple-600'
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/30',
        border: 'border-orange-200 dark:border-orange-700',
        icon: 'text-orange-600 dark:text-orange-400',
        iconBg: 'bg-orange-500',
        hover: 'hover:border-orange-300 dark:hover:border-orange-600'
      }
    };
    return colors[color];
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-3 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            {t('get_in_touch')}
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            {t('have_questions_or_need_help_our_team_is_here_to_assist_you_every_step_of_the_way')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          {/* Contact Methods */}
          <div>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">
              {t('multiple_ways_to_reach_us')}
            </h3>

            <div className="space-y-6">
              {contactMethods.map((method, index) => {
                const colorClasses = getColorClasses(method.color);
                return (
                  <a
                    key={index}
                    href={method.action}
                    className={`group block p-3 md:p-6 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border-2 ${colorClasses.border} ${colorClasses.hover} transition-all duration-300 hover:shadow-lg`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${colorClasses.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <i className={`fa-solid ${method.icon} text-white`}></i>
                      </div>

                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          {method.title}
                        </h4>
                        <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-2">
                          {method.description}
                        </p>
                        <p className={`font-medium ${colorClasses.icon}`}>
                          {method.value}
                        </p>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <i className="fa-solid fa-arrow-right text-green-500"></i>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* FAQ Link  */}
            {/* <div className="mt-8 p-4 sm:p-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-question-circle text-white"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                    {t('frequently_asked_questions')}
                  </h4>
                  <p className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm">
                    {t('find_quick_answers_to_common_questions')}
                  </p>
                </div>
                <PrimaryButton
                  as="a"
                  href="#"
                  className='w-full justify-center gap-2 ltr:flex-row-reverse'
                  icon={'fa-arrow-right'}
                >
                  {t('view_faq')}
                </PrimaryButton>
              </div>
            </div> */}



          </div>

          {/* Contact Form */}
          <div>
            {isSubmitted ? (
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-check text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  {t('message_sent_successfully')}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                  {t('thank_you_for_contacting_us_we_will_get_back_to_you_soon')}
                </p>
                <PrimaryButton
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  variant="secondary"
                  icon="fa-arrow-left"
                >
                  {t('send_another_message')}
                </PrimaryButton>
              </div>
            ) : (
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-4 md:p-8 border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                  {t('send_us_a_message')}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <InputLabel htmlFor="name" value={t('your_name')} />
                      <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        placeholder={t('enter_your_full_name')}
                        onChange={(e) => setData('name', e.target.value)}
                      />
                      <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div>
                      <InputLabel htmlFor="email" value={t('email_address')} />
                      <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="email"
                        placeholder={t('enter_your_email')}
                        onChange={(e) => setData('email', e.target.value)}
                      />
                      <InputError message={errors.email} className="mt-2" />
                    </div>
                  </div>

                  <div>
                    <InputLabel htmlFor="subject" value={t('subject')} />
                    <TextInput
                      id="subject"
                      name="subject"
                      value={data.subject}
                      className="mt-1 block w-full"
                      placeholder={t('what_is_this_about')}
                      onChange={(e) => setData('subject', e.target.value)}
                    />
                    <InputError message={errors.subject} className="mt-2" />
                  </div>

                  <div>
                    <InputLabel htmlFor="message" value={t('message')} />
                    <TextArea
                      id="message"
                      name="message"
                      value={data.message}
                      onChange={(e) => setData('message', e.target.value)}
                      rows={6}
                      placeholder={t('tell_us_how_we_can_help_you')}
                    />
                    <InputError message={errors.message} className="mt-2" />
                  </div>

                  <PrimaryButton
                    type="submit"
                    disabled={processing}
                    className="w-full  justify-center py-4"
                    icon={processing ? 'fa-spinner fa-spin' : 'fa-paper-plane'}
                  >
                    {processing ? t('sending') : t('send_message')}
                  </PrimaryButton>
                </form>

                {/* Privacy Notice */}
                <div className="mt-6 p-4 bg-neutral-100 dark:bg-neutral-700 rounded-xl">
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 flex items-start gap-2">
                    <i className="fa-solid fa-shield-alt text-green-500 mt-0.5"></i>
                    {t('your_information_is_secure_and_will_never_be_shared_with_third_parties')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-neutral-200 dark:border-neutral-700">
          {[
            { icon: 'fa-clock', value: '< 24h', label: t('average_response_time') },
            { icon: 'fa-smile', value: '99%', label: t('customer_satisfaction') },
            { icon: 'fa-users', value: '50+', label: t('support_team_members') },
            { icon: 'fa-globe', value: '25+', label: t('languages_supported') }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                <i className={`fa-solid ${stat.icon} text-green-600 dark:text-green-400`}></i>
              </div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
}
