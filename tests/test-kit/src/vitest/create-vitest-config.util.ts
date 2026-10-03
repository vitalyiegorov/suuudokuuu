import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const progressSourceEntry = fileURLToPath(new URL('../../../../packages/progress/src/index.ts', import.meta.url));

export const createVitestConfig = () =>
    defineConfig({
        resolve: {
            alias: { '@suuudokuuu/progress': progressSourceEntry }
        },
        test: {
            include: ['test/**/*.test.ts'],
            testTimeout: 60_000
        }
    });
