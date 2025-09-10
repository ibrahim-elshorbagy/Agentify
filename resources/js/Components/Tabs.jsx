import React, { useState } from 'react';
import { useTrans } from '@/Hooks/useTrans';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/scrollbar';
import { usePage } from '@inertiajs/react';

export default function Tabs({ tabs }) {
  const { t } = useTrans();
  const { locale } = usePage().props;

  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="w-full relative">
      <div className="border-b border-neutral-300 dark:border-neutral-700 relative">
        <Swiper
          modules={[Scrollbar]}
          spaceBetween={10}
          slidesPerView="auto"
          freeMode={true}
          dir={locale}
          wrapperClass="!justify-start flex"
          onSwiper={(swiper) => {
            setTimeout(() => swiper.slideTo(1), 800);
            setTimeout(() => swiper.slideTo(0), 1600);
          }}
        >
          {tabs.map((tab, index) => (
            <SwiperSlide key={index} className="!w-auto">
              <button
                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-t-lg ${
                  activeTab === index
                    ? "text-green-500 border-b-2 border-green-500 active dark:text-green-400 dark:border-green-400"
                    : "border-transparent hover:text-neutral-600 hover:border-neutral-300 dark:hover:text-neutral-300"
                }`}
                onClick={() => handleTabClick(index)}
              >
                {tab.icon && <i className={`fa-solid ${tab.icon} mx-2`}></i>}
                {tab.translationKey ? t(tab.translationKey) : tab.title}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>


      </div>

      <div className="p-4">
        {tabs.map((tab, index) => (
          <div key={index} className={activeTab === index ? 'block' : 'hidden'}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
