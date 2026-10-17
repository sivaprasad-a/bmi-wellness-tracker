import { cmToFeetInches, kgToLb, round, type UnitSystem } from './bmi';

export function formatHeight(cm: number, units: UnitSystem): string {
  if (units === 'imperial') {
    const { feet, inches } = cmToFeetInches(cm);
    return `${feet} ft ${inches} in`;
  }
  return `${round(cm, 1)} cm`;
}

export function formatWeight(kg: number, units: UnitSystem): string {
  return units === 'imperial' ? `${round(kgToLb(kg), 1)} lb` : `${round(kg, 1)} kg`;
}
