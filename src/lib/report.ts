import { jsPDF } from 'jspdf';
import {
  CATEGORIES,
  HEALTHY_BMI,
  dateStamp,
  formatDate,
  getCategoryInfo,
  rangeBarFraction,
  type BmiResult,
  type UnitSystem,
} from './bmi';
import { formatHeight, formatWeight } from './format';
import { buildPlan } from './plan';

type RGB = [number, number, number];

const BRAND: RGB = [15, 118, 87];
const BRAND_SOFT: RGB = [232, 245, 239];
const TEXT: RGB = [17, 24, 39];
const MUTED: RGB = [100, 116, 139];
const BORDER: RGB = [226, 232, 240];

const hexToRgb = (hex: string): RGB => {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const capitalize = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** Turns a person's name into a filesystem-safe filename segment, e.g. "Siva Prasad" → "Siva-Prasad". */
export const fileSafeName = (name: string): string =>
  name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** "<Name>_BMI-Report_<YYYY-MM-DD>.pdf", or "BMI-Report_<date>.pdf" when no name was given. */
export const reportFileName = (result: BmiResult): string => {
  const name = fileSafeName(result.input.name ?? '');
  return `${name ? `${name}_` : ''}BMI-Report_${dateStamp(result.calculatedAt)}.pdf`;
};

export function createBmiReport(result: BmiResult, units: UnitSystem = 'metric'): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentW = pageW - margin * 2;
  const info = getCategoryInfo(result.category);
  const catColor = hexToRgb(info.color);
  const plan = buildPlan(result);
  const { input } = result;

  doc.setProperties({
    title: input.name ? `BMI Report - ${input.name}` : 'BMI Report',
    subject: `BMI & Wellness Report, ${formatDate(result.calculatedAt)}`,
    author: input.name ?? 'BMI & Wellness Tracker',
    creator: 'BMI & Wellness Tracker',
  });

  const setText = (color: RGB, size: number, style: 'normal' | 'bold' = 'normal') => {
    doc.setTextColor(...color);
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
  };

  // Header band
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, pageW, 34, 'F');
  setText([255, 255, 255], 20, 'bold');
  doc.text('BMI & Wellness Report', margin, 16);
  setText([209, 250, 229], 10);
  doc.text(input.name ? `Prepared for ${input.name}` : 'Your Health, Made Simple', margin, 24);
  doc.text(`Calculated on ${formatDate(result.calculatedAt)}`, pageW - margin, 24, { align: 'right' });

  let y = 44;

  // Details
  setText(TEXT, 13, 'bold');
  doc.text('Your details', margin, y);
  y += 4;
  const nameRowH = input.name ? 13 : 0;
  doc.setDrawColor(...BORDER);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentW, 18 + nameRowH, 3, 3, 'FD');
  if (input.name) {
    setText(MUTED, 8.5);
    doc.text('Name', margin + 6, y + 8.5);
    setText(TEXT, 12, 'bold');
    doc.text(input.name, margin + 22, y + 8.5);
    doc.setDrawColor(...BORDER);
    doc.line(margin + 6, y + nameRowH, pageW - margin - 6, y + nameRowH);
    y += nameRowH;
  }
  const details: [string, string][] = [
    ['Height', formatHeight(input.heightCm, units)],
    ['Weight', formatWeight(input.weightKg, units)],
    ['Age', input.age ? `${input.age} years` : 'Not provided'],
    ['Gender', input.gender ? capitalize(input.gender) : 'Not provided'],
  ];
  const colW = contentW / details.length;
  details.forEach(([label, value], i) => {
    const x = margin + 6 + i * colW;
    setText(MUTED, 8.5);
    doc.text(label, x, y + 7);
    setText(TEXT, 11, 'bold');
    doc.text(value, x, y + 13.5);
  });
  y += 28;

  // BMI result block
  doc.setFillColor(...BRAND_SOFT);
  doc.roundedRect(margin, y, contentW, 58, 4, 4, 'F');
  setText(MUTED, 10);
  doc.text('Your BMI', margin + 8, y + 10);
  setText(TEXT, 40, 'bold');
  doc.text(result.bmi.toFixed(1), margin + 8, y + 27);
  // Category pill
  doc.setFillColor(...hexToRgb(info.softColor));
  doc.roundedRect(margin + 8, y + 32, 38, 9, 4.5, 4.5, 'F');
  setText(catColor, 10, 'bold');
  doc.text(info.label, margin + 27, y + 38, { align: 'center' });
  setText(MUTED, 9);
  doc.text(`Healthy BMI range: ${HEALTHY_BMI.min} – ${HEALTHY_BMI.max}`, margin + 8, y + 50);

  // Range bar
  const barX = margin + 72;
  const barW = contentW - 80;
  const barY = y + 22;
  const segW = barW / CATEGORIES.length;
  CATEGORIES.forEach((c, i) => {
    doc.setFillColor(...hexToRgb(c.color));
    doc.rect(barX + i * segW + (i ? 0.6 : 0), barY, segW - (i < CATEGORIES.length - 1 ? 0.6 : 0), 4, 'F');
    const cx = barX + i * segW + segW / 2;
    setText(c.key === result.category ? hexToRgb(c.color) : TEXT, 8.5, c.key === result.category ? 'bold' : 'normal');
    doc.text(c.label, cx, barY + 11, { align: 'center' });
    setText(MUTED, 8);
    doc.text(c.rangeLabel.replace('≥', '>='), cx, barY + 16, { align: 'center' });
  });
  const markerX = barX + rangeBarFraction(result.bmi) * barW;
  doc.setFillColor(255, 255, 255);
  doc.circle(markerX, barY + 2, 3.2, 'F');
  doc.setFillColor(30, 41, 120);
  doc.circle(markerX, barY + 2, 2.2, 'F');
  setText(MUTED, 9);
  doc.text('Where you are on the BMI scale', barX, barY - 6);
  y += 66;

  // Metric cards
  const metrics: [string, string, string][] = [
    ['Healthy weight range', `${formatWeight(result.healthyWeightKg.min, units).split(' ')[0]} – ${formatWeight(result.healthyWeightKg.max, units)}`, 'For your height'],
    ['BMR', result.bmrKcal ? `${result.bmrKcal} kcal/day` : '—', result.bmrKcal ? 'Estimated daily needs' : 'Add age & gender'],
    ['Hydration target', `${result.hydrationLiters} L/day`, 'Water recommendation'],
    ['Category', info.label, `BMI ${info.rangeLabel.replace('≥', '>=')}`],
  ];
  const cardGap = 4;
  const cardW = (contentW - cardGap * 3) / 4;
  metrics.forEach(([label, value, sub], i) => {
    const x = margin + i * (cardW + cardGap);
    doc.setDrawColor(...BORDER);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, cardW, 24, 3, 3, 'FD');
    setText(MUTED, 8);
    doc.text(label, x + 4, y + 7);
    setText(TEXT, 11, 'bold');
    doc.text(value.replace('—', '-'), x + 4, y + 14);
    setText(MUTED, 7.5);
    doc.text(sub, x + 4, y + 20);
  });
  y += 34;

  // Wellness plan
  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - 22) {
      doc.addPage();
      y = 20;
    }
  };

  setText(TEXT, 13, 'bold');
  doc.text('Your personalized wellness plan', margin, y);
  y += 6;
  setText(MUTED, 9.5);
  const goalLines = doc.splitTextToSize(`Goal: ${plan.goal}`, contentW);
  doc.text(goalLines, margin, y);
  y += goalLines.length * 4.5 + 3;

  plan.tabs.forEach(({ label, items }) => {
    ensureSpace(20);
    doc.setFillColor(...BRAND);
    doc.rect(margin, y - 4, 1.4, 6, 'F');
    setText(BRAND, 11.5, 'bold');
    doc.text(label, margin + 4, y + 0.5);
    y += 7;

    items.forEach((item) => {
      const descLines = doc.splitTextToSize(item.description, contentW - 6);
      const details = item.details.map((d) => doc.splitTextToSize(d, contentW - 14) as string[]);
      const detailLineCount = details.reduce((n, lines) => n + lines.length, 0);
      ensureSpace(6 + descLines.length * 4.2 + detailLineCount * 4.2 + 3);
      setText(TEXT, 10, 'bold');
      doc.text(item.title, margin + 4, y);
      y += 4.8;
      setText(MUTED, 9);
      doc.text(descLines, margin + 4, y);
      y += descLines.length * 4.2;
      setText(TEXT, 9);
      // Bullet with a hanging indent so wrapped lines align under the text.
      details.forEach((lines) => {
        doc.text('•', margin + 8, y);
        doc.text(lines, margin + 11, y);
        y += lines.length * 4.2;
      });
      y += 3;
    });
    y += 2;
  });

  // Footer on every page
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setDrawColor(...BORDER);
    doc.line(margin, pageH - 16, pageW - margin, pageH - 16);
    setText(MUTED, 7.5);
    doc.text(
      'Disclaimer: BMI is a screening tool and does not diagnose body fat or health. Consult a healthcare professional for medical advice.',
      margin,
      pageH - 11,
      { maxWidth: contentW - 20 },
    );
    doc.text(`Page ${p} of ${pages}`, pageW - margin, pageH - 11, { align: 'right' });
  }

  return doc;
}

export function downloadBmiReport(result: BmiResult, units: UnitSystem = 'metric'): void {
  createBmiReport(result, units).save(reportFileName(result));
}
