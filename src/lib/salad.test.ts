import { describe, expect, it } from 'vitest';
import { evaluate } from './bmi';
import {
  DEFAULT_PROFILE,
  INGREDIENTS,
  SALAD_CATEGORIES,
  bowlTotals,
  defaultBowl,
  evaluateSalad,
  getIngredient,
  goalFor,
  liveTips,
  mealTarget,
  profileFromResult,
  recommendedFor,
  unitLabel,
  type Bowl,
} from './salad';

const underweight = profileFromResult(evaluate({ heightCm: 170, weightKg: 50, age: 28, gender: 'male' }));
const overweight = profileFromResult(evaluate({ heightCm: 170, weightKg: 85, age: 40, gender: 'male' }));

describe('ingredient catalogue', () => {
  it('offers several choices in every category the user asked for', () => {
    expect(SALAD_CATEGORIES.map((c) => c.key)).toEqual(['greens', 'vegetables', 'protein', 'fiber', 'seeds', 'dressing']);
    for (const c of SALAD_CATEGORIES) {
      expect(INGREDIENTS.filter((i) => i.category === c.key).length).toBeGreaterThanOrEqual(5);
    }
    expect(INGREDIENTS.some((i) => /greek yogurt/i.test(i.name))).toBe(true);
  });

  it('has unique ids', () => {
    expect(new Set(INGREDIENTS.map((i) => i.id)).size).toBe(INGREDIENTS.length);
  });

  it('throws for unknown ingredients', () => {
    expect(() => getIngredient('pizza')).toThrow(/Unknown ingredient/);
  });
});

describe('bowlTotals', () => {
  it('sums nutrition across portions', () => {
    expect(bowlTotals({ chicken: 1, spinach: 2, 'pumpkin-seeds': 2 })).toEqual({
      kcal: 281,
      protein: 38.2,
      carbs: 4.2,
      fat: 12.6,
      fiber: 2.6,
    });
  });

  it('ignores zero quantities', () => {
    expect(bowlTotals({ chicken: 0 }).kcal).toBe(0);
  });
});

describe('mealTarget', () => {
  it('raises the meal target for weight gain', () => {
    expect(goalFor(underweight.category)).toBe('gain');
    expect(mealTarget(underweight)).toEqual({ daily: 2399, kcal: { min: 648, target: 720, max: 792 }, protein: 27, fiber: 10 });
  });

  it('applies a calorie deficit for weight loss', () => {
    expect(goalFor(overweight.category)).toBe('lose');
    expect(mealTarget(overweight)).toEqual({ daily: 2005, kcal: { min: 540, target: 600, max: 660 }, protein: 34, fiber: 10 });
  });

  it('estimates from body weight when BMR is unknown', () => {
    expect(mealTarget(DEFAULT_PROFILE).kcal.target).toBe(600);
    expect(mealTarget(DEFAULT_PROFILE).protein).toBe(26);
  });
});

describe('recommendedFor', () => {
  it('favours lean items for weight loss and calorie-dense items for gain', () => {
    expect(recommendedFor(getIngredient('chicken'), 'lose')).toBe(true);
    expect(recommendedFor(getIngredient('olive-oil'), 'lose')).toBe(false);
    expect(recommendedFor(getIngredient('avocado'), 'gain')).toBe(true);
    expect(recommendedFor(getIngredient('olive-oil'), 'maintain')).toBe(false);
    expect(recommendedFor(getIngredient('spinach'), 'gain')).toBe(true);
  });
});

describe('unitLabel', () => {
  it('pluralises units naturally', () => {
    expect(unitLabel(1, 'cup')).toBe('cup');
    expect(unitLabel(3, 'cup')).toBe('cups');
    expect(unitLabel(2, 'tbsp')).toBe('tbsp');
    expect(unitLabel(2, 'half-cup')).toBe('servings');
  });
});

describe('liveTips', () => {
  const target = mealTarget(overweight);

  it('nudges towards a greens base when the bowl is empty', () => {
    expect(liveTips({}, target, 'lose')[0].message).toMatch(/base of greens/);
  });

  it('warns about portions above the limit for the goal', () => {
    const tips = liveTips({ spinach: 2, 'pumpkin-seeds': 3 }, target, 'lose');
    expect(tips[0]).toMatchObject({ severity: 'warning' });
    expect(tips.map((t) => t.message)).toContain('Seeds & nuts: 3 servings (153 kcal). For your goal, keep it to 1.');
  });

  it('flags oil dressings and doubled calorie-dense items for weight loss', () => {
    const msgs = liveTips({ 'olive-oil': 1, salmon: 2 }, target, 'lose').map((t) => t.message);
    expect(msgs).toContain('Olive oil & lemon adds 120 kcal per tbsp — Greek yogurt dressing has just 30.');
    expect(msgs).toContain('Grilled salmon is calorie-dense — 1 serving is enough for your goal.');
  });

  it('reports when the bowl is over or within the calorie range', () => {
    const balanced = { spinach: 2, tomato: 1, cucumber: 1, 'bell-pepper': 1, avocado: 1, salmon: 1, chickpeas: 1, 'pumpkin-seeds': 1, 'yogurt-dressing': 1 };
    expect(liveTips(balanced, target, 'lose')[0].message).toBe('Right in your 540–660 kcal range.');
    expect(liveTips({ salmon: 2, quinoa: 3, spinach: 1 }, target, 'lose')[0].message).toBe('96 kcal over your 600 kcal meal target.');
  });

  it('encourages healthy calories when gaining weight', () => {
    const msgs = liveTips({ spinach: 1 }, mealTarget(underweight), 'gain').map((t) => t.message);
    expect(msgs.some((m) => /add healthy calories like avocado/.test(m))).toBe(true);
  });
});

