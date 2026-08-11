import type { Page } from '@playwright/test';

export const readBackdropFilterChanges = async (page: Page): Promise<string[]> =>
    page.evaluate(
        () =>
            new Promise<string[]>(resolve => {
                requestAnimationFrame(() => void requestAnimationFrame(() => void resolve([...window.backdropFilterChanges])));
            })
    );
