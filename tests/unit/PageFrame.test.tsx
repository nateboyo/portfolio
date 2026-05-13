import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import PageFrame from '@/components/PageFrame';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe('PageFrame', () => {
  it('renders the heading and breadcrumb label', () => {
    render(<PageFrame title="Projects">content</PageFrame>);
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByText(/back/i)).toBeInTheDocument();
  });

  it('navigates home when ESC is pressed', async () => {
    const user = userEvent.setup();
    render(<PageFrame title="About">content</PageFrame>);
    await user.keyboard('{Escape}');
    expect(pushMock).toHaveBeenCalledWith('/');
  });
});
