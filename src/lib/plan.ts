import { stepGoal, walkingStats, type BmiCategory, type BmiResult } from './bmi';

export type PlanTab = 'nutrition' | 'cutback' | 'activity' | 'hydration' | 'tips';
export type Accent = 'blue' | 'amber' | 'purple' | 'green' | 'teal' | 'rose';

export interface PlanItem {
  id: string;
  title: string;
  description: string;
  details: string[];
  emoji: string;
  accent: Accent;
}

export interface PlanSection {
  key: PlanTab;
  label: string;
  items: PlanItem[];
}

export interface WellnessPlan {
  subtitle: string;
  goal: string;
  /** Ordered sections; "cutback" is only present for weight-loss categories. */
  tabs: PlanSection[];
}

export const PLAN_TABS: { key: PlanTab; label: string }[] = [
  { key: 'nutrition', label: 'Nutrition' },
  { key: 'cutback', label: 'Cut back' },
  { key: 'activity', label: 'Activity' },
  { key: 'hydration', label: 'Hydration' },
  { key: 'tips', label: 'Additional tips' },
];

const NUTRITION: Record<BmiCategory, PlanItem[]> = {
  underweight: [
    {
      id: 'yogurt',
      title: 'Greek yogurt + granola',
      description: 'Protein-rich breakfast to support healthy weight gain.',
      details: ['Full-fat Greek yogurt (200 g) with granola and berries', 'Add a drizzle of honey and chia seeds for extra calories', 'About 450 kcal and 20 g protein per bowl'],
      emoji: '🥣',
      accent: 'blue',
    },
    {
      id: 'toast',
      title: 'Nut butter on toast',
      description: 'Easy calorie-dense snack with healthy fats.',
      details: ['Whole-grain toast with 2 tbsp peanut or almond butter', 'Top with banana slices for natural sugars', 'Great as a mid-morning or pre-workout snack'],
      emoji: '🥜',
      accent: 'amber',
    },
    {
      id: 'smoothie',
      title: 'Avocado and smoothies',
      description: 'Nutrient-rich calories to increase daily energy intake.',
      details: ['Blend milk, oats, banana, avocado and a scoop of protein', 'Drink between meals so it does not replace food', 'Add avocado to salads, wraps and sandwiches'],
      emoji: '🥑',
      accent: 'purple',
    },
  ],
  normal: [
    {
      id: 'plate',
      title: 'Balanced plate',
      description: 'Half vegetables, a quarter protein, a quarter whole grains.',
      details: ['Fill half your plate with colourful vegetables', 'Choose lean protein: fish, poultry, legumes, tofu', 'Pick whole grains like brown rice, quinoa or millets'],
      emoji: '🥗',
      accent: 'green',
    },
    {
      id: 'fish',
      title: 'Omega-3 rich meals',
      description: 'Heart-healthy fats from fish, walnuts and flaxseeds.',
      details: ['Aim for two servings of oily fish per week', 'Vegetarian? Use walnuts, flax and chia seeds', 'Cook with olive or mustard oil in moderation'],
      emoji: '🐟',
      accent: 'blue',
    },
    {
      id: 'fruit',
      title: 'Fresh fruit snacks',
      description: 'Keep energy steady with fibre-rich natural snacks.',
      details: ['2–3 servings of whole fruit daily', 'Pair fruit with a handful of nuts for satiety', 'Limit packaged snacks and sugary drinks'],
      emoji: '🍎',
      accent: 'rose',
    },
  ],
  overweight: [
    {
      id: 'veggies',
      title: 'Veggie-first meals',
      description: 'High-volume, low-calorie foods that keep you full.',
      details: ['Start lunch and dinner with a salad or soup', 'Fill half of every plate with non-starchy vegetables', 'Reduces overall calorie intake without hunger'],
      emoji: '🥦',
      accent: 'green',
    },
    {
      id: 'protein',
      title: 'Lean protein at every meal',
      description: 'Protein preserves muscle and curbs cravings.',
      details: ['Eggs, dal, paneer, chicken, fish or tofu', 'Target 20–30 g protein per meal', 'Helps maintain metabolism while losing weight'],
      emoji: '🍳',
      accent: 'amber',
    },
    {
      id: 'grains',
      title: 'Whole grains & millets',
      description: 'Slow-digesting carbs give lasting energy and fewer cravings.',
      details: ['Oats, ragi, jowar, brown rice or quinoa', 'Keep grains to a quarter of your plate', 'Pair with protein and vegetables at every meal'],
      emoji: '🌾',
      accent: 'purple',
    },
  ],
  obesity: [
    {
      id: 'portion',
      title: 'Portion control',
      description: 'Smaller plates and mindful servings for steady progress.',
      details: ['Use a 9-inch plate to naturally reduce portions', 'Eat slowly and stop at 80% full', 'Aim for a modest deficit of ~500 kcal/day'],
      emoji: '🍽️',
      accent: 'blue',
    },
    {
      id: 'fiber',
      title: 'High-fibre foods',
      description: 'Legumes, oats and vegetables help control appetite.',
      details: ['Include beans, lentils or chickpeas daily', 'Oats or millets for breakfast keep you fuller', 'Target 25–35 g fibre per day'],
      emoji: '🫘',
      accent: 'amber',
    },
    {
      id: 'plan',
      title: 'Plan meals ahead',
      description: 'Prepared meals reduce impulsive, high-calorie choices.',
      details: ['Prep lunches for the week on weekends', 'Keep healthy snacks visible, treats out of sight', 'Consider guidance from a registered dietitian'],
      emoji: '📋',
      accent: 'purple',
    },
  ],
};

