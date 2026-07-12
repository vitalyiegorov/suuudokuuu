import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('ReplayControlsStyles', () => {
    it('keeps replay navigation controls in a horizontal row', () => {
        const source = readFileSync(join(__dirname, 'replay-controls.styles.ts'), 'utf8');
        const controlsRowStartIndex = source.indexOf('controlsRow: {');
        const controlsRowEndIndex = source.indexOf('navButton: {');
        const controlsRowSource = source.slice(controlsRowStartIndex, controlsRowEndIndex);

        expect(controlsRowSource).toContain("flexDirection: 'row'");
        expect(controlsRowSource).toContain("alignItems: 'center'");
        expect(controlsRowSource).toContain("justifyContent: 'center'");
    });
});
