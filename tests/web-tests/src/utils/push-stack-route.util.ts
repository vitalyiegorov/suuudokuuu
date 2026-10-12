import type { Page } from '@playwright/test';

export const pushStackRoute = (page: Page, screenTestId: string, route: string, params: Record<string, string>): Promise<void> =>
    page.getByTestId(screenTestId).evaluate(
        (screen, destination) => {
            let fiber: unknown = Object.entries(screen).find(([key]) => key.startsWith('__reactFiber$'))?.[1] ?? null;

            while (typeof fiber === 'object' && fiber !== null) {
                const props = 'memoizedProps' in fiber ? fiber.memoizedProps : null;
                const navigation = typeof props === 'object' && props !== null && 'value' in props ? props.value : null;
                const push = typeof navigation === 'object' && navigation !== null && 'push' in navigation ? navigation.push : null;

                if (typeof push === 'function') {
                    push.call(navigation, destination.route, destination.params);

                    return;
                }

                fiber = 'return' in fiber ? fiber.return : null;
            }

            throw new Error('Screen has no stack navigation to push onto');
        },
        { route, params }
    );
