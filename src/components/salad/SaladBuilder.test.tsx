import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeRegistry from '../ThemeRegistry';
import SaladBuilder from './SaladBuilder';
import { evaluate } from '@/lib/bmi';
import { saveLastResult } from '@/lib/storage';

const overweight = () => saveLastResult(evaluate({ name: 'Ravi Kumar', heightCm: 170, weightKg: 85, age: 40, gender: 'male' }));

const setup = async (personalised = true) => {
  if (personalised) overweight();
  const user = userEvent.setup();
  render(
    <ThemeRegistry>
      <SaladBuilder />
    </ThemeRegistry>,
  );
  if (personalised) await screen.findByText(/based on your BMI of/i);
  const panel = screen.getByRole('complementary', { name: 'Your bowl' });
  return { user, panel };
};

describe('SaladBuilder', () => {
  beforeEach(() => localStorage.clear());

  it('uses general targets and prompts for a BMI when none is stored', async () => {
    await setup(false);
    expect(screen.getByText(/Calculate your BMI first/)).toBeInTheDocument();
    expect(screen.getByText('Meal target 540–660 kcal')).toBeInTheDocument();
  });

  it('personalises targets and portion guidance from the stored BMI result', async () => {
    const { user } = await setup();
    expect(screen.getByText(/Ravi, based on your BMI of/)).toBeInTheDocument();
    expect(screen.getByText('29.4')).toBeInTheDocument();
    expect(screen.getByText('Meal target 540–660 kcal')).toBeInTheDocument();
    expect(screen.getByTestId('portion-guide')).toHaveTextContent('Pile them on');

    await user.click(screen.getByRole('tab', { name: /Seeds & nuts/ }));
    expect(screen.getByTestId('portion-guide')).toHaveTextContent('Just 1 tbsp');
  });

  it('starts with an editable recommended bowl inside the meal target', async () => {
    const { user, panel } = await setup();
    expect(screen.getByTestId('bowl-kcal')).toHaveTextContent('547');
    expect(within(panel).getByText('Grilled chicken')).toBeInTheDocument();
    expect(within(panel).getByText('Right in your 540–660 kcal range.')).toBeInTheDocument();
    expect(screen.queryByTestId('celebration')).not.toBeInTheDocument(); // defaults don't trigger confetti

    // Editable: adjust a default item
    await user.click(screen.getByRole('button', { name: 'Add one more Baby spinach' }));
    expect(screen.getByTestId('bowl-kcal')).toHaveTextContent('554');
  });

  it('Start over in the top bar restores the recommended bowl, with undo', async () => {
    const { user, panel } = await setup();
    await user.click(within(panel).getByRole('button', { name: 'Clear bowl' }));
    expect(screen.getByTestId('bowl-kcal')).toHaveTextContent('0');

    await user.click(screen.getByRole('button', { name: 'Start over' }));
    expect(screen.getByTestId('bowl-kcal')).toHaveTextContent('547');
    expect(screen.getByText('Started over with your recommended salad')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(screen.getByTestId('bowl-kcal')).toHaveTextContent('0');
  });

  it('remounts the carousel so each step starts from its first card', async () => {
    const { user } = await setup();
    const track = screen.getByLabelText('Greens options');
    track.scrollLeft = 300;
    await user.click(screen.getByRole('button', { name: /Next: Vegetables/ }));
    expect(screen.getByLabelText('Vegetables options').scrollLeft).toBe(0);
    expect(screen.queryByLabelText('Greens options')).not.toBeInTheDocument();
  });

  it('shows live portion warnings while adding', async () => {
    const { user } = await setup();
    await user.click(screen.getByRole('tab', { name: /Protein/ }));
    await user.click(screen.getByRole('button', { name: 'Add Grilled salmon' }));
    await user.click(screen.getByRole('button', { name: 'Add one more Grilled salmon' }));

    const tips = screen.getByLabelText('Portion tips');
    expect(within(tips).getByText(/Protein: 3 servings/)).toBeInTheDocument();
    expect(within(tips).getByText(/Grilled salmon is calorie-dense/)).toBeInTheDocument();
  });

  it('celebrates when the user brings the bowl back into the target range', async () => {
    const { user, panel } = await setup();
    await user.click(within(panel).getByRole('button', { name: 'Remove Grilled chicken from bowl' }));
    expect(screen.queryByTestId('celebration')).not.toBeInTheDocument(); // 382 kcal: below range

    await user.click(screen.getByRole('tab', { name: /Protein/ }));
    await user.click(screen.getByRole('button', { name: 'Add Grilled chicken' }));

    const party = await screen.findByTestId('celebration');
    expect(party).toHaveTextContent('Congratulations, Ravi!');
    expect(party).toHaveTextContent('547 kcal, right in your 540–660 kcal range');

    await user.click(party);
    expect(screen.queryByTestId('celebration')).not.toBeInTheDocument();
  });

  it('evaluates the salad and suggests what to drop and add', async () => {
    const { user, panel } = await setup();
    await user.click(within(panel).getByRole('button', { name: 'Clear bowl' }));

    await user.click(screen.getByRole('tab', { name: /Seeds & nuts/ }));
    await user.click(screen.getByRole('button', { name: 'Add Pumpkin seeds' }));
    await user.click(screen.getByRole('button', { name: 'Add one more Pumpkin seeds' }));
    await user.click(screen.getByRole('button', { name: 'Add one more Pumpkin seeds' }));
    await user.click(within(panel).getByRole('button', { name: 'Evaluate my salad' }));

    const evaluation = screen.getByRole('region', { name: 'Salad evaluation' });
    expect(within(evaluation).getByTestId('salad-headline')).toHaveTextContent('447 kcal below your 600 kcal meal target');
    expect(within(evaluation).getByText('Cut pumpkin seeds from 3 tbsp to 1 tbsp')).toBeInTheDocument();
    expect(within(evaluation).getByText(/Add baby spinach/)).toBeInTheDocument();
    expect(within(evaluation).getByText(/Add grilled chicken .*protein/)).toBeInTheDocument();
    expect(screen.queryByTestId('celebration')).not.toBeInTheDocument();

    await user.click(within(evaluation).getByRole('button', { name: 'Edit my salad' }));
    expect(screen.queryByRole('region', { name: 'Salad evaluation' })).not.toBeInTheDocument();
  });

  it('celebrates a perfect bowl on evaluation', async () => {
    const { user, panel } = await setup();
    await user.click(within(panel).getByRole('button', { name: 'Evaluate my salad' }));
    expect(within(screen.getByRole('region', { name: 'Salad evaluation' })).getByText(/Perfect bowl!/)).toBeInTheDocument();
    expect(await screen.findByTestId('celebration')).toBeInTheDocument();
  });
});