const ACTIVITY: Record<BmiCategory, PlanItem[]> = {
  underweight: [
    {
      id: 'strength',
      title: 'Strength training',
      description: 'Build lean muscle mass 3 times a week.',
      details: ['Compound moves: squats, push-ups, rows, lunges', 'Progressively increase weight or reps', 'Rest 48 hours between sessions for the same muscles'],
      emoji: '🏋️',
      accent: 'blue',
    },
    {
      id: 'yoga',
      title: 'Yoga & mobility',
      description: 'Improves appetite, flexibility and recovery.',
      details: ['20–30 minutes, 2–3 times a week', 'Focus on poses that build core strength', 'Supports stress reduction and better sleep'],
      emoji: '🧘',
      accent: 'purple',
    },
  ],
  normal: [
    {
      id: 'cardio',
      title: '150 minutes of cardio',
      description: 'Moderate activity across the week keeps your heart strong.',
      details: ['Brisk walking, cycling, swimming or dancing', 'Break it into 30 minutes, 5 days a week', 'Mix in some higher-intensity intervals'],
      emoji: '🚴',
      accent: 'green',
    },
    {
      id: 'strength',
      title: 'Strength twice a week',
      description: 'Maintain muscle and bone health.',
      details: ['Full-body routine with bodyweight or weights', 'Include core and balance exercises', '2 non-consecutive days per week'],
      emoji: '💪',
      accent: 'blue',
    },
  ],
  overweight: [
    {
      id: 'strength',
      title: 'Resistance training',
      description: 'Muscle burns more calories, even at rest.',
      details: ['2–3 sessions per week', 'Bodyweight squats, wall push-ups, resistance bands', 'Focus on good form before adding load'],
      emoji: '🏋️',
      accent: 'blue',
    },
    {
      id: 'swim',
      title: 'Low-impact cardio',
      description: 'Swimming and cycling are easy on the joints.',
      details: ['Try swimming, cycling or an elliptical', '20–40 minutes, 3 times a week', 'Increase intensity as fitness improves'],
      emoji: '🏊',
      accent: 'teal',
    },
  ],
  obesity: [
    {
      id: 'water',
      title: 'Water-based exercise',
      description: 'Aqua aerobics reduces stress on knees and back.',
      details: ['Water supports body weight, protecting joints', 'Try aqua walking or classes 2–3 times a week', 'Great for building stamina safely'],
      emoji: '🏊',
      accent: 'teal',
    },
    {
      id: 'chair',
      title: 'Seated strength',
      description: 'Chair exercises build strength with minimal strain.',
      details: ['Seated leg raises, arm presses, band rows', '2–3 times per week', 'Consult a doctor before starting a new program'],
      emoji: '🪑',
      accent: 'purple',
    },
  ],
};

