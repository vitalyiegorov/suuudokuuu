import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('GameResultActionsLayout', () => {
    it('docks a persistent home action beside the primary actions, matching the challenge footer chrome', () => {
        const source = readFileSync(join(__dirname, 'game-result-actions-layout.tsx'), 'utf8');

        expect(source).toContain('ScreenActionBar');
        expect(source).toContain('right={homeAction}');
        expect(source).toContain('<ScreenActionBar right={homeAction}>{children}</ScreenActionBar>');
    });
});
