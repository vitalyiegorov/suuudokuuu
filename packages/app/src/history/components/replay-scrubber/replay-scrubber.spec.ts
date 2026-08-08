import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('ReplayScrubber', () => {
    const source = readFileSync(join(__dirname, 'replay-scrubber.tsx'), 'utf8');

    it('exposes adjustable accessibility semantics', () => {
        expect(source).toContain('accessibilityRole="adjustable"');
        expect(source).toContain('aria-valuemax={totalSteps}');
        expect(source).toContain('aria-valuemin={0}');
        expect(source).toContain('aria-valuenow={currentStep}');
        expect(source).toContain("{ name: 'increment' }");
        expect(source).toContain("{ name: 'decrement' }");
        expect(source).toContain('onAccessibilityAction={handleAccessibilityAction}');
    });

    it('drives scrubbing through the shared gesture detector pattern', () => {
        expect(source).toContain('GestureDetector');
        expect(source).toContain('useReplayScrubberGesture');
        expect(source).toContain('onLayout={handleRailLayout}');
        expect(source).toContain('testID={ReplayScrubberSelectors.Root}');
    });
});
