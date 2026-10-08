import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum, TechniqueManager, createTechniqueStrategies } from '@suuudokuuu/techniques';
import { describe, expect, it } from 'vitest';

import { FieldEngine } from '../../../src/field-engine/classes/field-engine';
import { StepScriptStepKindEnum } from '../../../src/step-script/enums/step-script-step-kind.enum';
import { buildStepScriptState } from '../../../src/step-script/utils/build-step-script-state.util';
import { findHintStepScript } from '../../../src/step-script/utils/find-hint-step-script.util';
import { techniqueResultToStepScript } from '../../../src/step-script/utils/technique-result-to-step-script.util';

import type { StepScriptInterface } from '../../../src/step-script/interfaces/step-script.interface';
import type { StepScriptStepType } from '../../../src/step-script/types/step-script-step.type';
import type { TechniqueResultInterface } from '@suuudokuuu/techniques';

const board = '000000051000000023004005000000000600000130000007680000429006500370400000810000000';
const columnQuadBoard = '.....3...9....6......4...371..2..8..........5.8453.......3..67..27...........891.';
const regionBoard = '000000006000006001060502034000604305305000640406035100638257419570460823240000567';

const emptyWitnessState = {
    patternCellKeys: new Set(),
    targetCellKey: null,
    revealedCandidates: new Map(),
    eliminatedCandidates: new Map(),
    placedValues: new Map()
};

const findResult = (technique: SolutionTechniqueEnum, boardString = board): TechniqueResultInterface => {
    const sudoku = Sudoku.fromString(boardString, defaultSudokuConfig);
    const strategies = createTechniqueStrategies().filter(strategy => strategy.technique === technique);
    const result = new TechniqueManager(sudoku, strategies).findNextStep();

    if (result === null) {
        throw new Error('Expected the narrowed registry to find a technique result');
    }

    return result;
};

const findHint = (engine: FieldEngine): StepScriptInterface => {
    const script = findHintStepScript(engine.Sudoku);

    if (script === null) {
        throw new Error('Expected a hint step script');
    }

    return script;
};

const isWitnessStep = (step: StepScriptStepType): boolean =>
    step.kind === StepScriptStepKindEnum.SHOW_CHAIN || step.kind === StepScriptStepKindEnum.SHOW_BRANCH;

const getExpectedWitnessSteps = (result: TechniqueResultInterface): object[] => [
    ...(result.chain ?? []).map((candidate, candidateIndex) => ({
        kind: StepScriptStepKindEnum.SHOW_CHAIN,
        chain: result.chain,
        visibleLength: candidateIndex + 1,
        narration: { technique: result.technique, cells: [candidate.cell], values: [candidate.value] }
    })),
    ...(result.branches ?? []).flatMap((branch, branchIndex, branches) => [
        ...[branch.assumption, ...branch.implications].map((candidate, visibleImplicationCount) => ({
            kind: StepScriptStepKindEnum.SHOW_BRANCH,
            branch,
            branchIndex,
            branchCount: branches.length,
            visibleImplicationCount,
            showOutcome: false,
            narration: { technique: result.technique, cells: [candidate.cell], values: [candidate.value] }
        })),
        {
            kind: StepScriptStepKindEnum.SHOW_BRANCH,
            branch,
            branchIndex,
            visibleImplicationCount: branch.implications.length,
            showOutcome: true
        }
    ])
];