const STEP_COPY: Record<BmiCategory, { description: string; tip: string }> = {
  underweight: {
    description: 'A gentle daily goal that keeps you active without burning too many calories.',
    tip: 'Refuel with a snack after longer walks',
  },
  normal: {
    description: 'A daily goal that keeps your heart healthy and your weight stable.',
    tip: 'Take the stairs and walk during calls to add steps',
  },
  overweight: {
    description: 'Brisk daily walking is one of the easiest ways to support weight loss.',
    tip: 'A 10–15 minute walk after meals helps control blood sugar',
  },
  obesity: {
    description: 'Build up gradually from a comfortable starting point to protect your joints.',
    tip: 'Split walks into short 10-minute sessions and wear supportive shoes',
  },
};

function stepsItem(result: BmiResult): PlanItem {
  const goal = stepGoal(result.bmi);
  const { km, minutes, kcal } = walkingStats(goal.target, result.input.heightCm, result.input.weightKg);
  const fmt = (n: number) => n.toLocaleString('en-US');
  const copy = STEP_COPY[result.category];
  return {
    id: 'steps',
    title: `Walk ${fmt(goal.target)} steps a day`,
    description: copy.description,
    details: [
      ...(goal.start < goal.target
        ? [`Start at ${fmt(goal.start)} steps/day and add ${fmt(goal.weeklyIncrease)} each week`]
        : []),
      `About ${km} km or ${minutes} minutes of walking for your height`,
      `Burns roughly ${kcal} kcal a day at your weight`,
      copy.tip,
    ],
    emoji: '👟',
    accent: 'green',
  };
}

function cutBack(result: BmiResult): PlanItem[] {
  const deficit = result.category === 'obesity' ? '500–750' : '300–500';
  return [
    {
      id: 'sugar',
      title: 'Sugary drinks & sweets',
      description: 'Cutting soda, juice and desserts can save 200–400 kcal a day.',
      details: [
        'Replace soda, packaged juice and sweetened coffee with water, lemon water or unsweetened tea',
        'Limit sweets, mithai, pastries and chocolate to once a week',
        'Watch hidden sugar in flavoured yogurt, cereals, ketchup and sauces',
      ],
      emoji: '🥤',
      accent: 'rose',
    },
    {
      id: 'fried',
      title: 'Fried & refined foods',
      description: 'Swap fried snacks, white bread and maida for whole foods.',
      details: [
        'Cut down on chips, samosas, pakoras, puris and french fries',
        'Replace white bread, maida, and excess white rice with whole grains or millets',
        'Bake, grill, steam or air-fry instead of deep-frying',
      ],
      emoji: '🍟',
      accent: 'amber',
    },
    {
      id: 'processed',
      title: 'Processed & late-night eating',
      description: `Removing these helps you reach a ${deficit} kcal daily deficit.`,
      details: [
        'Limit pizza, burgers, instant noodles and processed meats like sausages and salami',
        'Avoid eating within 2–3 hours of bedtime and mindless snacking in front of screens',
        'Cut back on alcohol, which adds empty calories and increases appetite',
      ],
      emoji: '🍔',
      accent: 'purple',
    },
  ];
}

function hydration(result: BmiResult): PlanItem[] {
  const liters = result.hydrationLiters;
  const glasses = Math.round((liters * 1000) / 250);
  return [
    {
      id: 'target',
      title: `Drink ${liters} L daily`,
      description: `That's about ${glasses} glasses of water spread through the day.`,
      details: ['Start your morning with a glass of water', 'Keep a reusable bottle within reach', 'Drink more in hot weather or when exercising'],
      emoji: '💧',
      accent: 'blue',
    },
    {
      id: 'foods',
      title: 'Water-rich foods',
      description: 'Cucumber, watermelon and oranges add hydration.',
      details: ['Fruits and vegetables are 80–95% water', 'Soups and buttermilk count towards fluids', 'Coconut water helps replenish electrolytes'],
      emoji: '🍉',
      accent: 'rose',
    },
    {
      id: 'remind',
      title: 'Hydration reminders',
      description: 'Build a habit with regular cues throughout the day.',
      details: ['Drink a glass before every meal', 'Set hourly reminders on your phone', 'Pale yellow urine indicates good hydration'],
      emoji: '⏰',
      accent: 'amber',
    },
  ];
}

