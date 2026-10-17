import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeRegistry from './ThemeRegistry';
import BmiApp from './BmiApp';

const downloadBmiReport = vi.fn();
vi.mock('@/lib/report', () => ({ downloadBmiReport: (...args: unknown[]) => downloadBmiReport(...args) }));

const setup = () => {
  const user = userEvent.setup();
  render(
    <ThemeRegistry>
      <BmiApp />
    </ThemeRegistry>,
  );
  return { user };
};

describe('BmiApp', () => {
  it('shows the default result matching the mock', () => {
    setup();
    expect(screen.getByRole('heading', { name: 'Your Health, Made Simple' })).toBeInTheDocument();
    expect(screen.getByTestId('bmi-value')).toHaveTextContent('17.3');
    expect(screen.getByTestId('bmi-category')).toHaveTextContent('Underweight');
    expect(screen.getByTestId('bmr')).toHaveTextContent('1428 kcal/day');
    expect(screen.getByTestId('hydration')).toHaveTextContent('1.75 L/day');
    expect(screen.getByText('Greek yogurt + granola')).toBeInTheDocument();
  });

  it('recalculates when the user submits new values', async () => {
    const { user } = setup();
    const weight = screen.getByLabelText('Weight in kilograms');
    await user.clear(weight);
    await user.type(weight, '80');
    await user.click(screen.getByRole('button', { name: /calculate bmi/i }));

    expect(screen.getByTestId('bmi-value')).toHaveTextContent('27.7');
    expect(screen.getByTestId('bmi-category')).toHaveTextContent('Overweight');
    expect(screen.getByText(/gradual weight loss/)).toBeInTheDocument();
  });

  it('shows validation errors for invalid input', async () => {
    const { user } = setup();
    await user.clear(screen.getByLabelText('Height in centimeters'));
    await user.click(screen.getByRole('button', { name: /calculate bmi/i }));
    expect(screen.getByText('Enter a valid height')).toBeInTheDocument();
    expect(screen.getByTestId('bmi-value')).toHaveTextContent('17.3');
  });

  it('converts values when switching to imperial units', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Imperial (lb, ft)' }));
    expect(screen.getByLabelText('Height in feet')).toHaveValue(5);
    expect(screen.getByLabelText('Height in inches')).toHaveValue(7);
    expect(screen.getByLabelText('Weight in pounds')).toHaveValue(110.2);
  });

  it('switches wellness plan tabs and opens details', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('tab', { name: 'Activity' }));
    expect(screen.getByText('Strength training')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'View details: Strength training' }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText(/Compound moves/)).toBeInTheDocument();
  });

  it('shows a Cut back tab with foods to limit for weight-loss results', async () => {
    const { user } = setup();
    expect(screen.queryByRole('tab', { name: 'Cut back' })).not.toBeInTheDocument();

    const weight = screen.getByLabelText('Weight in kilograms');
    await user.clear(weight);
    await user.type(weight, '80');
    await user.click(screen.getByRole('button', { name: /calculate bmi/i }));

    await user.click(screen.getByRole('tab', { name: 'Cut back' }));
    expect(screen.getByRole('button', { name: 'View details: Sugary drinks & sweets' })).toBeInTheDocument();
  });

  it('keeps inactive tab panels rendered but hidden so the card height stays constant', async () => {
    const { user } = setup();
    const panels = screen.getAllByRole('tabpanel', { hidden: true });
    expect(panels).toHaveLength(4);
    expect(panels.filter((p) => p.getAttribute('aria-hidden') === 'false')).toHaveLength(1);

    await user.click(screen.getByRole('tab', { name: 'Activity' }));
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'plan-panel-activity');
    expect(screen.getByRole('button', { name: 'View details: Walk 7,000 steps a day' })).toBeInTheDocument();
  });

  it("includes the user's name in the result and the PDF download", async () => {
    const { user } = setup();
    await user.type(screen.getByLabelText('Name'), 'Siva Prasad');
    await user.click(screen.getByRole('button', { name: /calculate bmi/i }));
    expect(screen.getByRole('heading', { name: "Siva's Result" })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /download pdf/i }));
    await vi.waitFor(() => expect(downloadBmiReport).toHaveBeenCalled());
    expect(downloadBmiReport.mock.lastCall![0].input.name).toBe('Siva Prasad');
  });

  it('asks for a name before downloading when none was entered', async () => {
    downloadBmiReport.mockClear();
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /download pdf/i }));

    const dialog = await screen.findByRole('dialog', { name: 'Add your name to the report' });
    expect(downloadBmiReport).not.toHaveBeenCalled();

    // An empty name is rejected
    await user.click(within(dialog).getByRole('button', { name: /download pdf/i }));
    expect(within(dialog).getByText('Please enter your name')).toBeInTheDocument();
    expect(downloadBmiReport).not.toHaveBeenCalled();

    await user.type(within(dialog).getByLabelText('Your name'), 'Asha Rao');
    await user.click(within(dialog).getByRole('button', { name: /download pdf/i }));

    await vi.waitFor(() => expect(downloadBmiReport).toHaveBeenCalledTimes(1));
    const [result, units] = downloadBmiReport.mock.calls[0];
    expect(result.bmi).toBe(17.3);
    expect(result.input.name).toBe('Asha Rao');
    expect(units).toBe('metric');

    // The name is carried back into the form and the result header
    expect(screen.getByLabelText('Name')).toHaveValue('Asha Rao');
    expect(screen.getByRole('heading', { name: "Asha's Result" })).toBeInTheDocument();
  });

  it('cancelling the name prompt does not download', async () => {
    downloadBmiReport.mockClear();
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /download pdf/i }));
    await user.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Cancel' }));
    expect(downloadBmiReport).not.toHaveBeenCalled();
  });

  it('opens WhatsApp with the share text', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /share on whatsapp/i }));
    expect(open).toHaveBeenCalledWith(expect.stringContaining('https://wa.me/?text='), '_blank', 'noopener,noreferrer');
    expect(decodeURIComponent(open.mock.calls[0][0] as string)).toContain('BMI: *17.3* (Underweight)');
  });
});
