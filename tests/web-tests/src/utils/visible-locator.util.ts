import type { Locator, Page } from '@playwright/test';

export const getVisibleByTestId = (page: Page, testId: string): Locator => page.getByTestId(testId).filter({ visible: true });
