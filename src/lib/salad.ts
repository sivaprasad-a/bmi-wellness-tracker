import { getCategory, type BmiCategory, type BmiResult, type Gender } from './bmi';

export type SaladCategory = 'greens' | 'vegetables' | 'protein' | 'fiber' | 'seeds' | 'dressing';
export type Goal = 'gain' | 'maintain' | 'lose';
type Tag = 'lean' | 'dense' | 'oil';

export interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  category: SaladCategory;
  /** Human-readable size of one portion, e.g. "1 cup (30 g)". */
  portion: string;
  /** Short unit used in sentences, e.g. "tbsp", "cup", "portion". */
  unit: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  tags?: Tag[];
}

export interface SaladCategoryInfo {
  key: SaladCategory;
  label: string;
  emoji: string;
  blurb: string;
  accent: string;
  soft: string;
}

export const SALAD_CATEGORIES: SaladCategoryInfo[] = [
  { key: 'greens', label: 'Greens', emoji: '🥬', blurb: 'Start with a leafy base — high volume, almost no calories.', accent: '#15803D', soft: '#E6F6EC' },
  { key: 'vegetables', label: 'Vegetables', emoji: '🥕', blurb: 'Add colour, crunch, vitamins and minerals.', accent: '#C2410C', soft: '#FFF1E6' },
  { key: 'protein', label: 'Protein', emoji: '🍗', blurb: 'Keeps you full and protects muscle.', accent: '#B45309', soft: '#FEF5E4' },
  { key: 'fiber', label: 'Fibre & grains', emoji: '🫘', blurb: 'Legumes and whole grains for slow, steady energy.', accent: '#7C2D12', soft: '#F8EEE7' },
  { key: 'seeds', label: 'Seeds & nuts', emoji: '🌰', blurb: 'Healthy fats and crunch — small portions go a long way.', accent: '#92400E', soft: '#FBF3E6' },
  { key: 'dressing', label: 'Greek yogurt & dressings', emoji: '🥣', blurb: 'Finish with a creamy yogurt dressing or a light drizzle.', accent: '#1D4ED8', soft: '#EAF2FE' },
];

