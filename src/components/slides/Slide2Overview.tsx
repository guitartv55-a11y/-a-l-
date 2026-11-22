import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SlideHeader } from '../SlideHeader';
import { SeaMap } from '../SeaMap';
import { MediaImage } from '../MediaImage';
import {
  getCenterById,
  getIndustryPhotosForCenter,
  OVERVIEW_BULLETS,
} from '../../data/presentationData';

export const Slide2Overview: React.FC = () => {
  const [selectedCenterId, setSelectedCenterId] = useState<string>('tp-hcm');
  const activeCenter = getCenterById(selectedCenterId) ?? getCenterById('tp-hcm')!;
  const activePhotos = getIndustryPhotosForCenter(activeCenter);

  return (
    <section
      aria-label="Slide 2: Mạng lưới các trung tâm công nghiệp Đông Nam Á"
      className="flex min-h-full w-full flex-col bg-[#F6F8FB] px-3.5 pb-6 pt-3 sm:px-6 lg:h-full lg:px-14 lg:pb-5 lg:pt-5"
    >
      <SlideHeader
        kicker="BỨC TRANH CHUNG · ĐỊA LÍ 11 – SGK TRANG 57, HÌNH 12.3"
        title="MẠNG LƯỚI CÁC TRUNG TÂM CÔNG NGHIỆP"
        subtitle="Nhấp vào trung tâm trên bản đồ để xem ảnh ngành công nghiệp thực tế tương ứng"
      />

      {/* Compact 3 SGK summary bullets */}
      <div className="mt-1.5 grid shrink-0 grid-cols-1 gap-2 sm:grid-cols-3 lg:mt-2 lg:gap-3">
        {OVERVIEW_BULLETS.map((text, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.1 + idx * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="rounded-xl border border-slate-200/85 bg-white px-3 py-2 shadow-2xs"
          >
            <div className="flex items-start gap-2">
              <span className="font-mono-num mt-0.5 text-[11px] font-bold text-[#0D7A7E]">
                0{idx + 1}
              </span>
              <p className="text-xs leading-snug text-slate-700">{text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Responsive Split: Full-width clear map on top (mobile) -> Large Left Map (7/12) + Right Photos (5/12) on tablet/desktop */}
      <div className="mt-2.5 grid grid-cols-12 gap-3 sm:gap-4 lg:min-h-0 lg:flex-1 lg:gap-5">
        {/* LEFT: Large Readable Southeast Asia Map + Selected Center Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="col-span-12 flex min-w-0 flex-col gap-2 md:col-span-7 lg:min-h-0"
        >
          <div className="h-[260px] w-full sm:h-[320px] md:h-auto md:min-h-[340px] lg:min-h-0 lg:flex-1">
            <SeaMap
              mode="all"
              activeCenterId={selectedCenterId}
              onSelectCenter={setSelectedCenterId}
              showLeaderLines
              staggerMarkers
              className="h-full w-full shadow-sm"
            />
          </div>

          <motion.div
            key={activeCenter.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            data-testid="slide2-active-center"
            className="shrink-0 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 shadow-2xs"
          >
            <div className="flex flex-wrap items-baseline gap-x-1.5 text-xs sm:text-[13px]">
              <span className="font-bold text-[#0F294A]">{activeCenter.city}</span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span className="font-semibold text-[#0D7A7E]">
                {activeCenter.country}
              </span>
            </div>
            <p className="mt-0.5 text-xs leading-snug text-slate-600">
              {activeCenter.industries.join(', ')}.
            </p>
          </motion.div>
        </motion.div>

        {/* RIGHT: Dynamic Real Industry Photos strictly matching the selected center */}
        <div
          key={`photos-${activeCenter.id}`}
          data-testid="slide2-photos-panel"
          className="col-span-12 flex min-w-0 flex-col gap-2 rounded-2xl border border-slate-200/85 bg-white p-3 shadow-xs sm:p-3.5 md:col-span-5 lg:min-h-0"
        >
          <div className="flex shrink-0 items-baseline justify-between gap-2 border-b border-slate-100 pb-1.5">
            <h2 className="text-xs font-bold leading-snug text-[#0F294A] sm:text-sm">
              Ảnh minh họa · {activeCenter.shortCity ?? activeCenter.city}
            </h2>
            <span className="font-mono-num shrink-0 text-xs font-semibold text-[#D97736]">
              {activePhotos.length} ngành
            </span>
          </div>

          <div
            className={`grid gap-2 sm:gap-2.5 lg:min-h-0 lg:flex-1 ${
              activePhotos.length <= 2
                ? 'grid-cols-2 md:grid-cols-1 lg:grid-rows-2'
                : activePhotos.length <= 4
                  ? 'grid-cols-2 lg:grid-rows-2'
                  : 'grid-cols-2 lg:grid-rows-3'
            }`}
          >
            {activePhotos.map((photo, idx) => (
              <motion.div
                key={`${activeCenter.id}-${photo.key}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50 lg:min-h-0"
              >
                <MediaImage
                  imageKey={photo.key}
                  showCaption
                  caption={photo.label}
                  className="aspect-[16/10] w-full lg:aspect-auto lg:h-full"
                  imgClassName="transition-transform duration-700 hover:scale-105"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
