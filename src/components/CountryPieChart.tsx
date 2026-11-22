import React from 'react';
import {
  getPerCountrySectorCharts,
  INDUSTRY_SECTOR_LEGEND,
  type CountrySectorChart,
} from '../data/presentationData';

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function createDonutSlicePath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startDeg: number,
  endDeg: number
): string {
  const startOuter = polarToCartesian(cx, cy, outerR, startDeg);
  const endOuter = polarToCartesian(cx, cy, outerR, endDeg);
  const startInner = polarToCartesian(cx, cy, innerR, endDeg);
  const endInner = polarToCartesian(cx, cy, innerR, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;

  return [
    `M ${startOuter.x.toFixed(1)} ${startOuter.y.toFixed(1)}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${endOuter.x.toFixed(1)} ${endOuter.y.toFixed(1)}`,
    `L ${startInner.x.toFixed(1)} ${startInner.y.toFixed(1)}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${endInner.x.toFixed(1)} ${endInner.y.toFixed(1)}`,
    'Z',
  ].join(' ');
}

interface MiniCountryPieProps {
  chart: CountrySectorChart;
  isActive: boolean;
  onSelect: () => void;
}

/**
 * Compact individual country pie/donut card displaying real World Bank / UNIDO
 * manufacturing value-added subsector percentages.
 */
export const MiniCountryPie: React.FC<MiniCountryPieProps> = ({
  chart,
  isActive,
  onSelect,
}) => {
  const cx = 64;
  const cy = 64;
  const outerR = 54;
  const innerR = 25;

  // Pick top 2 notable sectors for crisp card footer summary
  const topTwo = [...chart.sectors]
    .sort((a, b) => b.sharePercent - a.sharePercent)
    .slice(0, 2);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      aria-label={`Biểu đồ ngành công nghiệp ${chart.country} (${chart.sourceLabel})`}
      className={`group flex flex-col items-center justify-between rounded-xl border p-2 text-center transition-all focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0D7A7E] sm:p-2.5 ${
        isActive
          ? 'border-[#0D7A7E] bg-white shadow-sm ring-1 ring-[#0D7A7E]/30'
          : 'border-slate-200/85 bg-white/90 hover:border-[#0D7A7E]/50 hover:bg-white'
      }`}
    >
      <div className="flex w-full items-baseline justify-between gap-1">
        <span
          className={`truncate text-[11.5px] font-bold sm:text-xs ${
            isActive ? 'text-[#0F294A]' : 'text-slate-800'
          }`}
        >
          {chart.country}
        </span>
        <span
          className={`font-mono-num shrink-0 text-[10px] font-semibold ${
            isActive ? 'text-[#D97736]' : 'text-[#0D7A7E]'
          }`}
        >
          {chart.dataYear}
        </span>
      </div>

      <svg
        viewBox="0 0 128 128"
        style={{ fontFamily: '"Be Vietnam Pro", "Noto Sans", Arial, sans-serif' }}
        className="my-1 h-[84px] w-[84px] shrink-0 select-none sm:h-[90px] sm:w-[90px] lg:h-[94px] lg:w-[94px]"
        aria-hidden="true"
      >
        {chart.sectors
          .filter((s) => s.sharePercent >= 0.5)
          .map((sector) => {
            const sweep = sector.endAngle - sector.startAngle;
            const gap = sweep > 6 ? 1.0 : 0.2;
            const d = createDonutSlicePath(
              cx,
              cy,
              outerR,
              innerR,
              sector.startAngle + gap,
              sector.endAngle - gap
            );
            const midAngle = (sector.startAngle + sector.endAngle) / 2;
            const labelPt = polarToCartesian(
              cx,
              cy,
              (outerR + innerR) / 2,
              midAngle
            );

            return (
              <g key={`${chart.id}-${sector.name}`}>
                <path
                  d={d}
                  fill={sector.color}
                  fillOpacity={isActive ? 1 : 0.92}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                />
                {sector.sharePercent >= 12 && (
                  <text
                    x={labelPt.x}
                    y={labelPt.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="8.5"
                    fontWeight="700"
                    fill="#FFFFFF"
                  >
                    {Math.round(sector.sharePercent)}%
                  </text>
                )}
              </g>
            );
          })}

        <circle cx={cx} cy={cy} r={innerR - 2} fill="#FFFFFF" />
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="10.5"
          fontWeight="800"
          fill="#0F294A"
        >
          {Math.round(chart.dominantPercent)}%
        </text>
        <text
          x={cx}
          y={cy + 8}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="7"
          fontWeight="600"
          fill="#64748B"
        >
          chủ lực
        </text>
      </svg>

      {/* Top 2 real drivers concise readout */}
      <p className="line-clamp-2 w-full text-[9.5px] leading-tight text-slate-600 sm:text-[10px]">
        {topTwo.map((s) => `${s.name.split(',')[0]} ${s.sharePercent}%`).join(' · ')}
      </p>
    </button>
  );
};

/**
 * Renders the 10 individual country World Bank / UNIDO manufacturing pie charts
 * + shared color legend onto an offscreen canvas for crisp PowerPoint Slide 5 export.
 */
export function renderPerCountryPiesToDataUrl(): string {
  const charts = getPerCountrySectorCharts();
  const width = 1280;
  const height = 840;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Shared 5-sector World Bank / UNIDO legend at top (single clean row)
  const legendItems = [
    ...INDUSTRY_SECTOR_LEGEND,
    { name: 'Khai khoáng & xây dựng (Đông Timor)', color: '#94A3B8' },
  ];
  legendItems.forEach((item, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 22 + col * 420;
    const y = 18 + row * 32;

    ctx.fillStyle = item.color;
    ctx.fillRect(x, y, 16, 16);
    ctx.fillStyle = '#0F294A';
    ctx.font = 'bold 16px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.name, x + 24, y + 8);
  });

  // 2 rows x 5 columns of individual country donut charts
  const gridTop = 96;
  const cellW = 244;
  const cellH = 358;
  const gapX = 10;
  const gapY = 14;

  charts.forEach((chart, idx) => {
    const col = idx % 5;
    const row = Math.floor(idx / 5);
    const x = 10 + col * (cellW + gapX);
    const y = gridTop + row * (cellH + gapY);

    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, cellW, cellH, 14);
    ctx.fill();
    ctx.stroke();

    // Country name + data year
    ctx.fillStyle = '#0F294A';
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(chart.country, x + cellW / 2, y + 12);

    ctx.fillStyle = '#0D7A7E';
    ctx.font = 'bold 13.5px Arial, sans-serif';
    ctx.fillText(`Nguồn: ${chart.sourceLabel}`, x + cellW / 2, y + 38);

    // Donut chart
    const cx = x + cellW / 2;
    const cy = y + 148;
    const outerR = 78;
    const innerR = 36;

    for (const sector of chart.sectors) {
      if (sector.sharePercent < 0.5) continue;
      const startRad = ((sector.startAngle + 0.8) * Math.PI) / 180;
      const endRad = ((sector.endAngle - 0.8) * Math.PI) / 180;
      const midRad = (((sector.startAngle + sector.endAngle) / 2) * Math.PI) / 180;

      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startRad, endRad);
      ctx.arc(cx, cy, innerR, endRad, startRad, true);
      ctx.closePath();
      ctx.fillStyle = sector.color;
      ctx.fill();

      if (sector.sharePercent >= 12) {
        const mr = (outerR + innerR) / 2;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 13.5px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          `${Math.round(sector.sharePercent)}%`,
          cx + Math.cos(midRad) * mr,
          cy + Math.sin(midRad) * mr
        );
      }
    }

    // Center dominant %
    ctx.fillStyle = '#0F294A';
    ctx.font = 'bold 19px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(chart.dominantPercent)}%`, cx, cy - 6);
    ctx.fillStyle = '#64748B';
    ctx.font = '600 12px Arial, sans-serif';
    ctx.fillText('chủ lực', cx, cy + 13);

    // Top 4 sectors breakdown lines
    const sorted = [...chart.sectors].sort((a, b) => b.sharePercent - a.sharePercent);
    sorted.slice(0, 4).forEach((s, si) => {
      const sy = y + 240 + si * 23;
      ctx.fillStyle = s.color;
      ctx.fillRect(x + 12, sy + 2, 10, 10);
      ctx.fillStyle = '#334155';
      ctx.font = '13px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      const shortName = s.name.length > 18 ? `${s.name.slice(0, 16)}…` : s.name;
      ctx.fillText(`${shortName}: ${s.sharePercent}%`, x + 28, sy);
    });

    // Bottom GDP industry badge
    ctx.fillStyle = '#0D7A7E';
    ctx.font = 'bold 12px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      `CN/GDP: ${chart.industryGdpPercent}% (${chart.gdpYear})`,
      x + cellW / 2,
      y + 336
    );
  });

  return canvas.toDataURL('image/png');
}

