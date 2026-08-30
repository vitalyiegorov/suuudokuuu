import { describe, expect, it } from '@jest/globals';
import { i18n } from '@lingui/core';
import { StepScriptStepKindEnum } from '@suuudokuuu/field-core';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { gameGetStepNarration } from './game-get-step-narration.util';

import type { StepScriptStepType } from '@suuudokuuu/field-core';
import type { CellInterface } from '@suuudokuuu/generator';

const createRowCell = (x: number, value = 0): CellInterface => ({ x, y: 0, value, group: 0 });

const placement = { cell: createRowCell(4), value: 9 };
const narrationCells = Array.from({ length: 9 }, (_, x) => createRowCell(x));

const narrate = (step: StepScriptStepType, techniqueName = 'Naked Single'): string => i18n._(gameGetStepNarration(step, techniqueName));

describe('gameGetStepNarration', () => {
    it('explains a naked single by the digits the cell already sees', () => {
        expect.assertions(2);

        const narration = narrate({
            kind: StepScriptStepKindEnum.RevealCandidates,
            patternCells: narrationCells,
            candidates: [placement],
            narration: { technique: SolutionTechniqueEnum.NakedSingle, cells: narrationCells, values: [9], placement }
        });

        expect(narration).toContain('Naked Single');
        expect(narration).toContain('except 9');
    });

    it('explains a hidden single by its unit', () => {
        expect.assertions(2);

        const narration = narrate(
            {
                kind: StepScriptStepKindEnum.RevealCandidates,
                patternCells: narrationCells,
                candidates: [placement],
                narration: { technique: SolutionTechniqueEnum.HiddenSingle, cells: narrationCells, values: [9], placement }
            },
            'Hidden Single'
        );

        expect(narration).toContain('Hidden Single');
        expect(narration).toContain('row');
    });

    it('explains a full house by its nearly complete unit', () => {
        expect.assertions(2);

        const narration = narrate(
            {
                kind: StepScriptStepKindEnum.RevealCandidates,
                patternCells: narrationCells,
                candidates: [placement],
                narration: { technique: SolutionTechniqueEnum.FullHouse, cells: narrationCells, values: [9], placement }
            },
            'Full House'
        );

        expect(narration).toContain('Full House');
        expect(narration).toContain('one empty cell');
    });

    it('explains a generic placement without naming a unit', () => {
        expect.assertions(2);

        const narration = narrate(
            {
                kind: StepScriptStepKindEnum.RevealCandidates,
                patternCells: narrationCells,
                candidates: [placement],
                narration: { technique: SolutionTechniqueEnum.XYWing, cells: narrationCells, values: [9], placement }
            },
            'XY-Wing'
        );

        expect(narration).toContain('XY-Wing');
        expect(narration).toContain('only 9');
    });

    it('explains an elimination reveal by the pattern values', () => {
        expect.assertions(2);

        const narration = narrate(
            {
                kind: StepScriptStepKindEnum.RevealCandidates,
                patternCells: narrationCells,
                candidates: [...narrationCells.map(cell => ({ cell, value: 3 }))],
                narration: { technique: SolutionTechniqueEnum.NakedPair, cells: narrationCells, values: [3] }
            },
            'Naked Pair'
        );

        expect(narration).toContain('Naked Pair');
        expect(narration).toContain('3');
    });

    it('explains the strike step as eliminations in the marked cells', () => {
        expect.assertions(1);

        const narration = narrate(
            {
                kind: StepScriptStepKindEnum.StrikeCandidates,
                eliminations: [{ cell: createRowCell(2), value: 3 }],
                narration: { technique: SolutionTechniqueEnum.NakedPair, cells: [createRowCell(2)], values: [3] }
            },
            'Naked Pair'
        );

        expect(narration).toContain('out of the marked cells');
    });

    it('announces the placement on a place step', () => {
        expect.assertions(1);

        const narration = narrate({
            kind: StepScriptStepKindEnum.PlaceValue,
            placement,
            narration: { technique: SolutionTechniqueEnum.NakedSingle, cells: [placement.cell], values: [9], placement }
        });

        expect(narration).toContain('Place 9');
    });
});
