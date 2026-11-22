import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TOTAL_SLIDES,
  SLIDES_META,
  INDUSTRIAL_CENTERS,
  MAINLAND_COUNTRIES,
  MARITIME_COUNTRIES,
  INDUSTRY_GROUPS,
  SUMMARY_POINTS,
  clampSlide,
  nextSlide,
  prevSlide,
  formatSlideNumber,
  getProgressPercent,
  getCenterById,
  getIndustryPhotosForCenter,
  getCountryPieData,
  getPerCountrySectorCharts,
} from './presentationData';
import { computePptxMapHotspots } from '../utils/seaMapGeometry';

test('PPTX map hotspots cover all visible centers strictly within map frame bounds', () => {
  const modes = [
    { mode: 'all' as const, expected: 11 },
    { mode: 'mainland' as const, expected: 6 },
    { mode: 'maritime' as const, expected: 5 },
  ];

  for (const { mode, expected } of modes) {
    const box = { x: 0.6, y: 1.3, w: 6.4, h: 4.8 };
    const spots = computePptxMapHotspots(mode, box.x, box.y, box.w, box.h);
    assert.equal(spots.length, expected);
    for (const spot of spots) {
      assert.ok(spot.labelX >= box.x, `${mode} ${spot.center.city} labelX within left bound`);
      assert.ok(spot.labelX + spot.labelW <= box.x + box.w + 0.01, `${mode} ${spot.center.city} labelX within right bound`);
      assert.ok(spot.labelY >= box.y, `${mode} ${spot.center.city} labelY within top bound`);
      assert.ok(spot.labelY + spot.labelH <= box.y + box.h + 0.01, `${mode} ${spot.center.city} labelY within bottom bound`);
    }
  }
});

test('per-country sector pie charts cover all 10 countries with verified World Bank/UNIDO proportions', () => {
  const charts = getPerCountrySectorCharts();
  assert.equal(charts.length, 10);

  for (const chart of charts) {
    assert.ok(chart.sectors.length >= 2, `${chart.country} has at least 2 sectors`);
    assert.ok(chart.sourceLabel.includes('World Bank'), `${chart.country} cites World Bank`);
    const totalAngle = chart.sectors.reduce(
      (sum, s) => sum + (s.endAngle - s.startAngle),
      0
    );
    assert.ok(Math.abs(totalAngle - 360) < 0.01, `${chart.country} sums to 360deg`);
    const totalPct = chart.sectors.reduce((sum, s) => sum + s.sharePercent, 0);
    assert.ok(Math.abs(totalPct - 100) <= 0.15, `${chart.country} sums to 100%`);
  }

  const vn = charts.find((c) => c.country === 'Việt Nam');
  assert.equal(vn?.dataYear, '2023');
  assert.equal(
    vn?.sectors.find((s) => s.name === 'Cơ khí, điện tử & vận tải')?.sharePercent,
    29.9
  );

  const sg = charts.find((c) => c.country === 'Singapore');
  assert.equal(sg?.dataYear, '2023');
  assert.equal(sg?.dominantPercent, 58.8);

  const idn = charts.find((c) => c.country === 'Indonesia');
  assert.equal(
    idn?.sectors.find((s) => s.name === 'Thực phẩm & đồ uống')?.sharePercent,
    28.6
  );
});

test('10-country pie chart dataset strictly reflects SGK Hình 12.3 industry counts', () => {
  const slices = getCountryPieData();
  assert.equal(slices.length, 10);

  const vietnam = slices.find((s) => s.country === 'Việt Nam');
  const singapore = slices.find((s) => s.country === 'Singapore');
  const laos = slices.find((s) => s.country === 'Lào');

  assert.equal(vietnam?.industryCount, 6);
  assert.equal(singapore?.industryCount, 3);
  assert.equal(laos?.industryCount, 2);

  const totalSweep = slices.reduce((sum, s) => sum + (s.endAngle - s.startAngle), 0);
  assert.ok(Math.abs(totalSweep - 360) < 0.001, `Expected 360deg sweep, got ${totalSweep}`);
});

