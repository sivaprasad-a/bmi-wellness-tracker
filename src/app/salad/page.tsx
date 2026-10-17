import type { Metadata } from 'next';
import SaladBuilder from '@/components/salad/SaladBuilder';

export const metadata: Metadata = {
  title: 'Salad Prep | BMI & Wellness Tracker',
  description: 'Build your own salad and get portion and calorie advice tailored to your BMI.',
};

export default function SaladPage() {
  return <SaladBuilder />;
}
