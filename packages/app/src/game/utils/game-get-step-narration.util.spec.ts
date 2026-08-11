import { describe, expect, it } from '@jest/globals';
import { i18n } from '@lingui/core';
import { StepScriptStepKindEnum } from '@suuudokuuu/field-core';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { gameGetStepNarration } from './game-get-step-narration.util';

import type { StepScriptStepType } from '@suuudokuuu/field-core';

const firstCell = { x: 1, y: 0, value: 0, group: 0 };
const secondCell = { x: 2, y: 0, value: 0, group: 0 };
const technique = SolutionTechniqueEnum.NakedPair;

const narrate = (step: StepScriptStepType): string => i18n._(gameGetStepNarration(step, 'Naked Pair'));

describe('gameGetStepNarration', () => {
    it('should name the technique and the pattern cells on a highlight step', () => {
        expect.assertions(3);

        const narration = narrate({
            kind: StepScriptStepKindEnum.Highlight,
            patternCells: [firstCell, secondCell],
            narration: { technique, cells: [firstCell, secondCell], values: [3, 7] }
        });

        expect(narration).toContain('Naked Pair');
        expect(narration).toContain('2 highlighted cells');
        expect(narration).toContain('3, 7');
    });

    it('should use the singular form for a single pattern cell', () => {
        expect.assertions(1);

        const narration = narrate({
            kind: StepScriptStepKindEnum.Highlight,
            patternCells: [firstCell],
            narration: { technique, cells: [firstCell], values: [5] }
        });

        expect(narration).toContain('1 highlighted cell');
    });

    it('should explain where the candidates live on a reveal step', () => {
        expect.assertions(1);

        const narration = narrate({
            kind: StepScriptStepKindEnum.RevealCandidates,
            patternCells: [firstCell, secondCell],
            values: [3, 7],
            narration: { technique, cells: [firstCell, secondCell], values: [3, 7] }
        });

        expect(narration).toContain('3, 7');
    });

    it('should explain the eliminations on a strike step', () => {
        expect.assertions(2);

        const narration = narrate({
            kind: StepScriptStepKindEnum.StrikeCandidates,
            eliminations: [{ cell: secondCell, value: 3 }],
            narration: { technique, cells: [secondCell], values: [3] }
        });

        expect(narration).toContain('1 other cell');
        expect(narration).toContain('3');
    });

    it('should announce the placement on a place step', () => {
        expect.assertions(1);

        const narration = narrate({
            kind: StepScriptStepKindEnum.PlaceValue,
            placement: { cell: firstCell, value: 4 },
            narration: { technique, cells: [firstCell], values: [4] }
        });

        expect(narration).toContain('4');
    });

    it('should produce a different sentence for every step kind', () => {
        expect.assertions(1);

        const narrations = new Set([
            narrate({
                kind: StepScriptStepKindEnum.Highlight,
                patternCells: [firstCell],
                narration: { technique, cells: [firstCell], values: [4] }
            }),
            narrate({
                kind: StepScriptStepKindEnum.RevealCandidates,
                patternCells: [firstCell],
                values: [4],
                narration: { technique, cells: [firstCell], values: [4] }
            }),
            narrate({
                kind: StepScriptStepKindEnum.StrikeCandidates,
                eliminations: [{ cell: firstCell, value: 4 }],
                narration: { technique, cells: [firstCell], values: [4] }
            }),
            narrate({
                kind: StepScriptStepKindEnum.PlaceValue,
                placement: { cell: firstCell, value: 4 },
                narration: { technique, cells: [firstCell], values: [4] }
            })
        ]);

        expect(narrations.size).toBe(4);
    });
});
