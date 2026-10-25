import { fileURLToPath } from 'node:url';

import { createVitestConfig } from '@suuudokuuu/test-kit/vitest';
import { mergeConfig } from 'vitest/config';

export default mergeConfig(createVitestConfig(), {
    resolve: {
        alias: [
            {
                find: /^@suuudokuuu\/field-core\/react$/u,
                replacement: fileURLToPath(new URL('../field-core/src/react/use-field-snapshot.hook.ts', import.meta.url))
            },
            { find: /^@suuudokuuu\/field-core$/u, replacement: fileURLToPath(new URL('../field-core/src/index.ts', import.meta.url)) },
            { find: /^@suuudokuuu\/generator$/u, replacement: fileURLToPath(new URL('../generator/src/index.ts', import.meta.url)) },
            { find: /^@suuudokuuu\/techniques$/u, replacement: fileURLToPath(new URL('../techniques/src/index.ts', import.meta.url)) },
            { find: /^@suuudokuuu\/solver-core$/u, replacement: fileURLToPath(new URL('../solver-core/src/index.ts', import.meta.url)) },
            {
                find: /^@suuudokuuu\/solver-bitmask$/u,
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
            exclude: ['src/index.ts', 'src/hooks/**'],
            thresholds: { statements: 99, branches: 94, lines: 99, functions: 100 }
        }
    }
});
