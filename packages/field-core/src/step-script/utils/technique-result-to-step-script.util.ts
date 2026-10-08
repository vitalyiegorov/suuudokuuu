import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { StepScriptStepKindEnum } from '../enums/step-script-step-kind.enum';

import type { StepScriptBranchStepInterface } from '../interfaces/step-script-branch-step.interface';
import type { StepScriptCandidateInterface } from '../interfaces/step-script-candidate.interface';
import type { StepScriptInterface } from '../interfaces/step-script.interface';
import type { StepScriptStepType } from '../types/step-script-step.type';
import type { CellInterface } from '@suuudokuuu/generator';
import type { SolutionTechniqueEnum, TechniqueResultInterface } from '@suuudokuuu/techniques';

const getPatternCandidates = (result: TechniqueResultInterface, patternCells: CellInterface[]): StepScriptCandidateInterface[] =>
    result.patternCandidates?.map(({ cell, value }) => ({ cell, value })) ??
    patternCells.flatMap(cell => [...new Set(result.eliminations.map(elimination => elimination.value))].map(value => ({ cell, value })));

const createRevealStep = (
    technique: SolutionTechniqueEnum,
    patternCells: CellInterface[],
    candidates: StepScriptCandidateInterface[],
    placement?: StepScriptCandidateInterface
): StepScriptStepType => ({
    kind: StepScriptStepKindEnum.RevealCandidates,
    patternCells,
    candidates,
    narration: {
        technique,
        cells: patternCells,
        values: [...new Set(candidates.map(candidate => candidate.value))].sort((left, right) => left - right),
        ...(isDefined(placement) && { placement })
    }
});

const createStrikeStep = (technique: SolutionTechniqueEnum, eliminations: StepScriptCandidateInterface[]): StepScriptStepType => ({
    kind: StepScriptStepKindEnum.StrikeCandidates,
    eliminations,
    narration: {
        technique,
        cells: eliminations.map(elimination => elimination.cell),
        values: [...new Set(eliminations.map(elimination => elimination.value))]
    }
});

const createPlaceStep = (technique: SolutionTechniqueEnum, placement: StepScriptCandidateInterface): StepScriptStepType => ({
    kind: StepScriptStepKindEnum.PlaceValue,
    placement,
    narration: { technique, cells: [placement.cell], values: [placement.value], placement }
});

export const techniqueResultToStepScript = (result: TechniqueResultInterface): StepScriptInterface => {
    const patternCells = [...result.reasonCells];
    const eliminations = result.eliminations.map(elimination => ({ cell: elimination.cell, value: elimination.value }));
    const placement = { cell: result.cell, value: result.value };
    const hasPlacement = result.kind !== 'elimination';
    const revealCandidates = hasPlacement ? [placement] : getPatternCandidates(result, patternCells);
    const revealStep = hasPlacement
        ? createRevealStep(result.technique, patternCells, revealCandidates, placement)
        : createRevealStep(result.technique, patternCells, revealCandidates);
    const { chain, branches } = result;
    const chainSteps: StepScriptStepType[] =
        chain?.map((candidate, index) => ({
            kind: StepScriptStepKindEnum.SHOW_CHAIN,
            chain,
            visibleLength: index + 1,
            narration: { technique: result.technique, cells: [candidate.cell], values: [candidate.value] }
        })) ?? [];
    const branchSteps: StepScriptStepType[] =
        branches?.flatMap((branch, branchIndex): StepScriptBranchStepInterface[] => [
            ...Array.from(
                { length: branch.implications.length + 1 },
                (_unused, visibleImplicationCount): StepScriptBranchStepInterface => ({
                    kind: StepScriptStepKindEnum.SHOW_BRANCH,
                    branch,
                    branchIndex,
                    branchCount: branches.length,
                    visibleImplicationCount,
                    showOutcome: false,
                    narration: {
                        technique: result.technique,
                        cells:
                            visibleImplicationCount === 0
                                ? [branch.assumption.cell]
                                : [branch.implications[visibleImplicationCount - 1].cell],
                        values:
                            visibleImplicationCount === 0
                                ? [branch.assumption.value]
                                : [branch.implications[visibleImplicationCount - 1].value]
                    }
                })
            ),
            {
                kind: StepScriptStepKindEnum.SHOW_BRANCH,
                branch,
                branchIndex,
                branchCount: branches.length,
                visibleImplicationCount: branch.implications.length,
                showOutcome: true,
                narration: { technique: result.technique, cells: [branch.assumption.cell], values: [branch.assumption.value] }
            }
        ]) ?? [];
    const steps: StepScriptStepType[] = [
        ...chainSteps,
        ...branchSteps,
        revealStep,
        ...(isNotEmptyArray(eliminations) ? [createStrikeStep(result.technique, eliminations)] : []),
        ...(hasPlacement ? [createPlaceStep(result.technique, placement)] : [])
    ];

    return {
        technique: result.technique,
        patternCells,
        eliminations,
        steps,
        ...(hasPlacement && { placement })
    };
};
