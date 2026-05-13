import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import ProjectSwitcher from '@/components/ProjectSwitcher';

describe('ProjectSwitcher', () => {
  it('renders all project names in the list', () => {
    render(<ProjectSwitcher />);
    const list = screen.getByRole('list');
    expect(within(list).getByText('Care Circle')).toBeInTheDocument();
    expect(within(list).getByText('Prism')).toBeInTheDocument();
    expect(within(list).getByText('DNS Case Study')).toBeInTheDocument();
  });

  it('marks Prism with "IN PROGRESS" suffix in the list', () => {
    render(<ProjectSwitcher />);
    const list = screen.getByRole('list');
    const prismItem = within(list).getByText('Prism').closest('li');
    expect(prismItem).toHaveTextContent(/in progress/i);
  });

  it('selects Care Circle by default and shows its details', () => {
    render(<ProjectSwitcher />);
    expect(screen.getByRole('heading', { name: /care circle/i })).toBeInTheDocument();
    expect(screen.getByText(/caregiving coordination app/i)).toBeInTheDocument();
  });

  it('clicking JobLink Log swaps the detail panel', async () => {
    const user = userEvent.setup();
    render(<ProjectSwitcher />);
    const list = screen.getByRole('list');
    await user.click(within(list).getByText('JobLink Log'));
    expect(screen.getByRole('heading', { name: /joblink log/i })).toBeInTheDocument();
    expect(screen.getByText(/job application tracker/i)).toBeInTheDocument();
  });

  it('hides View Live button on in-progress projects', async () => {
    const user = userEvent.setup();
    render(<ProjectSwitcher />);
    const list = screen.getByRole('list');
    await user.click(within(list).getByText('Prism'));
    expect(screen.queryByRole('link', { name: /view live/i })).not.toBeInTheDocument();
  });

  it('shows IN PROGRESS placeholder for in-progress projects', async () => {
    const user = userEvent.setup();
    render(<ProjectSwitcher />);
    const list = screen.getByRole('list');
    await user.click(within(list).getByText('Solace'));
    expect(screen.getByText(/^in progress$/i)).toBeInTheDocument();
    expect(screen.getByText(/screenshot coming soon/i)).toBeInTheDocument();
  });
});
