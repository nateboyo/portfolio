import { test, expect } from '@playwright/test';

const routes = [
  { path: '/', heading: null, menuItem: 'Nathan Garrovillas' },
  { path: '/projects', heading: 'Projects' },
  { path: '/about', heading: 'About' },
  { path: '/resume', heading: 'Resume' },
  { path: '/contact', heading: 'Contact' },
];

for (const { path, heading, menuItem } of routes) {
  test(`route ${path} loads without errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(path);
    await expect(page).toHaveURL(new RegExp(path.replace('/', '\\/') + '$'));

    if (heading) {
      await expect(page.getByRole('heading', { name: new RegExp(heading, 'i') })).toBeVisible();
    } else if (menuItem) {
      await expect(page.getByText(menuItem)).toBeVisible();
    }

    expect(errors).toEqual([]);
  });
}
