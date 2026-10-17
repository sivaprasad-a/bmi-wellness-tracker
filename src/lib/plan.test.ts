import { describe, expect, it } from 'vitest';
import { evaluate } from './bmi';
import { buildPlan, type PlanTab, type WellnessPlan } from './plan';

const resultFor = (weightKg: number) => evaluate({ heightCm: 170, weightKg, age: 30, gender: 'female' });
const section = (plan: WellnessPlan, key: PlanTab) => plan.tabs.find((t) => t.key === key);

describe('buildPlan', () => {
  it.each([
    [50, /weight gain/],
    [65, /maintain your healthy weight/],
    [78, /gradual weight loss/],
    [100, /sustainable weight loss/],
  ])('weight %s kg gives a category-specific subtitle', (kg, pattern) => {
    expect(buildPlan(resultFor(kg)).subtitle).toMatch(pattern);
  });

  it('provides three suggestions in every tab', () => {
    for (const kg of [50, 65, 78, 100]) {
      for (const { items } of buildPlan(resultFor(kg)).tabs) {
        expect(items).toHaveLength(3);
        for (const item of items) {
          expect(item.title).toBeTruthy();
          expect(item.details.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('matches the mock nutrition cards for underweight users', () => {
    const titles = section(buildPlan(resultFor(50)), 'nutrition')!.items.map((i) => i.title);
    expect(titles).toEqual(['Greek yogurt + granola', 'Nut butter on toast', 'Avocado and smoothies']);
  });

  it('personalizes the hydration target', () => {
    expect(section(buildPlan(resultFor(50)), 'hydration')!.items[0].title).toBe('Drink 1.75 L daily');
  });
});

describe('cut back section', () => {
  it('is only included for weight-loss categories', () => {
    expect(section(buildPlan(resultFor(50)), 'cutback')).toBeUndefined();
    expect(section(buildPlan(resultFor(65)), 'cutback')).toBeUndefined();
    expect(section(buildPlan(resultFor(78)), 'cutback')).toBeDefined();
    expect(section(buildPlan(resultFor(100)), 'cutback')).toBeDefined();
  });

  it('appears right after Nutrition and lists foods to cut', () => {
    const plan = buildPlan(resultFor(78));
    expect(plan.tabs.map((t) => t.key)).toEqual(['nutrition', 'cutback', 'activity', 'hydration', 'tips']);
    const titles = section(plan, 'cutback')!.items.map((i) => i.title);
    expect(titles).toEqual(['Sugary drinks & sweets', 'Fried & refined foods', 'Processed & late-night eating']);
  });

  it('suggests a larger calorie deficit for obesity', () => {
    const desc = (kg: number) => section(buildPlan(resultFor(kg)), 'cutback')!.items[2].description;
    expect(desc(78)).toContain('300–500 kcal');
    expect(desc(100)).toContain('500–750 kcal');
  });
});

describe('step goal card', () => {
  const stepsCard = (kg: number) => section(buildPlan(resultFor(kg)), 'activity')!.items[0];

  it('leads the Activity tab with a BMI-based step target', () => {
    expect(stepsCard(50).title).toBe('Walk 7,000 steps a day'); // BMI 17.3
    expect(stepsCard(65).title).toBe('Walk 9,500 steps a day'); // BMI 22.5
    expect(stepsCard(78).title).toBe('Walk 11,000 steps a day'); // BMI 27.0
    expect(stepsCard(100).title).toBe('Walk 10,000 steps a day'); // BMI 34.6
  });

  it('includes a gradual ramp-up for higher BMIs', () => {
    expect(stepsCard(100).details[0]).toBe('Start at 5,000 steps/day and add 500 each week');
    expect(stepsCard(65).details[0]).not.toMatch(/^Start at/);
  });

  it('estimates distance, time and calories', () => {
    const details = stepsCard(78).details.join('\n');
    expect(details).toMatch(/About 7\.8 km or 110 minutes/);
    expect(details).toMatch(/Burns roughly 429 kcal/);
  });
});
