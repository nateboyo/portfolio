import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BackgroundVideo from '@/components/BackgroundVideo';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

import { usePathname } from 'next/navigation';

describe('BackgroundVideo', () => {
  it('renders without dim class on the home route', () => {
    vi.mocked(usePathname).mockReturnValue('/');
    render(<BackgroundVideo />);
    const container = screen.getByTestId('bg-container');
    expect(container.className).not.toContain('subpageActive');
  });

  it('renders with dim class on subpage routes', () => {
    vi.mocked(usePathname).mockReturnValue('/projects');
    render(<BackgroundVideo />);
    const container = screen.getByTestId('bg-container');
    expect(container.className).toContain('subpageActive');
  });
});
