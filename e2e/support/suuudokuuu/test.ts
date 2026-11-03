import { test as base } from '@e2e-dev/mobile';

import { Suuudokuuu } from './core.ts';

export const test = base.extend<{ suuudokuuu: Suuudokuuu }>({
    suuudokuuu: async ({ screen, app, device }, provide) => {
        await provide(new Suuudokuuu({ screen, app, device }));
    }
});
