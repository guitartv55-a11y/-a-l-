import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import {
  clampSlide,
  formatSlideNumber,
  getProgressPercent,
  nextSlide,
  prevSlide,
  SLIDES_META,
  TOTAL_SLIDES,
} from './data/presentationData';
import { Slide1Intro } from './components/slides/Slide1Intro';
import { Slide2Overview } from './components/slides/Slide2Overview';
import { Slide3Mainland } from './components/slides/Slide3Mainland';
import { Slide4Maritime } from './components/slides/Slide4Maritime';
import { Slide5Structure } from './components/slides/Slide5Structure';
import { Slide6Summary } from './components/slides/Slide6Summary';
import { exportPresentationToPptx } from './utils/exportPptx';

type ExportState = 'idle' | 'exporting' | 'done' | 'error';

export function App() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [exportState, setExportState] = useState<ExportState>('idle');

  const goToSlide = useCallback((targetIndex: number) => {
    setCurrentSlide((prev) => {
      const clamped = clampSlide(targetIndex, TOTAL_SLIDES);
      if (clamped !== prev) {
        setDirection(clamped > prev ? 1 : -1);
      }
      return clamped;
    });
  }, []);

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => {
      const next = nextSlide(prev, TOTAL_SLIDES);
      if (next !== prev) setDirection(1);
      return next;
    });
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => {
      const prevIdx = prevSlide(prev, TOTAL_SLIDES);
      if (prevIdx !== prev) setDirection(-1);
      return prevIdx;
    });
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore fullscreen denial inside restricted iframes gracefully
    }
  }, []);

  const handleExportPptx = useCallback(async () => {
    if (exportState === 'exporting') return;
    setExportState('exporting');
    try {
      await exportPresentationToPptx();
      setExportState('done');
      window.setTimeout(() => setExportState('idle'), 2800);
    } catch (err) {
      console.error('Lỗi xuất PowerPoint:', err);
      setExportState('error');
      window.setTimeout(() => setExportState('idle'), 3200);
    }
  }, [exportState]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrev();
      } else if (event.key === ' ' || event.code === 'Space') {
        // Prevent Space from scrolling or re-clicking a focused slide control
        event.preventDefault();
        handleNext();
      } else if (event.key === 'f' || event.key === 'F') {
        event.preventDefault();
        void toggleFullscreen();
      } else if (event.key >= '1' && event.key <= String(TOTAL_SLIDES)) {
        event.preventDefault();
        goToSlide(Number(event.key) - 1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goToSlide, handleNext, handlePrev, toggleFullscreen]);

  const progressPercent = getProgressPercent(currentSlide, TOTAL_SLIDES);
  const slideCounter = formatSlideNumber(currentSlide, TOTAL_SLIDES);

  const renderSlide = (index: number) => {
    switch (index) {
      case 0:
        return <Slide1Intro />;
      case 1:
        return <Slide2Overview />;
      case 2:
        return <Slide3Mainland />;
      case 3:
        return <Slide4Maritime />;
      case 4:
        return <Slide5Structure />;
      case 5:
        return <Slide6Summary />;
      default:
        return <Slide1Intro />;
    }
  };

  return (
    <div
      data-testid="presentation-shell"
      data-slide-index={currentSlide}
      className="relative flex h-screen w-screen flex-col overflow-hidden bg-[#F6F8FB]"
    >
      {/* Top Progress Bar */}
      <div
        role="progressbar"
        aria-label="Tiến độ bài trình chiếu"
        aria-valuenow={currentSlide + 1}
        aria-valuemin={1}
        aria-valuemax={TOTAL_SLIDES}
        className="z-30 h-1 w-full shrink-0 bg-slate-200/80"
      >
        <div
          className="h-full bg-gradient-to-r from-[#0F294A] via-[#0D7A7E] to-[#D97736] transition-[width] duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main 16:9 Presentation Stage (zero scroll on desktop, smooth scroll on mobile) */}
      <main className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden lg:overflow-hidden">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 28 : -28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -24 : 24 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-full w-full lg:h-full"
          >
            {renderSlide(currentSlide)}
          </motion.div>
        </AnimatePresence>

        {/* Left Edge Slide Navigation Button (Desktop / Projector) */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentSlide === 0}
          aria-label="Slide trước"
          className={`fixed left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D7A7E] lg:flex ${
            currentSlide === 0
              ? 'pointer-events-none opacity-0'
              : 'border-slate-300/90 bg-white/95 text-[#0F294A] shadow-sm hover:border-[#0D7A7E] hover:bg-white hover:text-[#0D7A7E]'
          }`}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Right Edge Slide Navigation Button (Desktop / Projector) */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentSlide === TOTAL_SLIDES - 1}
          aria-label="Slide tiếp theo"
          className={`fixed right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D7A7E] lg:flex ${
            currentSlide === TOTAL_SLIDES - 1
              ? 'pointer-events-none opacity-0'
              : currentSlide === 0
                ? 'border-white/30 bg-[#0F294A]/85 text-white shadow-sm hover:bg-[#0F294A]'
                : 'border-slate-300/90 bg-white/95 text-[#0F294A] shadow-sm hover:border-[#0D7A7E] hover:bg-white hover:text-[#0D7A7E]'
          }`}
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </main>

      {/* Bottom Presentation Control Bar */}
      <footer className="z-30 flex h-14 shrink-0 items-center justify-between gap-2 border-t border-slate-200/90 bg-white px-3 sm:px-5 lg:px-10">
        {/* Left: Mobile Prev/Next + Counter + Desktop Slide Quick Navigation */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentSlide === 0}
              aria-label="Chuyển về slide trước"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#0F294A] transition-colors hover:border-[#0D7A7E] disabled:opacity-35"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentSlide === TOTAL_SLIDES - 1}
              aria-label="Chuyển sang slide tiếp theo"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#0F294A] transition-colors hover:border-[#0D7A7E] disabled:opacity-35"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <span
            data-testid="slide-counter"
            className="font-mono-num text-sm font-semibold text-[#0F294A]"
          >
            {slideCounter}
          </span>

          <nav aria-label="Điều hướng các slide" className="hidden items-center gap-1 lg:flex">
            {SLIDES_META.map((slide) => {
              const isCurrent = slide.index === currentSlide;
              return (
                <button
                  key={slide.code}
                  type="button"
                  onClick={() => goToSlide(slide.index)}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`Slide ${slide.index + 1}: ${slide.shortLabel}`}
                  className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D7A7E] ${
                    isCurrent
                      ? 'bg-[#0F294A] text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-[#0F294A]'
                  }`}
                >
                  <span className="font-mono-num mr-1 opacity-75">{slide.code}</span>
                  <span>{slide.shortLabel}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Keyboard Hint + PowerPoint Export + Fullscreen Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="hidden text-xs text-slate-400 xl:inline">
            Phím ← / → hoặc Space để chuyển slide
          </span>

          <button
            type="button"
            onClick={handleExportPptx}
            disabled={exportState === 'exporting'}
            aria-label="Xuất bài trình chiếu sang file PowerPoint"
            className={`inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D7A7E] sm:px-3.5 ${
              exportState === 'done'
                ? 'bg-[#0D7A7E] text-white'
                : exportState === 'error'
                  ? 'bg-red-600 text-white'
                  : 'bg-[#0F294A] text-white hover:bg-[#193B68] disabled:opacity-70'
            }`}
          >
            {exportState === 'exporting' ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                <span>Đang tạo...</span>
              </>
            ) : exportState === 'done' ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Đã xuất PPTX</span>
              </>
            ) : exportState === 'error' ? (
              <span>Thử xuất lại</span>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Xuất PowerPoint</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Thoát chế độ toàn màn hình' : 'Bật chế độ toàn màn hình'}
            className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-[#0F294A] transition-colors hover:border-[#0D7A7E] hover:text-[#0D7A7E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D7A7E] sm:px-3"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Thu nhỏ</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Toàn màn hình</span>
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
