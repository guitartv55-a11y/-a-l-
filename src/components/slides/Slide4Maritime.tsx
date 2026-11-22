import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SlideHeader } from '../SlideHeader';
import { SeaMap } from '../SeaMap';
import { MediaImage } from '../MediaImage';
import {
  getCenterById,
  getIndustryPhotosForCenter,
  MARITIME_COUNTRIES,
} from '../../data/presentationData';

export const Slide4Maritime: React.FC = () => {
  const [activeCenterId, setActiveCenterId] = useState<string>('singapore');
  const activeCenter = getCenterById(activeCenterId) ?? getCenterById('singapore')!;
  const activePhotos = getIndustryPhotosForCenter(activeCenter);

  return (
    <section
      aria-label="Slide 4: Các trung tâm công nghiệp ở Đông Nam Á hải đảo"
      className="flex min-h-full w-full flex-col bg-[#F6F8FB] px-3.5 pb-6 pt-3 sm:px-6 lg:h-full lg:px-14 lg:pb-5 lg:pt-5"
    >
      <SlideHeader
        kicker="ĐÔNG NAM Á HẢI ĐẢO · 5 QUỐC GIA, 5 TRUNG TÂM CÔNG NGHIỆP"
        title="CÔNG NGHIỆP TẠI CÁC QUỐC GIA HẢI ĐẢO"
        subtitle="Nổi bật với các trung tâm công nghiệp lớn: Singapore, Jakarta và Kuala Lumpur"
      />

      {/* TOP STAGE: Full-width clear map on mobile, 7/12 Left Map + 5/12 Right Photos on tablet/desktop */}
      <div className="mt-2 grid grid-cols-12 gap-3 sm:gap-4 lg:min-h-0 lg:flex-[1.35] lg:gap-5">
        {/* LEFT: Clear Maritime SEA Map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="col-span-12 h-[260px] min-w-0 sm:h-[310px] md:col-span-7 md:h-auto lg:min-h-0"
        >
          <SeaMap
            mode="maritime"
            activeCenterId={activeCenterId}
            highlightedCenterIds={['singapore', 'jakarta', 'kuala-lumpur']}
            onSelectCenter={setActiveCenterId}
            showLeaderLines
            showCountryNames
            staggerMarkers
            className="h-full w-full shadow-sm"
          />
        </motion.div>

        {/* RIGHT: Dynamic Selected Maritime Center Info + Industry Photos */}
        <motion.div
          key={activeCenter.id}
          initial={{ opacity: 0.4, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          data-testid="slide4-center-photos"
          className="col-span-12 flex min-w-0 flex-col gap-2 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xs sm:p-3.5 md:col-span-5 lg:min-h-0"
        >
          <div className="shrink-0 border-b border-slate-100 pb-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-1.5">
              <div className="flex flex-wrap items-baseline gap-x-1.5">
                <h2 className="text-sm font-bold text-[#0F294A] lg:text-[15px]">
                  {activeCenter.city}
                </h2>
                <span aria-hidden="true" className="text-slate-300">
                  ·
                </span>
                <span className="text-xs font-semibold text-[#0D7A7E]">
                  {activeCenter.country}
                </span>
              </div>
              <span className="font-mono-num shrink-0 text-xs font-semibold text-[#D97736]">
                {activePhotos.length} ngành
              </span>
            </div>
            <p className="mt-0.5 text-xs leading-snug text-slate-600">
              {activeCenter.industries.join(', ')}.
            </p>
          </div>

          <div
            className={`grid gap-2 lg:min-h-0 lg:flex-1 ${
              activePhotos.length <= 2
                ? 'grid-cols-2 lg:grid-cols-2'
                : activePhotos.length === 3
                  ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3'
                  : 'grid-cols-2 lg:grid-rows-2'
            }`}
          >
            {activePhotos.map((item) => (
              <MediaImage
                key={`${activeCenter.id}-${item.key}`}
                imageKey={item.key}
                showCaption
                caption={item.label}
                className="aspect-[16/10] w-full rounded-lg lg:aspect-auto lg:h-full"
                imgClassName="transition-transform duration-700 hover:scale-105"
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* BOTTOM STRIP: 5 Maritime Countries Cards */}
      <div className="mt-2.5 grid shrink-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:mt-3 lg:grid-cols-5 lg:gap-2.5">
        {MARITIME_COUNTRIES.map((group, idx) => {
          const center = getCenterById(group.centerIds[0]);
          if (!center) return null;
          const isSelected = activeCenterId === center.id;
          const isMajorHub = Boolean(group.featured);

          return (
            <motion.button
              key={group.country}
              type="button"
              onClick={() => setActiveCenterId(center.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.08 + idx * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`flex flex-col rounded-xl border px-3 py-2 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D7A7E] ${
                isSelected
                  ? 'border-[#0D7A7E] bg-white shadow-sm'
                  : isMajorHub
                    ? 'border-slate-200/95 bg-white/95 hover:border-[#0D7A7E]/50'
                    : 'border-slate-200/70 bg-white/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-baseline justify-between gap-1.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono-num text-[11px] font-bold text-[#0D7A7E]">
                    {group.order}.
                  </span>
                  <h2 className="text-xs font-bold text-[#0F294A] sm:text-[13px]">
                    {group.country}
                  </h2>
                </div>
                {isMajorHub && (
                  <span className="shrink-0 text-[10.5px] font-semibold text-[#D97736]">
                    Trung tâm lớn
                  </span>
                )}
              </div>

              <p className="mt-1 text-[11.5px] leading-snug text-slate-600">
                <span
                  className={`font-semibold ${
                    isSelected ? 'text-[#0D7A7E]' : 'text-[#0F294A]'
                  }`}
                >
                  {center.city}:{' '}
                </span>
                {center.industries.join(', ')}.
              </p>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};
