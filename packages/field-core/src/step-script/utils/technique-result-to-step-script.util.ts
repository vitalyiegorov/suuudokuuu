import { ForcingOutcomeKindEnum, SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { StepScriptStepKindEnum } from '../enums/step-script-step-kind.enum';

import type { StepScriptCandidateInterface } from '../interfaces/step-script-candidate.interface';
import type { StepScriptNarrationInterface } from '../interfaces/step-script-narration.interface';
import type { StepScriptInterface } from '../interfaces/step-script.interface';
import type { StepScriptStepType } from '../types/step-script-step.type';
import type { CellInterface } from '@suuudokuuu/generator';
import type { ChainCandidateInterface, ForcingOutcomeType, TechniqueResultInterface } from '@suuudokuuu/techniques';

const getPatternCandidates = (result: TechniqueResultInterface, patternCells: CellInterface[]): StepScriptCandidateInterface[] =>
    (result.patternCandidates ?? result.chain)?.map(({ cell, value }) => ({ cell, value })) ??
    patternCells.flatMap(cell => [...new Set(result.eliminations.map(elimination => elimination.value))].map(value => ({ cell, value })));

const createRevealStep = (
    result: TechniqueResultInterface,
    narrationCells: CellInterface[],
    candidates: StepScriptCandidateInterface[]
): StepScriptStepType => ({
    kind: StepScriptStepKindEnum.RevealCandidates,
    patternCells: isNotEmptyArray(result.blockingCells) ? [...result.blockingCells] : narrationCells,
    candidates,
    narration: {
        technique: result.technique,
        cells: narrationCells,
        values: [...new Set(candidates.map(candidate => candidate.value))].sort((left, right) => left - right),
        ...(result.kind !== 'elimination' && { placement: { cell: result.cell, value: result.value } }),
        ...(isDefined(result.unitCells) && { unitCells: result.unitCells })
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

const createWitnessNarration = (
    technique: SolutionTechniqueEnum,
    candidates: readonly StepScriptCandidateInterface[]
): StepScriptNarrationInterface => ({
    technique,
    cells: candidates.map(candidate => candidate.cell),
    values: candidates.map(candidate => candidate.value)
});

const createChainStep = (technique: SolutionTechniqueEnum, chain: readonly ChainCandidateInterface[]): StepScriptStepType => ({
    kind: StepScriptStepKindEnum.SHOW_CHAIN,
    chain,
    narration: createWitnessNarration(technique, chain)
});

const getOutcomeCells = (outcome: ForcingOutcomeType): readonly CellInterface[] => {
    if (outcome.kind === ForcingOutcomeKindEnum.EMPTY_CELL) {
        return [outcome.cell];
    }

    return outcome.kind === ForcingOutcomeKindEnum.NO_POSITION ? outcome.unitCells : [];
};

const getOutcomeCandidates = (outcome: ForcingOutcomeType): readonly StepScriptCandidateInterface[] => {
    if (outcome.kind === ForcingOutcomeKindEnum.COMMON_ELIMINATIONS) {
        return outcome.eliminations;
    }

    return outcome.kind === ForcingOutcomeKindEnum.ASSIGNMENT_CONFLICT ? [{ cell: outcome.cell, value: outcome.value }] : [];
};

const createWitnessSteps = ({ branches = [], chain = [], technique }: TechniqueResultInterface): StepScriptStepType[] => [
    ...(isNotEmptyArray(chain) ? [createChainStep(technique, chain)] : []),
    ...branches.map((branch, branchIndex): StepScriptStepType => ({
        kind: StepScriptStepKindEnum.SHOW_BRANCH,
        branch,
        branchIndex,
        branchCount: branches.length,
        outcomeCells: getOutcomeCells(branch.outcome),
        outcomeCandidates: getOutcomeCandidates(branch.outcome),
        narration: createWitnessNarration(technique, [branch.assumption, ...branch.implications])
    }))
];

const getPatternCells = ({ reasonCells, technique }: TechniqueResultInterface): CellInterface[] =>
    technique === SolutionTechniqueEnum.NakedSingle
        ? reasonCells.filter((cell, cellIndex) => reasonCells.findIndex(reasonCell => reasonCell.value === cell.value) === cellIndex)
        : [...reasonCells];

export const techniqueResultToStepScript = (result: TechniqueResultInterface): StepScriptInterface => {
    const patternCells = getPatternCells(result);
    const eliminations = result.eliminations.map(elimination => ({ cell: elimination.cell, value: elimination.value }));
    const placement = { cell: result.cell, value: result.value };
    const hasPlacement = result.kind !== 'elimination';
    const revealCandidates = hasPlacement ? [placement] : getPatternCandidates(result, patternCells);
    const revealStep = createRevealStep(result, patternCells, revealCandidates);
    const steps: StepScriptStepType[] = [
        ...createWitnessSteps(result),
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
