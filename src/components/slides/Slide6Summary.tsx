import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SlideHeader } from '../SlideHeader';
import { SeaMap } from '../SeaMap';
import {
  getCenterById,
  KEY_SUMMARY_CENTER_IDS,
  SUMMARY_POINTS,
} from '../../data/presentationData';

export const Slide6Summary: React.FC = () => {
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null);
  const selectedCenter = selectedCenterId ? getCenterById(selectedCenterId) : null;

  return (
    <section
      aria-label="Slide 6: Tổng kết bức tranh công nghiệp Đông Nam Á"
      className="flex min-h-full w-full flex-col bg-[#F6F8FB] px-3.5 pb-6 pt-3 sm:px-6 lg:h-full lg:px-14 lg:pb-5 lg:pt-5"
    >
      <SlideHeader
        kicker="TỔNG KẾT BÀI HỌC · ĐỊA LÍ 11 – KẾT NỐI TRI THỨC"
        title="KẾT LUẬN – BỨC TRANH CÔNG NGHIỆP ĐÔNG NAM Á"
      />

      {/* Responsive Split: Full-width readable map on mobile -> 7/12 Left Map + 5/12 Right Takeaways on tablet/desktop */}
      <div className="mt-2 grid grid-cols-12 gap-3.5 lg:min-h-0 lg:flex-1 lg:gap-6">
        {/* LEFT: Clear Southeast Asia Map with glowing key centers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-12 flex min-w-0 flex-col gap-2 md:col-span-7 lg:min-h-0"
        >
          <div className="h-[260px] w-full sm:h-[320px] md:h-auto md:min-h-[320px] lg:min-h-0 lg:flex-1">
            <SeaMap
              mode="all"
              activeCenterId={selectedCenterId}
              highlightedCenterIds={KEY_SUMMARY_CENTER_IDS}
              onSelectCenter={setSelectedCenterId}
              showLeaderLines
              staggerMarkers
              className="h-full w-full shadow-sm"
            />
          </div>

          {selectedCenter && (
            <motion.div
              key={selectedCenter.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2 shadow-2xs"
            >
              <p className="text-xs font-bold text-[#0F294A]">
                {selectedCenter.city} ·{' '}
                <span className="font-medium text-[#0D7A7E]">
                  {selectedCenter.country}
                </span>
              </p>
              <p className="mt-0.5 text-xs leading-snug text-slate-600">
                {selectedCenter.industries.join(', ')}.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* RIGHT: 3 Summary Takeaways */}
        <div className="col-span-12 flex min-w-0 flex-col justify-between gap-2.5 sm:gap-3 md:col-span-5 lg:min-h-0">
          {SUMMARY_POINTS.map((point, idx) => (
            <motion.div
              key={point.order}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.2 + idx * 0.14,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-1 flex-col justify-center rounded-2xl border border-slate-200/90 bg-white px-4 py-3 shadow-2xs sm:px-5 sm:py-3.5"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-mono-num text-xs font-bold text-[#D97736] sm:text-sm">
                  0{point.order}
                </span>
                <h2 className="text-sm font-bold leading-snug text-[#0F294A] sm:text-base">
                  {point.title}
                </h2>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:mt-1.5 sm:text-sm">
                {point.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full-width Final Thank-You Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="mt-3 shrink-0 rounded-2xl bg-[#0F294A] px-4 py-3 text-center shadow-sm sm:px-6 sm:py-3.5"
      >
        <p className="text-balance text-sm font-bold leading-snug tracking-wide text-white sm:text-base lg:text-lg">
          CẢM ƠN THẦY CÔ VÀ CÁC BẠN ĐÃ LẮNG NGHE!
        </p>
        <p className="mt-0.5 text-[11px] font-medium text-[#7CE3E6] sm:text-xs">
          Địa lí 11 – Kết nối tri thức với cuộc sống · SGK trang 57, Hình 12.3
        </p>
      </motion.div>
    </section>
  );
};
