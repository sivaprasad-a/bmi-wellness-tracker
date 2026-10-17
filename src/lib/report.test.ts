import { describe, expect, it } from 'vitest';
import { evaluate } from './bmi';
import { createBmiReport, fileSafeName, reportFileName } from './report';
import { buildShareText, whatsappShareUrl } from './share';

const result = evaluate({ heightCm: 170, weightKg: 50, age: 28, gender: 'male' }, new Date(2026, 9, 17, 12));

/** Extracts the visible text from an uncompressed jsPDF document. */
function pdfText(doc: ReturnType<typeof createBmiReport>): string {
  const raw = doc.output();
  return Array.from(raw.matchAll(/\((.*?)\)\s*Tj/g), (m) => m[1]).join('\n');
}

describe('createBmiReport', () => {
  it('generates a valid PDF document', () => {
    const doc = createBmiReport(result);
    const raw = doc.output();
    expect(raw.startsWith('%PDF-')).toBe(true);
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
  });

  it("includes the user's BMI results and details", () => {
    const text = pdfText(createBmiReport(result));
    expect(text).toContain('BMI & Wellness Report');
    expect(text).toContain('17.3');
    expect(text).toContain('Underweight');
    expect(text).toContain('170 cm');
    expect(text).toContain('50 kg');
    expect(text).toContain('28 years');
    expect(text).toContain('1428 kcal/day');
    expect(text).toContain('1.75 L/day');
    expect(text).toContain('Calculated on Oct 17, 2026');
  });

  it('includes the wellness plan', () => {
    const text = pdfText(createBmiReport(result));
    expect(text).toContain('Your personalized wellness plan');
    expect(text).toContain('Greek yogurt + granola');
    expect(text).toContain('Strength training');
  });

  it('renders imperial units when requested', () => {
    const text = pdfText(createBmiReport(result, 'imperial'));
    expect(text).toContain('5 ft 7 in');
    expect(text).toContain('110.2 lb');
  });

  it('names the file by calculation date when no name is given', () => {
    expect(reportFileName(result)).toBe('BMI-Report_2026-10-17.pdf');
  });

  it("names the file with the user's name and date", () => {
    const named = evaluate({ ...result.input, name: 'Siva Prasad' }, result.calculatedAt);
    expect(reportFileName(named)).toBe('Siva-Prasad_BMI-Report_2026-10-17.pdf');
    const doc = createBmiReport(named);
    const text = pdfText(doc);
    expect(text).toContain('Prepared for Siva Prasad');
    expect(text).toMatch(/Name\nSiva Prasad/);
    expect(doc.output()).toContain('/Title (BMI Report - Siva Prasad)');
    expect(doc.output()).toContain('/Author (Siva Prasad)');
  });

  it('makes accented and punctuated names filesystem-safe', () => {
    expect(fileSafeName("Zoë O'Brien-Lée")).toBe('Zoe-O-Brien-Lee');
    expect(fileSafeName('  ')).toBe('');
  });

  it('includes the Cut back section for weight-loss results', () => {
    const r = evaluate({ heightCm: 170, weightKg: 85 }, result.calculatedAt);
    const text = pdfText(createBmiReport(r));
    expect(text).toContain('Cut back');
    expect(text).toContain('Sugary drinks & sweets');
    expect(text).toContain('Walk 12,000 steps a day');
  });
});

describe('share', () => {
  it('builds a WhatsApp message with the key results', () => {
    const text = buildShareText(result);
    expect(text).toContain('BMI: *17.3* (Underweight)');
    expect(text).toContain('BMR: 1428 kcal/day');
    expect(text).toContain('Daily step goal: 7,000 steps');
    const url = whatsappShareUrl(text);
    expect(url.startsWith('https://wa.me/?text=')).toBe(true);
    expect(decodeURIComponent(url.split('text=')[1])).toBe(text);
  });

  it('omits BMR when age/gender are not provided', () => {
    const r = evaluate({ heightCm: 170, weightKg: 50 });
    expect(buildShareText(r)).not.toContain('BMR');
  });
});
