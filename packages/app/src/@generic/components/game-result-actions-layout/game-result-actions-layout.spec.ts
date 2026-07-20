import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('GameResultActionsLayout', () => {
    it('uses the theme background as an opaque action band behind fixed footer actions', () => {
        const source = readFileSync(join(__dirname, 'game-result-actions-layout.tsx'), 'utf8');

        expect(source).toContain('use(ThemeContext)');
        expect(source).toContain('backgroundColor: theme.colors.background');
        expect(source).toContain('<View style={actionBandStyles}>{children}</View>');
    });
});