describe('structured witness playback', () => {
    it.each([SolutionTechniqueEnum.AIC, SolutionTechniqueEnum.NishioForcingChain, SolutionTechniqueEnum.CellForcingChain])(
        'plays every %s witness prefix before the unchanged deduction slides',
        technique => {
            const result = findResult(technique);
            const script = techniqueResultToStepScript(result);
            const expectedWitnessSteps = getExpectedWitnessSteps(result);
            const deductionSteps = script.steps.slice(expectedWitnessSteps.length);

            expect(expectedWitnessSteps.length).toBeGreaterThan(2);
            expect(script.steps.slice(0, expectedWitnessSteps.length)).toMatchObject(expectedWitnessSteps);
            expect(deductionSteps[0].kind).toBe(StepScriptStepKindEnum.RevealCandidates);
            expect(deductionSteps.some(isWitnessStep)).toBe(false);
            expect(script.steps.filter(isWitnessStep).some(step => step.narration.placement !== undefined)).toBe(false);
            expect(script.eliminations).toEqual(result.eliminations);
        }
    );

    it('keeps two digits of one AIC cell as distinct chain candidates', () => {
        const { chain = [] } = findResult(SolutionTechniqueEnum.AIC);

        expect(
            chain.some((candidate, index) =>
                chain.slice(0, index).some(earlier => earlier.cell === candidate.cell && earlier.value !== candidate.value)
            )
        ).toBe(true);
    });

    it('starts the second cell forcing branch with only its own assumption', () => {
        const result = findResult(SolutionTechniqueEnum.CellForcingChain);
        const script = techniqueResultToStepScript(result);
        const secondBranchIndex = script.steps.findIndex(
            step => step.kind === StepScriptStepKindEnum.SHOW_BRANCH && step.branchIndex === 1 && step.visibleImplicationCount === 0
        );

        expect(result.branches?.length).toBeGreaterThan(1);
        expect(buildStepScriptState(script, secondBranchIndex)).toEqual({
            ...emptyWitnessState,
            explanation: script.steps[secondBranchIndex]
        });
        expect(script.steps[secondBranchIndex]).toMatchObject({ branch: result.branches?.[1], showOutcome: false });
    });

    it.each([
        [SolutionTechniqueEnum.CellForcingChain, board],
        [SolutionTechniqueEnum.RegionForcingChain, regionBoard]
    ])('hides earlier %s overlays on every witness slide and restores them on rewind', (technique, boardString) => {
        const script = techniqueResultToStepScript(findResult(technique, boardString));
        const deductionSteps = script.steps.filter(step => !isWitnessStep(step));
        const prefixedScript = { ...script, steps: [...deductionSteps, ...script.steps] };
        const priorState = buildStepScriptState(prefixedScript, deductionSteps.length - 1);
        const witnessIndexes = prefixedScript.steps.flatMap((step, stepIndex) => (isWitnessStep(step) ? [stepIndex] : []));

        expect(priorState.patternCellKeys.size).toBeGreaterThan(0);
        expect(witnessIndexes.map(stepIndex => buildStepScriptState(prefixedScript, stepIndex))).toEqual(
            witnessIndexes.map(stepIndex => ({ ...emptyWitnessState, explanation: prefixedScript.steps[stepIndex] }))
        );
        expect(buildStepScriptState(prefixedScript, deductionSteps.length - 1)).toEqual(priorState);
    });

    it('walks the Nishio and AIC third hint of the column quad board without writing a hypothesis', () => {
        const engine = new FieldEngine({ sudokuString: columnQuadBoard, difficulty: DifficultyEnum.Medium, showAutoCandidates: true });

        for (let hintNumber = 0; hintNumber < 2; hintNumber += 1) {
            engine.startStepScript(findHint(engine));
            engine.applyStepScript();
        }

        const script = findHint(engine);
        const before = engine.serialize();
        const control = new FieldEngine(before);
        const moveEvents: number[] = [];
        const controlEvents: number[] = [];
        const serializedStates: unknown[] = [];

        expect(
            script.steps.some(
                step =>
                    step.kind === StepScriptStepKindEnum.SHOW_BRANCH &&
                    step.narration.technique === SolutionTechniqueEnum.NishioForcingChain
            )
        ).toBe(true);
        expect(
            script.steps.some(
                step => step.kind === StepScriptStepKindEnum.SHOW_CHAIN && step.narration.technique === SolutionTechniqueEnum.AIC
            )
        ).toBe(true);
        expect(script.placement).toMatchObject({ cell: { y: 5, x: 8 }, value: 1 });

        engine.on('moveApplied', event => moveEvents.push(event.cell.value));
        control.on('moveApplied', event => controlEvents.push(event.cell.value));
        engine.startStepScript(script);

        while (engine.stepScriptNext()) {
            serializedStates.push(engine.serialize());
        }

        expect(engine.getSnapshot().stepIndex).toBe(script.steps.length - 1);
        expect(serializedStates).toEqual(Array.from({ length: script.steps.length - 1 }, () => before));
        expect(moveEvents).toEqual([]);

        engine.applyStepScript();
        control.startStepScript({ ...script, steps: script.steps.filter(step => !isWitnessStep(step)) });
        control.applyStepScript();

        expect(engine.serialize()).toEqual(control.serialize());
        expect(moveEvents).toEqual(controlEvents);
        expect(moveEvents).toEqual([1]);
        expect(engine.undo()).toBe(control.undo());
        expect(engine.undo()).toBe(control.undo());
        expect(engine.serialize()).toEqual(before);
    });

    it('walks a cell forcing chain without writing a hypothesis and applies only its eliminations', () => {
        const script = techniqueResultToStepScript(findResult(SolutionTechniqueEnum.CellForcingChain));
        const engine = new FieldEngine({ sudokuString: board, difficulty: DifficultyEnum.Newbie, showAutoCandidates: true });
        const before = engine.serialize();
        const moveEvents: number[] = [];

        engine.on('moveApplied', event => moveEvents.push(event.cell.value));
        engine.startStepScript(script);

        while (engine.stepScriptNext()) {
            expect(engine.serialize()).toEqual(before);
        }

        engine.applyStepScript();

        expect(engine.serialize().sudokuString).toBe(before.sudokuString);
        expect(engine.serialize().eliminatedCandidates).not.toEqual(before.eliminatedCandidates);
        expect(moveEvents).toEqual([]);
    });
});
