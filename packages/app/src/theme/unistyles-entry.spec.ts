import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('Unistyles Expo Router entry', () => {
    it('registers Expo Router before configuring the native Unistyles runtime', () => {
        const source = readFileSync(join(__dirname, '../../index.ts'), 'utf8');
        const routerEntryIndex = source.indexOf("import 'expo-router/entry';");
        const unistylesConfigIndex = source.indexOf("import './src/theme/unistyles.config';");

        expect(routerEntryIndex).toBeGreaterThanOrEqual(0);
        expect(unistylesConfigIndex).toBeGreaterThan(routerEntryIndex);
    });
});