/** Approximate nutrition per portion (USDA-style reference values). */
export const INGREDIENTS: Ingredient[] = [
  // Greens
  { id: 'spinach', name: 'Baby spinach', emoji: '🥬', category: 'greens', portion: '1 cup (30 g)', unit: 'cup', kcal: 7, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7 },
  { id: 'romaine', name: 'Romaine lettuce', emoji: '🥗', category: 'greens', portion: '1 cup (47 g)', unit: 'cup', kcal: 8, protein: 0.6, carbs: 1.5, fat: 0.1, fiber: 1 },
  { id: 'kale', name: 'Kale', emoji: '🥦', category: 'greens', portion: '1 cup (21 g)', unit: 'cup', kcal: 9, protein: 0.6, carbs: 1.4, fat: 0.3, fiber: 0.9 },
  { id: 'arugula', name: 'Arugula (rocket)', emoji: '🌿', category: 'greens', portion: '1 cup (20 g)', unit: 'cup', kcal: 5, protein: 0.5, carbs: 0.7, fat: 0.1, fiber: 0.3 },
  { id: 'mixed-greens', name: 'Mixed greens', emoji: '🍃', category: 'greens', portion: '1 cup (35 g)', unit: 'cup', kcal: 9, protein: 0.8, carbs: 1.5, fat: 0.1, fiber: 1 },
  // Vegetables
  { id: 'tomato', name: 'Cherry tomatoes', emoji: '🍅', category: 'vegetables', portion: '½ cup (75 g)', unit: 'half-cup', kcal: 13, protein: 0.7, carbs: 2.9, fat: 0.2, fiber: 0.9 },
  { id: 'cucumber', name: 'Cucumber', emoji: '🥒', category: 'vegetables', portion: '½ cup (52 g)', unit: 'half-cup', kcal: 8, protein: 0.3, carbs: 1.9, fat: 0.1, fiber: 0.3 },
  { id: 'bell-pepper', name: 'Bell pepper', emoji: '🫑', category: 'vegetables', portion: '½ cup (75 g)', unit: 'half-cup', kcal: 20, protein: 0.7, carbs: 4.5, fat: 0.2, fiber: 1.6 },
  { id: 'carrot', name: 'Grated carrot', emoji: '🥕', category: 'vegetables', portion: '½ cup (55 g)', unit: 'half-cup', kcal: 23, protein: 0.5, carbs: 5.3, fat: 0.1, fiber: 1.5 },
  { id: 'broccoli', name: 'Broccoli florets', emoji: '🥦', category: 'vegetables', portion: '½ cup (45 g)', unit: 'half-cup', kcal: 15, protein: 1.3, carbs: 3, fat: 0.2, fiber: 1.2 },
  { id: 'beetroot', name: 'Beetroot', emoji: '🟣', category: 'vegetables', portion: '½ cup (68 g)', unit: 'half-cup', kcal: 29, protein: 1.1, carbs: 6.5, fat: 0.1, fiber: 1.9 },
  { id: 'red-onion', name: 'Red onion', emoji: '🧅', category: 'vegetables', portion: '¼ cup (40 g)', unit: 'quarter-cup', kcal: 16, protein: 0.4, carbs: 3.7, fat: 0, fiber: 0.7 },
  { id: 'avocado', name: 'Avocado', emoji: '🥑', category: 'vegetables', portion: '¼ avocado (50 g)', unit: 'quarter', kcal: 80, protein: 1, carbs: 4.3, fat: 7.4, fiber: 3.4, tags: ['dense'] },
  // Protein
  { id: 'chicken', name: 'Grilled chicken', emoji: '🍗', category: 'protein', portion: '100 g', unit: 'portion', kcal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, tags: ['lean'] },
  { id: 'eggs', name: 'Boiled eggs', emoji: '🥚', category: 'protein', portion: '2 eggs (100 g)', unit: 'portion', kcal: 155, protein: 12.6, carbs: 1.1, fat: 10.6, fiber: 0 },
  { id: 'tofu', name: 'Grilled tofu', emoji: '🧈', category: 'protein', portion: '100 g', unit: 'portion', kcal: 144, protein: 17, carbs: 3, fat: 8.7, fiber: 2.3, tags: ['lean'] },
  { id: 'tuna', name: 'Tuna (in water)', emoji: '🐟', category: 'protein', portion: '85 g', unit: 'portion', kcal: 99, protein: 22, carbs: 0, fat: 0.7, fiber: 0, tags: ['lean'] },
  { id: 'paneer', name: 'Paneer cubes', emoji: '🧀', category: 'protein', portion: '50 g', unit: 'portion', kcal: 133, protein: 9, carbs: 1.8, fat: 10, fiber: 0, tags: ['dense'] },
  { id: 'salmon', name: 'Grilled salmon', emoji: '🍣', category: 'protein', portion: '100 g', unit: 'portion', kcal: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, tags: ['dense'] },
  // Fibre & grains
  { id: 'chickpeas', name: 'Chickpeas', emoji: '🫘', category: 'fiber', portion: '½ cup (82 g)', unit: 'half-cup', kcal: 134, protein: 7.3, carbs: 22.5, fat: 2.1, fiber: 6.2 },
  { id: 'kidney-beans', name: 'Kidney beans', emoji: '🫘', category: 'fiber', portion: '½ cup (89 g)', unit: 'half-cup', kcal: 112, protein: 7.7, carbs: 20, fat: 0.4, fiber: 5.7 },
  { id: 'sprouts', name: 'Sprouted moong', emoji: '🌱', category: 'fiber', portion: '½ cup (52 g)', unit: 'half-cup', kcal: 16, protein: 1.6, carbs: 3.1, fat: 0.1, fiber: 0.9, tags: ['lean'] },
  { id: 'quinoa', name: 'Quinoa', emoji: '🍚', category: 'fiber', portion: '½ cup cooked (93 g)', unit: 'half-cup', kcal: 111, protein: 4.1, carbs: 19.7, fat: 1.8, fiber: 2.6 },
  { id: 'corn', name: 'Sweet corn', emoji: '🌽', category: 'fiber', portion: '½ cup (82 g)', unit: 'half-cup', kcal: 67, protein: 2.4, carbs: 15, fat: 1, fiber: 1.7 },
  { id: 'brown-rice', name: 'Brown rice', emoji: '🍙', category: 'fiber', portion: '½ cup cooked (98 g)', unit: 'half-cup', kcal: 108, protein: 2.5, carbs: 22.4, fat: 0.9, fiber: 1.8 },
  // Seeds & nuts
  { id: 'pumpkin-seeds', name: 'Pumpkin seeds', emoji: '🎃', category: 'seeds', portion: '1 tbsp (9 g)', unit: 'tbsp', kcal: 51, protein: 2.7, carbs: 1, fat: 4.4, fiber: 0.6 },
  { id: 'sunflower-seeds', name: 'Sunflower seeds', emoji: '🌻', category: 'seeds', portion: '1 tbsp (9 g)', unit: 'tbsp', kcal: 52, protein: 1.9, carbs: 1.8, fat: 4.6, fiber: 0.8 },
  { id: 'chia', name: 'Chia seeds', emoji: '⚫', category: 'seeds', portion: '1 tbsp (12 g)', unit: 'tbsp', kcal: 58, protein: 2, carbs: 5, fat: 3.7, fiber: 4.1 },
  { id: 'flax', name: 'Ground flaxseed', emoji: '🟤', category: 'seeds', portion: '1 tbsp (7 g)', unit: 'tbsp', kcal: 37, protein: 1.3, carbs: 2, fat: 3, fiber: 1.9 },
  { id: 'almonds', name: 'Sliced almonds', emoji: '🌰', category: 'seeds', portion: '1 tbsp (10 g)', unit: 'tbsp', kcal: 58, protein: 2.1, carbs: 2.2, fat: 5, fiber: 1.2 },
  { id: 'walnuts', name: 'Walnuts', emoji: '🥜', category: 'seeds', portion: '1 tbsp (7 g)', unit: 'tbsp', kcal: 46, protein: 1.1, carbs: 1, fat: 4.6, fiber: 0.5 },
  // Greek yogurt & dressings
  { id: 'yogurt-dressing', name: 'Greek yogurt herb dressing', emoji: '🥣', category: 'dressing', portion: '3 tbsp (45 g)', unit: 'serving', kcal: 30, protein: 4.5, carbs: 2, fat: 0.3, fiber: 0, tags: ['lean'] },
  { id: 'greek-yogurt', name: 'Full-fat Greek yogurt', emoji: '🍶', category: 'dressing', portion: '½ cup (100 g)', unit: 'half-cup', kcal: 97, protein: 9, carbs: 4, fat: 5, fiber: 0 },
  { id: 'hung-curd', name: 'Hung curd mint dip', emoji: '🌿', category: 'dressing', portion: '2 tbsp (30 g)', unit: 'serving', kcal: 28, protein: 2.6, carbs: 1.5, fat: 1.2, fiber: 0, tags: ['lean'] },
  { id: 'lemon-tahini', name: 'Lemon tahini', emoji: '🍋', category: 'dressing', portion: '1 tbsp (15 g)', unit: 'tbsp', kcal: 60, protein: 1.7, carbs: 2.1, fat: 5.4, fiber: 0.7 },
  { id: 'olive-oil', name: 'Olive oil & lemon', emoji: '🫒', category: 'dressing', portion: '1 tbsp (14 g)', unit: 'tbsp', kcal: 120, protein: 0, carbs: 0.3, fat: 13.5, fiber: 0, tags: ['oil'] },
  { id: 'honey-mustard', name: 'Honey mustard', emoji: '🍯', category: 'dressing', portion: '1 tbsp (16 g)', unit: 'tbsp', kcal: 70, protein: 0.2, carbs: 6, fat: 5, fiber: 0, tags: ['oil'] },
];