/**
 * Renders a single enlarged country World Bank / UNIDO sector-proportion donut chart
 * for interactive country drill-down slides (Slides 7..16) in PowerPoint export.
 */
export function renderSingleCountryPieToDataUrl(chart: CountrySectorChart): string {
  const width = 560;
  const height = 420;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;
  const outerR = 165;
  const innerR = 76;

  for (const sector of chart.sectors) {
    if (sector.sharePercent < 0.5) continue;
    const startRad = ((sector.startAngle + 0.8) * Math.PI) / 180;
    const endRad = ((sector.endAngle - 0.8) * Math.PI) / 180;
    const midRad = (((sector.startAngle + sector.endAngle) / 2) * Math.PI) / 180;

    ctx.beginPath();
    ctx.arc(cx, cy, outerR, startRad, endRad);
    ctx.arc(cx, cy, innerR, endRad, startRad, true);
    ctx.closePath();
    ctx.fillStyle = sector.color;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();

    if (sector.sharePercent >= 8) {
      const mr = (outerR + innerR) / 2;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `${Math.round(sector.sharePercent)}%`,
        cx + Math.cos(midRad) * mr,
        cy + Math.sin(midRad) * mr
      );
    }
  }

  ctx.fillStyle = '#0F294A';
  ctx.font = 'bold 26px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${Math.round(chart.dominantPercent)}%`, cx, cy - 12);

  ctx.fillStyle = '#0D7A7E';
  ctx.font = 'bold 16px Arial, sans-serif';
  ctx.fillText(chart.dataYear, cx, cy + 16);

  return canvas.toDataURL('image/png');
}
