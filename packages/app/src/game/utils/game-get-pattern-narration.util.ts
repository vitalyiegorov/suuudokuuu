import { msg } from '@lingui/core/macro';
import { HintRegionKindEnum, StepScriptStepKindEnum } from '@suuudokuuu/field-core';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import { gameGetCellName } from './game-get-cell-name.util';
import { gameGetStepNarration } from './game-get-step-narration.util';

import type { I18n, MessageDescriptor } from '@lingui/core';
import type { HintRegionInterface, StepScriptCandidateInterface, StepScriptInterface } from '@suuudokuuu/field-core';

type UnitPatternNarrationType = (value: number, regionNumber: number) => MessageDescriptor;

const hiddenSinglePatternNarrations: Partial<Record<HintRegionKindEnum, UnitPatternNarrationType>> = {
    [HintRegionKindEnum.ROW]: (value, regionNumber) => msg`In row ${regionNumber}, ${value} fits in only one cell.`,
    [HintRegionKindEnum.COLUMN]: (value, regionNumber) => msg`In column ${regionNumber}, ${value} fits in only one cell.`,
    [HintRegionKindEnum.BOX]: (value, regionNumber) => msg`In box ${regionNumber}, ${value} fits in only one cell.`
};

const fullHousePatternNarrations: Partial<Record<HintRegionKindEnum, UnitPatternNarrationType>> = {
    [HintRegionKindEnum.ROW]: (_value, regionNumber) => msg`Row ${regionNumber} has one empty cell left.`,
    [HintRegionKindEnum.COLUMN]: (_value, regionNumber) => msg`Column ${regionNumber} has one empty cell left.`,
    [HintRegionKindEnum.BOX]: (_value, regionNumber) => msg`Box ${regionNumber} has one empty cell left.`
};

const getSingleCellPatternNarration = (value: number): MessageDescriptor => msg`The highlighted cells leave ${value} only one place.`;

const getPlacementPatternNarration = (
    { cell, value }: StepScriptCandidateInterface,
    technique: SolutionTechniqueEnum,
    hintRegion: HintRegionInterface | null
): MessageDescriptor => {
    const regionKind = hintRegion?.kind ?? HintRegionKindEnum.CELL;
    const regionNumber = hintRegion?.number ?? 0;

    if (technique === SolutionTechniqueEnum.NakedSingle) {
        const cellName = gameGetCellName(cell);

        return msg`${cellName} sees every highlighted digit except one.`;
    }

    if (technique === SolutionTechniqueEnum.HiddenSingle) {
        return (hiddenSinglePatternNarrations[regionKind] ?? getSingleCellPatternNarration)(value, regionNumber);
    }

    if (technique === SolutionTechniqueEnum.FullHouse) {
        return (fullHousePatternNarrations[regionKind] ?? getSingleCellPatternNarration)(value, regionNumber);
    }

    return getSingleCellPatternNarration(value);
};

export const gameGetPatternNarration = (
    { steps }: Pick<StepScriptInterface, 'steps'>,
    hintRegion: HintRegionInterface | null,
    i18n: I18n
): MessageDescriptor => {
    const firstStep = steps.at(0);
    const revealStep = steps.find(step => step.kind === StepScriptStepKindEnum.RevealCandidates);
    const placement = revealStep?.narration.placement;

    if (firstStep?.kind === StepScriptStepKindEnum.SHOW_BRANCH) {
        const { cell, value } = firstStep.branch.assumption;
        const cellName = gameGetCellName(cell);

        return firstStep.branchCount > 1
            ? msg`Try each highlighted possibility in turn and follow what it forces.`
            : msg`Assume ${cellName} is ${value} and follow what it forces.`;
    }

    if (!isDefined(revealStep)) {
        return msg`Look at the highlighted cells.`;
    }

    return isDefined(placement)
        ? getPlacementPatternNarration(placement, revealStep.narration.technique, hintRegion)
        : gameGetStepNarration(revealStep, i18n, steps);
};
