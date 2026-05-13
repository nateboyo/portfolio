import { test, expect } from '@playwright/test';

test('clicking Projects from home navigates to /projects and dims background', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation').getByText('Projects').click();
  await expect(page).toHaveURL(/\/projects$/);

  const bg = page.getByTestId('bg-container');
  await expect(bg).toHaveClass(/subpageActive/);
});

test('ESC key returns to home', async ({ page }) => {
  await page.goto('/about');
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/$/);
});

test('Project switcher updates detail panel without changing the route', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByRole('heading', { name: /care circle/i })).toBeVisible();

  await page.getByText('JobLink Log', { exact: true }).click();
  await expect(page.getByRole('heading', { name: /joblink log/i })).toBeVisible();
  await expect(page).toHaveURL(/\/projects$/);
});

test('In-progress projects hide the View Live button', async ({ page }) => {
  await page.goto('/projects');
  await page.getByText('Prism', { exact: false }).click();
  await expect(page.getByRole('link', { name: /view live/i })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /github/i })).toBeVisible();
});
