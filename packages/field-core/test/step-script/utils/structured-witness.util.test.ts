import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { ForcingOutcomeKindEnum, SolutionTechniqueEnum, TechniqueManager, createTechniqueStrategies } from '@suuudokuuu/techniques';
import { describe, expect, it } from 'vitest';

import { getCellKey } from '../../../src/@generic/utils/get-cell-key.util';
import { FieldEngine } from '../../../src/field-engine/classes/field-engine';
import { HintLevelEnum } from '../../../src/step-script/enums/hint-level.enum';
import { StepScriptStepKindEnum } from '../../../src/step-script/enums/step-script-step-kind.enum';
import { buildStepScriptState } from '../../../src/step-script/utils/build-step-script-state.util';
import { findHintStepScript } from '../../../src/step-script/utils/find-hint-step-script.util';
import { techniqueResultToStepScript } from '../../../src/step-script/utils/technique-result-to-step-script.util';

import type { StepScriptInterface } from '../../../src/step-script/interfaces/step-script.interface';
import type { StepScriptStepType } from '../../../src/step-script/types/step-script-step.type';
import type { TechniqueResultInterface } from '@suuudokuuu/techniques';

const board = '000000051000000023004005000000000600000130000007680000429006500370400000810000000';
const maxPatternLevelCells = 12;
const forcingHintIndex = 33;
const hardcoreBoard = '001004800302000045540003090800040300000905410400006002030008600050370000100460000';
const hardcoreHintCount = 10;
const forcingBoard = '.................1..2.34........2....4..5....6..1....7.....8.3...3...54.1..6.....';

const findResult = (technique: SolutionTechniqueEnum): TechniqueResultInterface => {
    const strategies = createTechniqueStrategies().filter(strategy => strategy.technique === technique);
    const result = new TechniqueManager(Sudoku.fromString(board, defaultSudokuConfig), strategies).findNextStep();

    if (result === null) {
        throw new Error(`Expected a ${technique} result`);
    }

    return result;
};

const findHint = (engine: FieldEngine): StepScriptInterface => {
    const script = findHintStepScript(engine.Sudoku, engine.getSnapshot().eliminatedCandidates);

    if (script === null) {
        throw new Error('Expected a hint step script');
    }

    return script;
};

const isWitnessStep = (step: StepScriptStepType): boolean =>
    step.kind === StepScriptStepKindEnum.SHOW_CHAIN || step.kind === StepScriptStepKindEnum.SHOW_BRANCH;

const getNarratedCandidates = (step: StepScriptStepType): number[][] =>
    step.narration.cells.map((cell, index) => [cell.y, cell.x, step.narration.values[index]]);