describe('defaultBowl', () => {
  const obese = profileFromResult(evaluate({ heightCm: 160, weightKg: 95, age: 45, gender: 'female' }));

  it.each([
    ['underweight', underweight],
    ['normal (no BMR)', DEFAULT_PROFILE],
    ['overweight', overweight],
    ['obese', obese],
  ])('fits the meal target and needs no changes for a %s user', (_, profile) => {
    const target = mealTarget(profile);
    const goal = goalFor(profile.category);
    const bowl = defaultBowl(target, goal);
    const { kcal } = bowlTotals(bowl);
    expect(kcal).toBeGreaterThanOrEqual(target.kcal.min);
    expect(kcal).toBeLessThanOrEqual(target.kcal.max);
    const ev = evaluateSalad(bowl, target, goal);
    expect(ev.status).toBe('on-target');
    expect(ev.drop).toEqual([]);
  });

  it('includes every food group the builder offers', () => {
    const bowl = defaultBowl(mealTarget(overweight), 'lose');
    const groups = new Set(Object.keys(bowl).map((id) => getIngredient(id).category));
    expect([...groups].sort()).toEqual(['dressing', 'fiber', 'greens', 'protein', 'seeds', 'vegetables']);
  });
});

describe('evaluateSalad', () => {
  it('tells an overweight user what to drop and swap in a heavy bowl', () => {
    const bowl: Bowl = { spinach: 2, tomato: 1, salmon: 1, quinoa: 2, 'pumpkin-seeds': 3, 'olive-oil': 2 };
    const ev = evaluateSalad(bowl, mealTarget(overweight), 'lose');

    expect(ev.status).toBe('over');
    expect(ev.totals.kcal).toBe(850);
    expect(ev.headline).toBe('250 kcal above your 600 kcal meal target');
    expect(ev.drop.map((s) => s.text)).toEqual([
      'Swap 2 tbsp of olive oil & lemon for 1 serving of greek yogurt herb dressing',
      'Cut quinoa from 2 servings to 1 serving',
      'Cut pumpkin seeds from 3 tbsp to 1 tbsp',
    ]);
    expect(ev.drop.map((s) => s.kcalDelta)).toEqual([-210, -111, -102]);
    expect(ev.add.map((s) => s.text)).toEqual([
      'Add cucumber (½ cup (52 g)) — colour, crunch and vitamins',
      'Swap quinoa for chickpeas — +3.6 g fibre',
    ]);
    expect(ev.adjustedKcal).toBe(458);
  });

  it('keeps the lean protein and drops the richer one when there are too many', () => {
    const ev = evaluateSalad({ spinach: 3, chicken: 1, eggs: 1 }, mealTarget(overweight), 'lose');
    expect(ev.drop[0].text).toBe('Drop the boiled eggs (1 serving)');
  });

  it('suggests nutrient-dense additions for an underweight user', () => {
    const ev = evaluateSalad({ spinach: 1, cucumber: 1 }, mealTarget(underweight), 'gain');
    expect(ev.status).toBe('under');
    expect(ev.drop).toEqual([]);
    const added = ev.add.map((s) => s.text).join('\n');
    expect(added).toMatch(/Add mixed greens/);
    expect(added).toMatch(/Add paneer cubes .*\+9 g protein to reach your 27 g goal/);
    expect(added).toMatch(/Add chickpeas .*\+6\.2 g fibre/);
    expect(added).toMatch(/Add avocado .*healthy weight gain/);
    expect(ev.adjustedKcal).toBeGreaterThan(ev.totals.kcal);
  });

  it('praises a balanced bowl with nothing to change', () => {
    const bowl: Bowl = {
      spinach: 2,
      tomato: 1,
      cucumber: 1,
      chicken: 1,
      chickpeas: 1,
      'pumpkin-seeds': 1,
      almonds: 1,
      avocado: 1,
      'yogurt-dressing': 1,
    };
    const ev = evaluateSalad(bowl, mealTarget(DEFAULT_PROFILE), 'maintain');
    expect(ev.status).toBe('on-target');
    expect(ev.headline).toBe('On target — 553 kcal is within your 540–660 kcal range');
    expect(ev.drop).toEqual([]);
    expect(ev.add).toEqual([]);
  });
});
