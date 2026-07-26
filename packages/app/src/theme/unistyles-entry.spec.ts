import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('Unistyles Expo Router entry', () => {
    it('configures the Unistyles runtime before registering Expo Router', () => {
        const source = readFileSync(join(__dirname, '../../index.ts'), 'utf8');
        const routerEntryIndex = source.indexOf("import 'expo-router/entry';");
        const unistylesConfigIndex = source.indexOf("import './src/theme/unistyles.config';");

        expect(unistylesConfigIndex).toBeGreaterThanOrEqual(0);
        expect(routerEntryIndex).toBeGreaterThan(unistylesConfigIndex);
    });
});
