import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { SlideHeader } from '../SlideHeader';
import { SeaMap } from '../SeaMap';
import { MiniCountryPie } from '../CountryPieChart';
import {
  getCenterById,
  getPerCountrySectorCharts,
  INDUSTRY_SECTOR_LEGEND,
} from '../../data/presentationData';

export const Slide5Structure: React.FC = () => {
  const countryCharts = useMemo(() => getPerCountrySectorCharts(), []);
  const [activeCountryId, setActiveCountryId] = useState<string>(countryCharts[0].id);

  const activeChart =
    countryCharts.find((c) => c.id === activeCountryId) ?? countryCharts[0];

  const handleSelectMapCenter = (centerId: string) => {
    const center = getCenterById(centerId);
    if (!center) return;
    const match = countryCharts.find((c) => c.countryIso === center.countryIso);
    if (match) setActiveCountryId(match.id);
  };

  return (
    <section
      aria-label="Slide 5: Số liệu quốc tế tỉ trọng ngành công nghiệp chế biến từng nước Đông Nam Á"
      className="flex min-h-full w-full flex-col bg-[#F6F8FB] px-3.5 pb-6 pt-3 sm:px-6 lg:h-full lg:px-14 lg:pb-5 lg:pt-5"
    >
      <SlideHeader
        kicker="SỐ LIỆU THỐNG KÊ QUỐC TẾ · WORLD BANK (WDI) & UNIDO INDSTAT"
        title="TỈ TRỌNG CÁC NGÀNH CÔNG NGHIỆP TỪNG NƯỚC"
        subtitle="Cơ cấu giá trị gia tăng công nghiệp chế biến (%) thực tế của từng nước Đông Nam Á kèm bản đồ vị trí"
      />

      <div className="mt-2 grid grid-cols-12 gap-3.5 lg:min-h-0 lg:flex-1 lg:gap-5">
        {/* LEFT COLUMN: Clear Southeast Asia Map + Active Country Real WDI/UNIDO Readout */}
        <div className="col-span-12 flex flex-col gap-2.5 md:col-span-5 lg:min-h-0">
          <div className="h-[260px] w-full sm:h-[310px] md:h-auto md:min-h-[290px] lg:min-h-0 lg:flex-[1.25]">
            <SeaMap
              mode="all"
              activeCenterId={activeChart.primaryCenterId}
              activeCountryIso={activeChart.countryIso}
              highlightedCenterIds={activeChart.centerIds}
              onSelectCenter={handleSelectMapCenter}
              showLeaderLines
              staggerMarkers
              className="h-full w-full shadow-sm"
            />
          </div>

          {/* Enlarged exact World Bank / UNIDO breakdown for selected country */}
          <motion.div
            key={activeChart.id}
            initial={{ opacity: 0.4, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            data-testid="slide5-country-detail"
            className="shrink-0 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xs sm:p-3.5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-100 pb-1.5">
              <div className="flex flex-wrap items-baseline gap-1.5">
                <h2 className="text-sm font-bold text-[#0F294A] sm:text-[15px]">
                  {activeChart.country}
                </h2>
                <span aria-hidden="true" className="text-slate-300">
                  ·
                </span>
                <span className="text-xs font-semibold text-[#0D7A7E]">
                  {activeChart.sourceLabel}
                </span>
              </div>
              <span className="font-mono-num shrink-0 text-[11px] font-bold text-[#D97736]">
                CN: {activeChart.industryGdpPercent}% GDP ({activeChart.gdpYear})
              </span>
            </div>

            <div className="mt-2 grid grid-cols-1 gap-y-1 sm:grid-cols-2 sm:gap-x-3">
              {activeChart.sectors.map((sector) => (
                <div
                  key={sector.name}
                  className="flex items-center justify-between gap-1.5 text-[11.5px] sm:text-xs"
                >
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-xs"
                      style={{ backgroundColor: sector.color }}
                      aria-hidden="true"
                    />
                    <span className="truncate font-medium text-slate-700">
                      {sector.name}
                    </span>
                  </div>
                  <span className="font-mono-num shrink-0 font-bold text-[#0F294A]">
                    {sector.sharePercent}%
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-2 border-t border-slate-100 pt-1.5 text-[10.5px] leading-snug text-slate-500">
              {activeChart.metricNote
                ? activeChart.metricNote
                : `Công nghiệp chế biến đóng góp ${activeChart.manufacturingGdpPercent}% GDP (${activeChart.gdpYear}, World Bank).`}
            </p>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Standardized World Bank / UNIDO 5-Sector Legend + 10 Country Pie Charts */}
        <div className="col-span-12 flex flex-col gap-2.5 md:col-span-7 lg:min-h-0">
          {/* Shared Standardized International Sector Color Legend */}
          <div className="shrink-0 rounded-xl border border-slate-200/85 bg-white px-3 py-2 shadow-2xs">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#0F294A]">
                Phân ngành (UNIDO / WB):
              </span>
              {INDUSTRY_SECTOR_LEGEND.map((item) => (
                <span
                  key={item.name}
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-700"
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-xs"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  {item.name}
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-xs bg-[#94A3B8]"
                  aria-hidden="true"
                />
                Khai khoáng & xây dựng (Đông Timor)
              </span>
            </div>
          </div>

          {/* 10 Individual Country Pie Charts (2 cols on phone, 5x2 on desktop) */}
          <div
            data-testid="slide5-country-pies"
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:min-h-0 lg:flex-1 lg:grid-cols-5 lg:grid-rows-2 lg:gap-2.5"
          >
            {countryCharts.map((chart) => (
              <MiniCountryPie
                key={chart.id}
                chart={chart}
                isActive={chart.id === activeCountryId}
                onSelect={() => setActiveCountryId(chart.id)}
              />
            ))}
          </div>

          <p className="shrink-0 text-center text-[11px] text-slate-500">
            Nguồn số liệu quốc tế: World Bank Open Data (WDI) & Tổ chức Phát triển Công nghiệp Liên Hợp Quốc (UNIDO INDSTAT).
          </p>
        </div>
      </div>
    </section>
  );
};
