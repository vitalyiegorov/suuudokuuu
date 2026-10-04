import { fileURLToPath } from 'node:url';

import { createVitestConfig } from '@suuudokuuu/test-kit/vitest';
import { mergeConfig } from 'vitest/config';

export default mergeConfig(createVitestConfig(), {
    resolve: {
        alias: [
            { find: /^@suuudokuuu\/generator$/, replacement: fileURLToPath(new URL('../generator/src/index.ts', import.meta.url)) },
            { find: /^@suuudokuuu\/techniques$/, replacement: fileURLToPath(new URL('../techniques/src/index.ts', import.meta.url)) },
            { find: /^@suuudokuuu\/solver-core$/, replacement: fileURLToPath(new URL('../solver-core/src/index.ts', import.meta.url)) },
            {
                find: /^@suuudokuuu\/solver-bitmask$/,
                replacement: fileURLToPath(new URL('../solver-bitmask/src/index.ts', import.meta.url))
            }
        ]
    },
    test: {
        include: ['test/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text-summary', 'lcov'],
            include: ['src/**/*.ts'],
            exclude: ['src/index.ts', 'src/react/**'],
            thresholds: { statements: 99, branches: 94, lines: 99, functions: 100 }
        }
    }
});