describe('structured witness playback', () => {
    it.each([SolutionTechniqueEnum.AIC, SolutionTechniqueEnum.NishioForcingChain, SolutionTechniqueEnum.CellForcingChain])(
        'plays one %s witness slide per chain or branch before the unchanged deduction slides',
        technique => {
            const result = findResult(technique);
            const { branches = [], chain } = result;
            const script = techniqueResultToStepScript(result);
            const expectedWitnessSteps = [
                ...(chain ? [{ kind: StepScriptStepKindEnum.SHOW_CHAIN, chain }] : []),
                ...branches.map((branch, branchIndex) => ({
                    kind: StepScriptStepKindEnum.SHOW_BRANCH,
                    branch,
                    branchIndex,
                    branchCount: branches.length
                }))
            ];

            expect(expectedWitnessSteps.length).toBeGreaterThan(0);
            expect(script.steps.slice(0, expectedWitnessSteps.length)).toMatchObject(expectedWitnessSteps);
            expect(script.steps.slice(expectedWitnessSteps.length).some(isWitnessStep)).toBe(false);
            expect(script.eliminations).toEqual(result.eliminations);
        }
    );

    it('shows only the current witness slide and restores the deduction overlay after it', () => {
        const script = techniqueResultToStepScript(findResult(SolutionTechniqueEnum.CellForcingChain));
        const revealIndex = script.steps.findIndex(step => !isWitnessStep(step));
        const [, branchStep] = script.steps;

        expect(buildStepScriptState(script, 1)).toEqual({
            explanation: script.steps[1],
            hintRegion: buildStepScriptState(script, revealIndex).hintRegion,
            regionCellKeys: new Set(),
            candidateCellKeys: new Set(
                branchStep.kind === StepScriptStepKindEnum.SHOW_BRANCH
                    ? [
                          ...branchStep.narration.cells,
                          ...branchStep.outcomeCells,
                          ...branchStep.outcomeCandidates.map(({ cell }) => cell),
                          ...(branchStep.branch.outcome.kind === ForcingOutcomeKindEnum.COMMON_PLACEMENT
                              ? [branchStep.branch.outcome.cell]
                              : [])
                      ].map(getCellKey)
                    : []
            ),
            revealedImplicationCount:
                script.steps[1].kind === StepScriptStepKindEnum.SHOW_BRANCH ? script.steps[1].branch.implications.length : 0,
            patternCellKeys: new Set(),
            targetCellKey: null,
            revealedCandidates: new Map(),
            eliminatedCandidates: new Map(),
            placedValues: new Map()
        });
        expect(buildStepScriptState(script, revealIndex).explanation).toBeUndefined();
        expect(buildStepScriptState(script, revealIndex).patternCellKeys.size).toBeGreaterThan(0);
    });

    it('highlights only the forcing assumptions and outcomes at the pattern level', () => {
        const script = techniqueResultToStepScript(findResult(SolutionTechniqueEnum.CellForcingChain));
        const branchSteps = script.steps.filter(step => step.kind === StepScriptStepKindEnum.SHOW_BRANCH);
        const witnessCellKeys = new Set(
            branchSteps.flatMap(step => [
                getCellKey(step.branch.assumption.cell),
                ...step.outcomeCells.map(getCellKey),
                ...step.outcomeCandidates.map(({ cell }) => getCellKey(cell)),
                ...(step.branch.outcome.kind === ForcingOutcomeKindEnum.COMMON_PLACEMENT ? [getCellKey(step.branch.outcome.cell)] : [])
            ])
        );
        const implicationCellKeys = branchSteps.flatMap(step => step.branch.implications.map(({ cell }) => getCellKey(cell)));
        const patternState = buildStepScriptState(script, 0, HintLevelEnum.PATTERN);

        expect(witnessCellKeys.size).toBeGreaterThan(0);
        expect(implicationCellKeys.some(cellKey => !witnessCellKeys.has(cellKey))).toBe(true);
        expect(patternState.patternCellKeys).toEqual(witnessCellKeys);
    });

    it('keeps every forcing pattern of the reported Hardcore board within the pattern cell limit', () => {
        const engine = new FieldEngine({ sudokuString: hardcoreBoard, difficulty: DifficultyEnum.Hard });
        const forcingPatternSizes: number[] = [];

        for (let hintIndex = 0; hintIndex < hardcoreHintCount; hintIndex += 1) {
            const script = findHint(engine);

            if (script.steps.some(step => step.kind === StepScriptStepKindEnum.SHOW_BRANCH)) {
                forcingPatternSizes.push(buildStepScriptState(script, 0, HintLevelEnum.PATTERN).patternCellKeys.size);
            }

            engine.startStepScript(script);
            engine.applyStepScript();
        }

        expect(forcingPatternSizes.length).toBeGreaterThan(0);
        expect(forcingPatternSizes.every(size => size > 0 && size <= maxPatternLevelCells)).toBe(true);
    });

    it('walks a hint that chains a Nishio forcing chain and an AIC without writing a hypothesis', () => {
        const engine = new FieldEngine({ sudokuString: forcingBoard, difficulty: DifficultyEnum.Medium, showAutoCandidates: true });

        for (let hintIndex = 0; hintIndex < forcingHintIndex; hintIndex += 1) {
            engine.startStepScript(findHint(engine));
            engine.applyStepScript();
        }

        const script = findHint(engine);
        const before = engine.serialize();
        const control = new FieldEngine(before);
        const nishio = script.steps.find(step => step.kind === StepScriptStepKindEnum.SHOW_BRANCH);
        const aic = script.steps.find(step => step.kind === StepScriptStepKindEnum.SHOW_CHAIN);

        expect(nishio?.narration.technique).toBe(SolutionTechniqueEnum.NishioForcingChain);
        expect(nishio && getNarratedCandidates(nishio)).toEqual([
            [7, 8, 9],
            [6, 8, 6],
            [8, 2, 9],
            [4, 2, 7]
        ]);
        expect(nishio).toMatchObject({ branch: { outcome: { kind: ForcingOutcomeKindEnum.EMPTY_CELL, cell: { y: 6, x: 2 } } } });

        const nishioScript = { ...script, steps: script.steps.slice(script.steps.findIndex(step => step === nishio)) };

        expect(buildStepScriptState(nishioScript, 0, HintLevelEnum.PATTERN).patternCellKeys.size).toBeLessThanOrEqual(maxPatternLevelCells);
        expect(aic?.narration.technique).toBe(SolutionTechniqueEnum.AIC);
        expect(script.placement).toMatchObject({ cell: { y: 4, x: 2 }, value: 7 });

        engine.startStepScript(script);

        while (engine.stepScriptNext()) {
            expect(engine.serialize()).toEqual(before);
        }

        engine.applyStepScript();
        control.startStepScript({ ...script, steps: script.steps.filter(step => !isWitnessStep(step)) });
        control.applyStepScript();

        expect(engine.serialize()).toEqual(control.serialize());
    });
});
