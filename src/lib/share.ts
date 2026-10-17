import { formatDate, getCategoryInfo, stepGoal, type BmiResult, type UnitSystem } from './bmi';
import { formatHeight, formatWeight } from './format';

export function buildShareText(result: BmiResult, units: UnitSystem = 'metric'): string {
  const info = getCategoryInfo(result.category);
  const { min, max } = result.healthyWeightKg;
  const lines = [
    result.input.name ? `*${result.input.name}'s BMI Report* 🩺` : '*My BMI Report* 🩺',
    `Date: ${formatDate(result.calculatedAt)}`,
    `BMI: *${result.bmi.toFixed(1)}* (${info.label})`,
    `Height: ${formatHeight(result.input.heightCm, units)} · Weight: ${formatWeight(result.input.weightKg, units)}`,
    `Healthy weight range: ${formatWeight(min, units)} – ${formatWeight(max, units)}`,
    result.bmrKcal ? `BMR: ${result.bmrKcal} kcal/day` : null,
    `Hydration target: ${result.hydrationLiters} L/day`,
    `Daily step goal: ${stepGoal(result.bmi).target.toLocaleString('en-US')} steps`,
    '',
    'Calculated with BMI & Wellness Tracker',
  ];
  return lines.filter((l): l is string => l !== null).join('\n');
}

export const whatsappShareUrl = (text: string): string =>
  `https://wa.me/?text=${encodeURIComponent(text)}`;
