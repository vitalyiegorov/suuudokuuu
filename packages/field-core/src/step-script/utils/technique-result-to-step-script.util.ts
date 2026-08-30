import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { StepScriptStepKindEnum } from '../enums/step-script-step-kind.enum';

import type { StepScriptCandidateInterface } from '../interfaces/step-script-candidate.interface';
import type { StepScriptInterface } from '../interfaces/step-script.interface';
import type { StepScriptStepType } from '../types/step-script-step.type';
import type { CellInterface } from '@suuudokuuu/generator';
import type { SolutionTechniqueEnum, TechniqueResultInterface } from '@suuudokuuu/techniques';

const getPatternValues = (result: TechniqueResultInterface): number[] =>
    isNotEmptyArray(result.eliminations) ? [...new Set(result.eliminations.map(elimination => elimination.value))] : [result.value];

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
        values: [...new Set(candidates.map(candidate => candidate.value))],
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
    const revealCandidates = hasPlacement
        ? [placement]
        : patternCells.flatMap(cell => getPatternValues(result).map(value => ({ cell, value })));
    const revealStep = hasPlacement
        ? createRevealStep(result.technique, patternCells, revealCandidates, placement)
        : createRevealStep(result.technique, patternCells, revealCandidates);
    const steps: StepScriptStepType[] = [
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
