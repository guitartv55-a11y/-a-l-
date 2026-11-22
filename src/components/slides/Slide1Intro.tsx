import React from 'react';
import { motion } from 'motion/react';
import { MediaImage } from '../MediaImage';

export const Slide1Intro: React.FC = () => {
  return (
    <section
      aria-label="Slide 1: Giới thiệu chủ đề Công nghiệp khu vực Đông Nam Á"
      className="relative min-h-full w-full overflow-hidden bg-[#0B1D36] lg:h-full"
    >
      {/* Full-bleed hero photograph with gentle Ken Burns zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <MediaImage
          imageKey="hero"
          priority
          className="h-full w-full"
          imgClassName="animate-ken-burns object-center"
        />
        {/* Measured scrim ensuring crisp WCAG AA/AAA text legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#081A33]/92 via-[#0B2240]/80 to-[#0B2240]/45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#081A33]/78 via-transparent to-[#081A33]/30"
        />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 mx-auto grid min-h-full max-w-[1360px] grid-cols-12 items-center gap-6 px-5 py-7 sm:px-10 lg:h-full lg:gap-8 lg:px-20 lg:py-10">
        {/* Left: Primary Editorial Focal Anchor */}
        <div className="col-span-12 flex flex-col justify-center lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-semibold tracking-[0.12em] text-[#7CE3E6] sm:text-sm"
          >
            <span>ĐỊA LÍ 11 – KẾT NỐI TRI THỨC</span>
            <span aria-hidden="true" className="text-white/40">
              ·
            </span>
            <span className="font-medium tracking-normal text-white/85">
              SGK trang 57, Hình 12.3
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance mt-4 text-3xl font-extrabold leading-[1.2] tracking-tight text-white sm:text-5xl lg:mt-5 lg:text-[3.5rem] lg:leading-[1.15]"
          >
            CÔNG NGHIỆP
            <br />
            KHU VỰC ĐÔNG NAM Á
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.55, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'left' }}
            className="mt-5 h-[3px] w-20 rounded-full bg-[#E08A4E] lg:mt-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 max-w-xl text-base font-normal leading-relaxed text-slate-100/95 sm:text-xl lg:mt-5"
          >
            Đặc điểm phân bố và các trung tâm công nghiệp chính.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.98, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs font-medium text-slate-200/90 sm:text-sm lg:mt-8"
          >
            <span>Phân bố không gian</span>
            <span aria-hidden="true" className="text-[#7CE3E6]/70">
              ·
            </span>
            <span>Đông Nam Á lục địa & hải đảo</span>
            <span aria-hidden="true" className="text-[#7CE3E6]/70">
              ·
            </span>
            <span>Cơ cấu ngành công nghiệp</span>
          </motion.div>
        </div>

        {/* Right: Supporting Real Industrial Photography */}
        <div className="col-span-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-5 lg:flex lg:flex-col lg:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-sm"
          >
            <MediaImage
              imageKey="electronics"
              priority
              showCaption
              caption="Dây chuyền lắp ráp điện tử – công nghệ cao"
              className="aspect-[16/10] w-full rounded-xl"
              imgClassName="transition-transform duration-700 hover:scale-105"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 1.08, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-sm"
          >
            <MediaImage
              imageKey="automotive"
              priority
              showCaption
              caption="Dây chuyền sản xuất ô tô & cơ khí tự động"
              className="aspect-[16/10] w-full rounded-xl"
              imgClassName="transition-transform duration-700 hover:scale-105"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