const TIPS_BASE: PlanItem[] = [
  {
    id: 'sleep',
    title: 'Sleep 7–9 hours',
    description: 'Quality sleep regulates appetite hormones and recovery.',
    details: ['Keep a consistent sleep schedule', 'Avoid screens 1 hour before bed', 'Keep your bedroom cool and dark'],
    emoji: '😴',
    accent: 'purple',
  },
  {
    id: 'stress',
    title: 'Manage stress',
    description: 'Chronic stress affects eating habits and weight.',
    details: ['Practice 5–10 minutes of deep breathing daily', 'Spend time outdoors and with loved ones', 'Try journaling or meditation apps'],
    emoji: '🧠',
    accent: 'teal',
  },
];

const TIPS_CATEGORY: Record<BmiCategory, PlanItem> = {
  underweight: {
    id: 'track',
    title: 'Eat every 3–4 hours',
    description: 'Frequent meals make it easier to reach calorie goals.',
    details: ['Aim for 5–6 smaller meals a day', 'Track weight weekly, target 0.25–0.5 kg gain', 'See a doctor if weight loss is unexplained'],
    emoji: '📈',
    accent: 'green',
  },
  normal: {
    id: 'track',
    title: 'Monitor monthly',
    description: 'Check your BMI regularly to stay in the healthy range.',
    details: ['Weigh yourself at the same time of day', 'Annual health check-ups are recommended', 'Focus on how you feel, not just numbers'],
    emoji: '📊',
    accent: 'green',
  },
  overweight: {
    id: 'track',
    title: 'Set realistic goals',
    description: 'Aim to lose 0.5–1 kg per week for lasting results.',
    details: ['A 5–10% weight loss brings real health benefits', 'Log meals to stay aware of intake', 'Celebrate non-scale wins like energy and fitness'],
    emoji: '🎯',
    accent: 'green',
  },
  obesity: {
    id: 'track',
    title: 'Seek professional support',
    description: 'A doctor or dietitian can personalise your plan.',
    details: ['Get screened for blood pressure, sugar and cholesterol', 'Structured programs improve long-term success', 'Small, steady progress is the goal'],
    emoji: '🩺',
    accent: 'green',
  },
};

const SUBTITLES: Record<BmiCategory, { subtitle: string; goal: string }> = {
  underweight: {
    subtitle: 'Simple and practical suggestions to support healthy weight gain and overall well-being.',
    goal: 'Gain weight gradually through nutrient-dense foods and strength training.',
  },
  normal: {
    subtitle: 'Simple and practical suggestions to maintain your healthy weight and overall well-being.',
    goal: 'Maintain your healthy weight with balanced meals and regular activity.',
  },
  overweight: {
    subtitle: 'Simple and practical suggestions to support gradual weight loss and overall well-being.',
    goal: 'Lose weight gradually with mindful eating and consistent movement.',
  },
  obesity: {
    subtitle: 'Simple and practical suggestions to support safe, sustainable weight loss and overall well-being.',
    goal: 'Reduce weight safely with professional guidance, portion control and low-impact activity.',
  },
};

export const isWeightLoss = (category: BmiCategory): boolean => category === 'overweight' || category === 'obesity';

export function buildPlan(result: BmiResult): WellnessPlan {
  const { category } = result;
  const items: Record<PlanTab, PlanItem[]> = {
    nutrition: NUTRITION[category],
    cutback: isWeightLoss(category) ? cutBack(result) : [],
    activity: [stepsItem(result), ...ACTIVITY[category]],
    hydration: hydration(result),
    tips: [...TIPS_BASE, TIPS_CATEGORY[category]],
  };
  return {
    ...SUBTITLES[category],
    tabs: PLAN_TABS.filter((t) => items[t.key].length > 0).map((t) => ({ ...t, items: items[t.key] })),
  };
}
