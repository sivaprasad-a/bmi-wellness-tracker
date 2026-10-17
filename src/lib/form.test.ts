import { describe, expect, it } from 'vitest';
import { DEFAULT_VALUES, isNumericInput, parseForm, switchUnits, validateName, type FormValues } from './form';

const metric = (patch: Partial<FormValues> = {}): FormValues => ({ ...DEFAULT_VALUES, ...patch });

describe('parseForm', () => {
  it('parses valid metric input', () => {
    const { input, errors } = parseForm(metric());
    expect(errors).toEqual({});
    expect(input).toEqual({ name: undefined, heightCm: 170, weightKg: 50, age: 28, gender: 'male' });
  });

  it('trims and collapses whitespace in the name', () => {
    expect(parseForm(metric({ name: '  Siva   Prasad ' })).input!.name).toBe('Siva Prasad');
    expect(parseForm(metric({ name: "Zoë O'Brien-Lée" })).input!.name).toBe("Zoë O'Brien-Lée");
  });

  it('rejects names with digits, symbols or that are too long', () => {
    expect(parseForm(metric({ name: 'R2D2' })).errors.name).toMatch(/letters/);
    expect(parseForm(metric({ name: '<script>' })).errors.name).toMatch(/letters/);
    expect(parseForm(metric({ name: 'a'.repeat(51) })).errors.name).toMatch(/50 characters/);
  });

  it('parses valid imperial input', () => {
    const { input } = parseForm(metric({ units: 'imperial', heightFt: '5', heightIn: '7', weight: '110' }));
    expect(input!.heightCm).toBeCloseTo(170.18, 2);
    expect(input!.weightKg).toBeCloseTo(49.9, 1);
  });

  it('treats age and gender as optional', () => {
    const { input, errors } = parseForm(metric({ age: '', gender: '' }));
    expect(errors).toEqual({});
    expect(input).toEqual({ name: undefined, heightCm: 170, weightKg: 50, age: undefined, gender: undefined });
  });

  it('reports errors for missing or out-of-range values', () => {
    const { input, errors } = parseForm(metric({ heightCm: '', weight: '1000', age: '200' }));
    expect(input).toBeNull();
    expect(errors.height).toMatch(/valid height/);
    expect(errors.weight).toMatch(/between 10 and 500 kg/);
    expect(errors.age).toMatch(/between 2 and 120/);
  });

  it('rejects inches of 12 or more', () => {
    const { errors } = parseForm(metric({ units: 'imperial', heightFt: '5', heightIn: '12' }));
    expect(errors.height).toBeDefined();
  });
});

describe('isNumericInput', () => {
  it.each([
    ['', 'decimal', true],
    ['170', 'decimal', true],
    ['72.', 'decimal', true],
    ['72.5', 'decimal', true],
    ['72.55', 'decimal', false],
    ['1700', 'decimal', false],
    ['7a', 'decimal', false],
    ['-5', 'decimal', false],
    ['1.2.3', 'decimal', false],
    [' 5', 'decimal', false],
    ['28', 'integer', true],
    ['2.8', 'integer', false],
  ] as const)('%j as %s → %s', (value, kind, ok) => {
    expect(isNumericInput(value, kind)).toBe(ok);
  });

  it('respects a custom digit limit', () => {
    expect(isNumericInput('1100', 'decimal', 4)).toBe(true);
    expect(isNumericInput('12', 'integer', 1)).toBe(false);
  });
});

describe('validateName', () => {
  it('only requires a name when asked to', () => {
    expect(validateName('')).toBeUndefined();
    expect(validateName('', true)).toBe('Please enter your name');
    expect(validateName('Asha Rao', true)).toBeUndefined();
  });
});

describe('switchUnits', () => {
  it('converts metric values to imperial', () => {
    const v = switchUnits(metric(), 'imperial');
    expect(v).toMatchObject({ units: 'imperial', heightFt: '5', heightIn: '7', weight: '110.2' });
  });

  it('converts imperial values back to metric', () => {
    const v = switchUnits(metric({ units: 'imperial', heightFt: '6', heightIn: '0', weight: '180' }), 'metric');
    expect(v).toMatchObject({ units: 'metric', heightCm: '183', weight: '81.6' });
  });

  it('is a no-op when units are unchanged', () => {
    const v = metric();
    expect(switchUnits(v, 'metric')).toBe(v);
  });
});