const BY_ID = new Map(INGREDIENTS.map((i) => [i.id, i]));
export const getIngredient = (id: string): Ingredient => {
  const item = BY_ID.get(id);
  if (!item) throw new Error(`Unknown ingredient: ${id}`);
  return item;
};
export const getSaladCategory = (key: SaladCategory) => SALAD_CATEGORIES.find((c) => c.key === key)!;

/** Ingredient id → number of portions. */
export type Bowl = Record<string, number>;

export interface Nutrition {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

const r1 = (n: number) => Math.round(n * 10) / 10;

export function bowlTotals(bowl: Bowl): Nutrition {
  const t = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  for (const [id, qty] of Object.entries(bowl)) {
    if (qty <= 0) continue;
    const i = getIngredient(id);
    t.kcal += i.kcal * qty;
    t.protein += i.protein * qty;
    t.carbs += i.carbs * qty;
    t.fat += i.fat * qty;
    t.fiber += i.fiber * qty;
  }
  return { kcal: Math.round(t.kcal), protein: r1(t.protein), carbs: r1(t.carbs), fat: r1(t.fat), fiber: r1(t.fiber) };
}

const entries = (bowl: Bowl) =>
  Object.entries(bowl)
    .filter(([, q]) => q > 0)
    .map(([id, qty]) => ({ item: getIngredient(id), qty }));

export const portionsIn = (bowl: Bowl, category: SaladCategory): number =>
  entries(bowl)
    .filter((e) => e.item.category === category)
    .reduce((n, e) => n + e.qty, 0);

/* ---------------------------------------------------------------- profile & targets */

export interface SaladProfile {
  bmi: number;
  category: BmiCategory;
  weightKg: number;
  bmrKcal: number | null;
  gender?: Gender;
  name?: string;
  /** False when no BMI result was available and generic defaults are used. */
  personalised: boolean;
}

export const DEFAULT_PROFILE: SaladProfile = {
  bmi: 22,
  category: 'normal',
  weightKg: 65,
  bmrKcal: null,
  personalised: false,
};

export const profileFromResult = (r: BmiResult): SaladProfile => ({
  bmi: r.bmi,
  category: getCategory(r.bmi),
  weightKg: r.input.weightKg,
  bmrKcal: r.bmrKcal,
  gender: r.input.gender,
  name: r.input.name,
  personalised: true,
});

export const goalFor = (category: BmiCategory): Goal =>
  category === 'underweight' ? 'gain' : category === 'normal' ? 'maintain' : 'lose';

export interface MealTarget {
  daily: number;
  kcal: { min: number; target: number; max: number };
  protein: number;
  fiber: number;
}

const CALORIE_ADJUST: Record<BmiCategory, number> = { underweight: 400, normal: 0, overweight: -400, obesity: -600 };
const PROTEIN_PER_KG: Record<BmiCategory, number> = { underweight: 1.6, normal: 1.2, overweight: 1.2, obesity: 1.0 };
/** Share of daily calories for a salad eaten as a main meal. */
const MEAL_SHARE = 0.3;
export const FIBER_PER_MEAL = 10;

export function mealTarget(p: SaladProfile): MealTarget {
  // Without age/gender, estimate BMR at ~22 kcal per kg of body weight.
  const bmr = p.bmrKcal ?? p.weightKg * 22;
  const floor = p.gender === 'male' ? 1500 : 1200;
  const daily = Math.max(floor, Math.round(bmr * 1.4 + CALORIE_ADJUST[p.category]));
  const target = Math.round((daily * MEAL_SHARE) / 10) * 10;
  return {
    daily,
    kcal: { min: Math.round(target * 0.9), target, max: Math.round(target * 1.1) },
    protein: Math.round((p.weightKg * PROTEIN_PER_KG[p.category]) / 3),
    fiber: FIBER_PER_MEAL,
  };
}

/* ---------------------------------------------------------------- portion guidance */

/** Maximum recommended portions per category for each goal (greens & vegetables are unlimited). */
export const PORTION_LIMITS: Record<Goal, Partial<Record<SaladCategory, number>>> = {
  gain: { protein: 2, fiber: 2, seeds: 3, dressing: 2 },
  maintain: { protein: 1, fiber: 1, seeds: 2, dressing: 1 },
  lose: { protein: 1, fiber: 1, seeds: 1, dressing: 1 },
};

const GUIDE: Record<SaladCategory, Record<Goal, string>> = {
  greens: {
    gain: 'Use 1–2 cups as a base, leaving room for calorie-rich toppings.',
    maintain: 'Fill half the bowl — 2–3 cups.',
    lose: 'Pile them on — 3+ cups keep you full for very few calories.',
  },
  vegetables: {
    gain: 'Pick 2–3 colourful vegetables. Avocado is a great calorie boost.',
    maintain: 'Pick 2–4 colourful vegetables.',
    lose: 'Pick 3–4 vegetables; keep avocado to ¼.',
  },
  protein: {
    gain: 'Up to 2 portions — paneer, eggs or salmon add healthy calories.',
    maintain: '1 portion, about the size of your palm.',
    lose: '1 portion of lean protein — chicken, tofu, tuna or eggs.',
  },
  fiber: {
    gain: 'Up to 2 portions of legumes or grains.',
    maintain: '1 portion of legumes or whole grains.',
    lose: '1 portion; prefer legumes or sprouts over grains.',
  },
  seeds: {
    gain: '2–3 tbsp for healthy fats and extra calories.',
    maintain: '1–2 tbsp.',
    lose: 'Just 1 tbsp — seeds are calorie-dense.',
  },
  dressing: {
    gain: 'Olive oil, tahini or full-fat Greek yogurt are all welcome.',
    maintain: '1 serving; Greek yogurt dressings are the lightest.',
    lose: 'Choose Greek yogurt or hung curd over oil-based dressings.',
  },
};

export const portionGuide = (category: SaladCategory, goal: Goal): string => GUIDE[category][goal];

const GAIN_PICKS = new Set(['quinoa', 'chickpeas', 'eggs', 'greek-yogurt', 'olive-oil', 'lemon-tahini']);

/** Whether an ingredient is a particularly good fit for the user's goal (shown as a badge). */
export function recommendedFor(item: Ingredient, goal: Goal): boolean {
  const tags = item.tags ?? [];
  if (item.category === 'greens') return true;
  switch (goal) {
    case 'lose':
      return tags.includes('lean') || (item.category === 'vegetables' && !tags.includes('dense')) || (item.category === 'fiber' && item.fiber >= 5);
    case 'gain':
      return tags.includes('dense') || item.category === 'seeds' || GAIN_PICKS.has(item.id);
    case 'maintain':
      return !tags.includes('oil') && !tags.includes('dense') && (item.category !== 'protein' || tags.includes('lean'));
  }
}

export interface Tip {
  severity: 'success' | 'info' | 'warning';
  message: string;
}

/** Readable unit for a quantity, e.g. (2, 'cup') → "cups", (1, 'half-cup') → "serving". */
export function unitLabel(qty: number, unit: string): string {
  const one = qty === 1;
  switch (unit) {
    case 'tbsp':
      return 'tbsp';
    case 'cup':
      return one ? 'cup' : 'cups';
    case 'quarter':
      return one ? 'quarter' : 'quarters';
    default:
      return one ? 'serving' : 'servings';
  }
}

const fmtQty = (qty: number, unit: string) => `${qty} ${unitLabel(qty, unit)}`;

/** Live portion-control tips shown while the bowl is being built. */
export function liveTips(bowl: Bowl, target: MealTarget, goal: Goal): Tip[] {
  const items = entries(bowl);
  if (!items.length) {
    return [{ severity: 'info', message: 'Start with a base of greens — they are nearly calorie-free and fill you up.' }];
  }
  const totals = bowlTotals(bowl);
  const warnings: Tip[] = [];
  const others: Tip[] = [];

  for (const [cat, limit] of Object.entries(PORTION_LIMITS[goal]) as [SaladCategory, number][]) {
    const n = portionsIn(bowl, cat);
    if (n > limit) {
      const kcal = items.filter((e) => e.item.category === cat).reduce((s, e) => s + e.item.kcal * e.qty, 0);
      warnings.push({
        severity: 'warning',
        message: `${getSaladCategory(cat).label}: ${n} servings (${Math.round(kcal)} kcal). For your goal, keep it to ${limit}.`,
      });
    }
  }

  if (goal === 'lose') {
    for (const e of items) {
      if (e.item.tags?.includes('oil')) {
        warnings.push({
          severity: 'warning',
          message: `${e.item.name} adds ${e.item.kcal} kcal per ${unitLabel(1, e.item.unit)} — Greek yogurt dressing has just 30.`,
        });
      } else if (e.item.tags?.includes('dense') && e.qty > 1) {
        warnings.push({
          severity: 'warning',
          message: `${e.item.name} is calorie-dense — 1 ${unitLabel(1, e.item.unit)} is enough for your goal.`,
        });
      }
    }
  }

  if (portionsIn(bowl, 'greens') === 0) {
    others.push({ severity: 'info', message: 'Add a base of greens for volume with almost no calories.' });
  }

  if (totals.kcal > target.kcal.max) {
    warnings.unshift({ severity: 'warning', message: `${totals.kcal - target.kcal.max} kcal over your ${target.kcal.target} kcal meal target.` });
  } else if (totals.kcal >= target.kcal.min) {
    others.unshift({ severity: 'success', message: `Right in your ${target.kcal.min}–${target.kcal.max} kcal range.` });
  } else {
    others.push({
      severity: 'info',
      message:
        goal === 'gain'
          ? `${target.kcal.min - totals.kcal} kcal to go — add healthy calories like avocado, seeds or paneer.`
          : `${target.kcal.min - totals.kcal} kcal left before your meal target.`,
    });
  }

  if (totals.protein >= target.protein) others.push({ severity: 'success', message: `Protein goal met (${totals.protein} g).` });

  return [...warnings, ...others];
}

/* ---------------------------------------------------------------- recommended default bowl */

const BASE_BOWL: Record<Goal, Bowl> = {
  lose: { spinach: 2, 'mixed-greens': 1, tomato: 1, cucumber: 1, 'bell-pepper': 1, chicken: 1, chickpeas: 1, 'pumpkin-seeds': 1, 'yogurt-dressing': 1 },
  maintain: { spinach: 2, tomato: 1, cucumber: 1, carrot: 1, chicken: 1, chickpeas: 1, 'pumpkin-seeds': 1, 'yogurt-dressing': 1 },
  gain: { spinach: 1, 'mixed-greens': 1, tomato: 1, cucumber: 1, avocado: 1, paneer: 1, chickpeas: 1, 'pumpkin-seeds': 1, almonds: 1, 'greek-yogurt': 1 },
};

/** Ingredients used (in order) to top the base bowl up into the meal's calorie range. */
const TOP_UP: Record<Goal, string[]> = {
  lose: ['avocado', 'carrot', 'broccoli', 'beetroot', 'red-onion', 'sprouts'],
  maintain: ['avocado', 'almonds', 'beetroot', 'broccoli', 'bell-pepper'],
  gain: ['quinoa', 'eggs', 'sunflower-seeds', 'olive-oil', 'beetroot'],
};

/** A balanced starter salad sized to the user's meal target, which they can then edit. */
export function defaultBowl(target: MealTarget, goal: Goal): Bowl {
  const bowl: Bowl = { ...BASE_BOWL[goal] };
  const limits = PORTION_LIMITS[goal];
  for (const id of TOP_UP[goal]) {
    const kcal = bowlTotals(bowl).kcal;
    if (kcal >= target.kcal.min) break;
    const item = getIngredient(id);
    const limit = limits[item.category];
    const roomInCategory = limit === undefined || portionsIn(bowl, item.category) < limit;
    if (roomInCategory && kcal + item.kcal <= target.kcal.max) bowl[id] = (bowl[id] ?? 0) + 1;
  }
  return bowl;
}

/* ---------------------------------------------------------------- final evaluation */

export type SuggestionKind = 'drop' | 'reduce' | 'swap' | 'add';

export interface Suggestion {
  kind: SuggestionKind;
  text: string;
  kcalDelta: number;
}

export type SaladStatus = 'under' | 'on-target' | 'over';

export interface SaladEvaluation {
  totals: Nutrition;
  status: SaladStatus;
  headline: string;
  drop: Suggestion[];
  add: Suggestion[];
  /** Estimated calories after applying every suggestion. */
  adjustedKcal: number;
}

const LEAN_SWAP: Record<string, string> = { salmon: 'tuna', paneer: 'tofu', eggs: 'chicken', 'greek-yogurt': 'yogurt-dressing' };
const DROP_PRIORITY: SaladCategory[] = ['dressing', 'seeds', 'fiber', 'vegetables', 'protein'];
const PROTEIN_PICKS: Record<Goal, string[]> = {
  gain: ['paneer', 'eggs', 'salmon', 'chicken'],
  maintain: ['chicken', 'eggs', 'tofu', 'tuna'],
  lose: ['chicken', 'tuna', 'tofu', 'eggs'],
};
const FIBER_PICKS = ['chickpeas', 'kidney-beans', 'chia'];
const GAP_PICKS: Record<Goal, string[]> = {
  gain: ['avocado', 'quinoa', 'pumpkin-seeds', 'olive-oil', 'greek-yogurt', 'almonds'],
  maintain: ['quinoa', 'chickpeas', 'avocado', 'pumpkin-seeds'],
  lose: ['chickpeas', 'sprouts', 'eggs'],
};

export function evaluateSalad(bowl: Bowl, target: MealTarget, goal: Goal): SaladEvaluation {
  const totals = bowlTotals(bowl);
  const status: SaladStatus = totals.kcal < target.kcal.min ? 'under' : totals.kcal > target.kcal.max ? 'over' : 'on-target';
  const limits = PORTION_LIMITS[goal];
  const work: Bowl = Object.fromEntries(Object.entries(bowl).filter(([, q]) => q > 0));
  const drop: Suggestion[] = [];
  const add: Suggestion[] = [];
  const kcalOf = (b: Bowl) => bowlTotals(b).kcal;

  const reduce = (item: Ingredient, by: number) => {
    const qty = work[item.id];
    const left = qty - by;
    drop.push({
      kind: left === 0 ? 'drop' : 'reduce',
      text:
        left === 0
          ? `Drop the ${item.name.toLowerCase()} (${fmtQty(qty, item.unit)})`
          : `Cut ${item.name.toLowerCase()} from ${fmtQty(qty, item.unit)} to ${fmtQty(left, item.unit)}`,
      kcalDelta: -Math.round(item.kcal * by),
    });
    if (left === 0) delete work[item.id];
    else work[item.id] = left;
  };

  const swap = (from: Ingredient, to: Ingredient, list: Suggestion[] = drop, toQty = work[from.id], reason = '') => {
    const qty = work[from.id];
    const what =
      qty === 1 && toQty === 1
        ? `Swap ${from.name.toLowerCase()} for ${to.name.toLowerCase()}`
        : `Swap ${fmtQty(qty, from.unit)} of ${from.name.toLowerCase()} for ${fmtQty(toQty, to.unit)} of ${to.name.toLowerCase()}`;
    list.push({ kind: 'swap', text: reason ? `${what} — ${reason}` : what, kcalDelta: Math.round(to.kcal * toQty - from.kcal * qty) });
    delete work[from.id];
    work[to.id] = (work[to.id] ?? 0) + toQty;
  };

  const inCategory = (cat: SaladCategory) =>
    entries(work)
      .filter((e) => e.item.category === cat)
      .sort((a, b) => b.item.kcal - a.item.kcal);

  // 0. For weight loss, replace oil-based dressings with a single light yogurt dressing.
  if (goal === 'lose') {
    for (const { item, qty } of entries(work)) {
      if (item.tags?.includes('oil')) {
        swap(item, getIngredient('yogurt-dressing'), drop, Math.max(1, Math.min(qty, limits.dressing ?? qty)));
      }
    }
  }

  // 1. Bring each category within its recommended portion limit.
  for (const [cat, limit] of Object.entries(limits) as [SaladCategory, number][]) {
    let over = portionsIn(work, cat) - limit;
    const isLean = (i: Ingredient) => Number(!!i.tags?.includes('lean'));
    // Trim richer items before lean ones (stable sort keeps the kcal ordering within each group).
    const candidates = inCategory(cat).sort((a, b) => isLean(a.item) - isLean(b.item));
    for (const { item, qty } of candidates) {
      if (over <= 0) break;
      const by = Math.min(over, qty);
      reduce(item, by);
      over -= by;
    }
  }

  // 2. For weight loss, swap calorie-dense proteins for leaner ones while still above target.
  if (goal === 'lose') {
    for (const { item } of entries(work)) {
      if (item.category === 'protein' && LEAN_SWAP[item.id] && kcalOf(work) > target.kcal.target) {
        swap(item, getIngredient(LEAN_SWAP[item.id]));
      }
    }
  }

  // 3. Still above target? Trim the most calorific extras first.
  if (status === 'over') {
    for (const cat of DROP_PRIORITY) {
      for (const { item, qty } of inCategory(cat)) {
        const excess = kcalOf(work) - target.kcal.target;
        if (excess <= 0) break;
        if (cat === 'vegetables' && !item.tags?.includes('dense')) continue;
        // Keep at least one protein portion; swap instead when possible.
        if (cat === 'protein') {
          if (LEAN_SWAP[item.id]) swap(item, getIngredient(LEAN_SWAP[item.id]));
          else if (qty > 1) reduce(item, qty - 1);
          continue;
        }
        reduce(item, Math.min(qty, Math.ceil(excess / item.kcal)));
      }
    }
  }

  const suggestAdd = (item: Ingredient, reason: string) => {
    if (add.some((s) => s.text.includes(item.name))) return;
    add.push({ kind: 'add', text: `Add ${item.name.toLowerCase()} (${item.portion}) — ${reason}`, kcalDelta: item.kcal });
    work[item.id] = (work[item.id] ?? 0) + 1;
  };
  const hasRoom = (item: Ingredient) => {
    const limit = limits[item.category];
    return limit === undefined || portionsIn(work, item.category) < limit;
  };

  // 4. Fill nutritional gaps.
  if (portionsIn(work, 'greens') < 2) {
    suggestAdd(getIngredient(work['spinach'] ? 'mixed-greens' : 'spinach'), 'more volume for almost no calories');
  }
  const veg = entries(work).filter((e) => e.item.category === 'vegetables' && !e.item.tags?.includes('dense'));
  if (veg.length < 2) {
    const pick = ['tomato', 'cucumber', 'bell-pepper'].find((id) => !work[id])!;
    suggestAdd(getIngredient(pick), 'colour, crunch and vitamins');
  }
  if (bowlTotals(work).protein < target.protein * 0.8) {
    const pick = PROTEIN_PICKS[goal].map(getIngredient).find((i) => !work[i.id] && hasRoom(i))
      ?? PROTEIN_PICKS[goal].map(getIngredient).find(hasRoom);
    if (pick) suggestAdd(pick, `+${pick.protein} g protein to reach your ${target.protein} g goal`);
  }
  if (bowlTotals(work).fiber < target.fiber) {
    const pick = FIBER_PICKS.map(getIngredient).find((i) => !work[i.id] && hasRoom(i));
    if (pick) suggestAdd(pick, `+${pick.fiber} g fibre to keep you full`);
    else {
      // Fibre slot is full: swap the lowest-fibre grain for a legume instead.
      const legume = getIngredient(FIBER_PICKS[0]);
      const low = inCategory('fiber')
        .filter((e) => e.item.id !== legume.id && e.item.fiber < legume.fiber)
        .sort((a, b) => a.item.fiber - b.item.fiber)[0];
      if (low) swap(low.item, legume, add, low.qty, `+${r1((legume.fiber - low.item.fiber) * low.qty)} g fibre`);
    }
  }
  // 5. Below the calorie range: suggest healthy calorie sources that fit the gap.
  for (const id of GAP_PICKS[goal]) {
    const gap = target.kcal.target - kcalOf(work);
    if (gap <= 40 || add.length >= 6) break;
    const item = getIngredient(id);
    if (!work[id] && hasRoom(item) && item.kcal <= gap + 60) {
      suggestAdd(item, goal === 'gain' ? 'nutrient-rich calories for healthy weight gain' : 'to reach your meal target');
    }
  }

  const adjustedKcal = kcalOf(work);
  const headline =
    status === 'over'
      ? `${totals.kcal - target.kcal.target} kcal above your ${target.kcal.target} kcal meal target`
      : status === 'under'
        ? `${target.kcal.target - totals.kcal} kcal below your ${target.kcal.target} kcal meal target`
        : `On target — ${totals.kcal} kcal is within your ${target.kcal.min}–${target.kcal.max} kcal range`;

  return { totals, status, headline, drop, add, adjustedKcal };
}
