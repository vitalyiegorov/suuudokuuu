import { describe, expect, it } from '@jest/globals';

import { ReplayControlsStyles } from './replay-controls.styles';

describe('ReplayControlsStyles', () => {
    it('should lay the replay navigation controls out in a centred horizontal row', () => {
        expect.assertions(3);

        expect(ReplayControlsStyles.controlsRow.flexDirection).toBe('row');
        expect(ReplayControlsStyles.controlsRow.alignItems).toBe('center');
        expect(ReplayControlsStyles.controlsRow.justifyContent).toBe('center');
    });
});