test('each center resolves strictly its own SGK industry photographs', () => {
  const singapore = getCenterById('singapore')!;
  const bangkok = getCenterById('bang-coc')!;
  const vientiane = getCenterById('vieng-chan')!;
  const kl = getCenterById('kuala-lumpur')!;

  assert.deepEqual(
    getIndustryPhotosForCenter(singapore).map((p) => p.key),
    ['petrochemical', 'electronics', 'shipbuilding']
  );

  assert.deepEqual(
    getIndustryPhotosForCenter(bangkok).map((p) => p.key),
    ['textile', 'automotive', 'electronics']
  );

  assert.deepEqual(
    getIndustryPhotosForCenter(vientiane).map((p) => p.key),
    ['wood', 'food']
  );

  assert.deepEqual(
    getIndustryPhotosForCenter(kl).map((p) => p.key),
    ['automotive', 'petrochemical', 'electronics', 'mining']
  );
});

test('presentation contains strictly 6 slides', () => {
  assert.equal(TOTAL_SLIDES, 6);
  assert.equal(SLIDES_META.length, 6);
  assert.equal(SLIDES_META[0].code, '01');
  assert.equal(SLIDES_META[5].code, '06');
});

test('all 11 SGK industrial centers exist with valid Southeast Asia coordinates', () => {
  assert.equal(INDUSTRIAL_CENTERS.length, 11);

  const expectedCities = [
    'Hà Nội',
    'Thành phố Hồ Chí Minh',
    'Băng Cốc',
    'Viêng Chăn',
    'Phnôm Pênh',
    'Yangon',
    'Kuala Lumpur',
    'Singapore',
    'Jakarta',
    'Manila',
    'Dili',
  ];

  const actualCities = INDUSTRIAL_CENTERS.map((c) => c.city);
  assert.deepEqual(actualCities, expectedCities);

  for (const center of INDUSTRIAL_CENTERS) {
    const [lon, lat] = center.coordinates;
    assert.ok(lon >= 92 && lon <= 130, `Longitude out of SEA range for ${center.city}: ${lon}`);
    assert.ok(lat >= -11 && lat <= 24, `Latitude out of SEA range for ${center.city}: ${lat}`);
    assert.ok(center.industries.length >= 2, `Missing industries for ${center.city}`);
  }
});

test('Mainland and Maritime Southeast Asia splits match SGK Hình 12.3', () => {
  assert.equal(MAINLAND_COUNTRIES.length, 5);
  assert.deepEqual(
    MAINLAND_COUNTRIES.map((c) => c.country),
    ['Việt Nam', 'Thái Lan', 'Lào', 'Campuchia', 'Myanmar']
  );
  assert.deepEqual(MAINLAND_COUNTRIES[0].centerIds, ['ha-noi', 'tp-hcm']);

  assert.equal(MARITIME_COUNTRIES.length, 5);
  assert.deepEqual(
    MARITIME_COUNTRIES.map((c) => c.country),
    ['Malaysia', 'Singapore', 'Indonesia', 'Philippines', 'Đông Timor']
  );

  // Verify every referenced centerId resolves cleanly
  for (const group of [...MAINLAND_COUNTRIES, ...MARITIME_COUNTRIES]) {
    for (const cid of group.centerIds) {
      const found = getCenterById(cid);
      assert.ok(found, `Center ${cid} not found`);
      assert.equal(found.region, group.region);
    }
  }
});

test('Slide 5 industry structure has 5 groups and Slide 6 has 3 summary points', () => {
  assert.equal(INDUSTRY_GROUPS.length, 5);
  assert.equal(SUMMARY_POINTS.length, 3);
  assert.deepEqual(
    SUMMARY_POINTS.map((p) => p.title),
    ['Phân bố', 'Cơ cấu', 'Trung tâm tiêu biểu']
  );
});

test('navigation helpers clamp bounds and format 01/06 through 06/06', () => {
  assert.equal(clampSlide(-3), 0);
  assert.equal(clampSlide(99), 5);
  assert.equal(prevSlide(0), 0);
  assert.equal(prevSlide(3), 2);
  assert.equal(nextSlide(0), 1);
  assert.equal(nextSlide(5), 5);

  assert.equal(formatSlideNumber(0), '01/06');
  assert.equal(formatSlideNumber(2), '03/06');
  assert.equal(formatSlideNumber(5), '06/06');

  assert.equal(getProgressPercent(0), 17);
  assert.equal(getProgressPercent(5), 100);
});
