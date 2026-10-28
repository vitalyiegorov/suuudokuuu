import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import { HintRegionKindEnum } from '../enums/hint-region-kind.enum';
import { StepScriptStepKindEnum } from '../enums/step-script-step-kind.enum';

import { getBoxNumber } from './get-box-number.util';
import { getHintRegion } from './get-hint-region.util';

import type { HintRegionInterface } from '../interfaces/hint-region.interface';
import type { StepScriptStepType } from '../types/step-script-step.type';

const pointingTechniques: ReadonlySet<SolutionTechniqueEnum> = new Set([
    SolutionTechniqueEnum.PointingPair,
    SolutionTechniqueEnum.PointingTriple
]);

export const getDeductionRegion = (steps: readonly StepScriptStepType[], revealIndex: number): HintRegionInterface | null => {
    const revealStep = revealIndex < 0 ? null : steps.at(revealIndex);

    if (revealStep?.kind !== StepScriptStepKindEnum.RevealCandidates) {
        return null;
    }

    const { cells, placement, technique, unitCells } = revealStep.narration;
    const [firstCell] = cells;
    const eliminationCell = steps
        .slice(revealIndex)
        .find(step => step.kind === StepScriptStepKindEnum.StrikeCandidates)
        ?.narration.cells.at(0);

    if (isDefined(unitCells)) {
        return getHintRegion(unitCells);
    }

    if (pointingTechniques.has(technique) && isDefined(firstCell)) {
        return { kind: HintRegionKindEnum.BOX, number: getBoxNumber(firstCell) };
    }

    return getHintRegion(cells, placement?.cell ?? eliminationCell);
};
