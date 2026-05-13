import { describe, it, expect } from 'vitest';
import { projects } from '@/content/projects';

describe('projects data', () => {
  it('contains 7 projects', () => {
    expect(projects).toHaveLength(7);
  });

  it('marks Prism and Solace as in-progress', () => {
    const prism = projects.find(p => p.name === 'Prism');
    const solace = projects.find(p => p.name === 'Solace');
    expect(prism?.inProgress).toBe(true);
    expect(solace?.inProgress).toBe(true);
  });

  it('hides View Live for Prism, Solace, and DNS Case Study', () => {
    const hidden = projects.filter(p => p.noLive).map(p => p.name);
    expect(hidden).toEqual(['Prism', 'Solace', 'DNS Case Study']);
  });

  it('non-in-progress projects have an image path', () => {
    projects.filter(p => !p.inProgress).forEach(p => {
      expect(p.image).toMatch(/\/projects\/.+\.(png|jpg|webp)$/);
    });
  });
});
