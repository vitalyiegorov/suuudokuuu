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
const narrationColumnCells = Array.from({ length: 9 }, (_, y) => ({ x: 4, y, value: 0, group: 1 }));
const narrationBoxCells = Array.from({ length: 9 }, (_, index) => ({ x: index % 3, y: Math.floor(index / 3), value: 0, group: 0 }));
const scatteredCells = narrationCells.map(cell => ({ x: cell.x, y: cell.x, group: Math.floor(cell.x / 3) }));

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

    it('explains a hidden single by its row, column, box, or fallback wording', () => {
        expect.assertions(4);

        const rowNarration = narrate(
            {
                kind: StepScriptStepKindEnum.RevealCandidates,
                patternCells: narrationCells,
                candidates: [placement],
                narration: { technique: SolutionTechniqueEnum.HiddenSingle, cells: narrationCells, values: [9], placement }
            },
            'Hidden Single'
        );

        expect(rowNarration).toContain('row');

        const columnNarration = narrate(
            {
                kind: StepScriptStepKindEnum.RevealCandidates,
                patternCells: narrationColumnCells,
                candidates: [placement],
                narration: { technique: SolutionTechniqueEnum.HiddenSingle, cells: narrationColumnCells, values: [9], placement }
            },
            'Hidden Single'
        );

        expect(columnNarration).toContain('column');

        const boxNarration = narrate(
            {
                kind: StepScriptStepKindEnum.RevealCandidates,
                patternCells: narrationBoxCells,
                candidates: [placement],
                narration: { technique: SolutionTechniqueEnum.HiddenSingle, cells: narrationBoxCells, values: [9], placement }
            },
            'Hidden Single'
        );

        expect(columnNarration).toContain('column');
        expect(boxNarration).toContain('box');
    });

    it('explains a hidden single generically when the cells form no unit', () => {
        expect.assertions(1);

        const narration = narrate(
            {
                kind: StepScriptStepKindEnum.RevealCandidates,
                patternCells: scatteredCells,
                candidates: [placement],
                narration: { technique: SolutionTechniqueEnum.HiddenSingle, cells: scatteredCells, values: [9], placement }
            },
            'Hidden Single'
        );

        expect(narration).toContain('leave only 9');
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

    it('explains a full house in a column and in a box', () => {
        expect.assertions(2);

        const columnNarration = narrate(
            {
                kind: StepScriptStepKindEnum.RevealCandidates,
                patternCells: narrationColumnCells,
                candidates: [placement],
                narration: { technique: SolutionTechniqueEnum.FullHouse, cells: narrationColumnCells, values: [9], placement }
            },
            'Full House'
        );

        expect(columnNarration).toContain('column');

        const boxNarration = narrate(
            {
                kind: StepScriptStepKindEnum.RevealCandidates,
                patternCells: narrationBoxCells,
                candidates: [placement],
                narration: { technique: SolutionTechniqueEnum.FullHouse, cells: narrationBoxCells, values: [9], placement }
            },
            'Full House'
        );

        expect(boxNarration).toContain('box');
    });

    it('falls back to the generic sentence when a unit technique names no unit', () => {
        expect.assertions(2);

        const narration = narrate(
            {
                kind: StepScriptStepKindEnum.RevealCandidates,
                patternCells: scatteredCells,
                candidates: [placement],
                narration: { technique: SolutionTechniqueEnum.HiddenSingle, cells: scatteredCells, values: [9], placement }
            },
            'Hidden Single'
        );

        const fullHouseNarration = narrate(
            {
                kind: StepScriptStepKindEnum.RevealCandidates,
                patternCells: scatteredCells,
                candidates: [placement],
                narration: { technique: SolutionTechniqueEnum.FullHouse, cells: scatteredCells, values: [9], placement }
            },
            'Full House'
        );

        expect(narration).toContain('leave only 9');
        expect(fullHouseNarration).toContain('leave only 9');
    });

    it('explains a generic placement without naming a unit', () => {
        expect.assertions(2);

        const chainCells = [createRowCell(0), { x: 4, y: 4, value: 0, group: 4 }, createRowCell(8)];
        const narration = narrate(
            {
                kind: StepScriptStepKindEnum.RevealCandidates,
                patternCells: chainCells,
                candidates: [placement],
                narration: { technique: SolutionTechniqueEnum.XYWing, cells: chainCells, values: [9], placement }
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
