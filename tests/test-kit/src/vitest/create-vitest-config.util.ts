import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const contractsSourceEntry = fileURLToPath(new URL('../../../../packages/contracts/src/index.ts', import.meta.url));

export const createVitestConfig = () =>
    defineConfig({
        resolve: {
            alias: { '@suuudokuuu/contracts': contractsSourceEntry }
        },
        test: {
            environment: 'node',
            include: ['test/**/*.test.ts']
        }
    });
