import { describe, expect, it } from '@jest/globals';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { StepScriptStepKindEnum } from '../enums/step-script-step-kind.enum';

import { StepScriptPlayer } from './step-script-player';

import type { StepScriptCandidateInterface } from '../interfaces/step-script-candidate.interface';
import type { StepScriptInterface } from '../interfaces/step-script.interface';
import type { CellInterface } from '@suuudokuuu/generator';

const createCell = (x: number, y: number, value = 0): CellInterface => ({ x, y, value, group: 0 });

const patternCell = createCell(0, 0);
const eliminationCandidate: StepScriptCandidateInterface = { cell: createCell(1, 0), value: 4 };
const placementCandidate: StepScriptCandidateInterface = { cell: createCell(2, 0), value: 7 };
const narration = { technique: SolutionTechniqueEnum.NakedPair, cells: [patternCell], values: [4] };

const createScript = (): StepScriptInterface => ({
    technique: SolutionTechniqueEnum.NakedPair,
    patternCells: [patternCell],
    eliminations: [eliminationCandidate],
    placement: placementCandidate,
    steps: [
        { kind: StepScriptStepKindEnum.Highlight, patternCells: [patternCell], narration },
        { kind: StepScriptStepKindEnum.StrikeCandidates, eliminations: [eliminationCandidate], narration },
        { kind: StepScriptStepKindEnum.PlaceValue, placement: placementCandidate, narration }
    ]
});

const createTarget = () => {
    const placed: StepScriptCandidateInterface[] = [];
    const removed: StepScriptCandidateInterface[] = [];

    return {
        placed,
        removed,
        placeValue: (cell: CellInterface, value: number) => void placed.push({ cell, value }),
        removeCandidate: (cell: CellInterface, value: number) => void removed.push({ cell, value })
    };
};

describe('StepScriptPlayer', () => {
    it('starts on the first step', () => {
        expect.assertions(4);

        const player = new StepScriptPlayer(createScript());

        expect(player.StepIndex).toBe(0);
        expect(player.IsFirstStep).toBe(true);
        expect(player.IsLastStep).toBe(false);
        expect(player.CurrentStep?.kind).toBe(StepScriptStepKindEnum.Highlight);
    });

    it('walks forward until the last step and refuses to overrun', () => {
        expect.assertions(4);

        const player = new StepScriptPlayer(createScript());

        expect(player.next()).toBe(true);
        expect(player.next()).toBe(true);
        expect(player.next()).toBe(false);
        expect(player.StepIndex).toBe(2);
    });

    it('walks back until the first step and refuses to underrun', () => {
        expect.assertions(3);

        const player = new StepScriptPlayer(createScript());

        player.next();

        expect(player.back()).toBe(true);
        expect(player.back()).toBe(false);
        expect(player.StepIndex).toBe(0);
    });

    it('resets back to the first step', () => {
        expect.assertions(2);

        const player = new StepScriptPlayer(createScript());

        player.next();
        player.next();
        player.reset();

        expect(player.StepIndex).toBe(0);
        expect(player.IsFirstStep).toBe(true);
    });

    it('exposes the played script', () => {
        expect.assertions(1);

        const script = createScript();

        expect(new StepScriptPlayer(script).Script).toBe(script);
    });

    it('treats an empty script as finished', () => {
        expect.assertions(3);

        const player = new StepScriptPlayer({ ...createScript(), steps: [] });

        expect(player.IsLastStep).toBe(true);
        expect(player.next()).toBe(false);
        expect(player.CurrentStep).toBeNull();
    });

    it('commits eliminations before the placement', () => {
        expect.assertions(2);

        const target = createTarget();

        new StepScriptPlayer(createScript()).applyResult(target);

        expect(target.removed).toEqual([eliminationCandidate]);
        expect(target.placed).toEqual([placementCandidate]);
    });

    it('commits nothing but eliminations when there is no placement', () => {
        expect.assertions(2);

        const target = createTarget();
        const script = createScript();

        delete script.placement;
        new StepScriptPlayer(script).applyResult(target);

        expect(target.removed).toEqual([eliminationCandidate]);
        expect(target.placed).toEqual([]);
    });
});
