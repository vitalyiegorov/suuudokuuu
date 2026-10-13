import { msg } from '@lingui/core/macro';
import { HintRegionKindEnum, StepScriptStepKindEnum } from '@suuudokuuu/field-core';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import { gameGetStepNarration } from './game-get-step-narration.util';

import type { MessageDescriptor } from '@lingui/core';
import type { HintRegionInterface, StepScriptCandidateInterface, StepScriptInterface } from '@suuudokuuu/field-core';

type UnitPatternNarrationType = (techniqueName: string, value: number) => MessageDescriptor;

const hiddenSinglePatternNarrations: Partial<Record<HintRegionKindEnum, UnitPatternNarrationType>> = {
    [HintRegionKindEnum.ROW]: (techniqueName, value) => msg`${techniqueName}: in the highlighted row, ${value} fits in only one cell.`,
    [HintRegionKindEnum.COLUMN]: (techniqueName, value) =>
        msg`${techniqueName}: in the highlighted column, ${value} fits in only one cell.`,
    [HintRegionKindEnum.BOX]: (techniqueName, value) => msg`${techniqueName}: in the highlighted box, ${value} fits in only one cell.`
};

const fullHousePatternNarrations: Partial<Record<HintRegionKindEnum, UnitPatternNarrationType>> = {
    [HintRegionKindEnum.ROW]: techniqueName => msg`${techniqueName}: the highlighted row has one empty cell left.`,
    [HintRegionKindEnum.COLUMN]: techniqueName => msg`${techniqueName}: the highlighted column has one empty cell left.`,
    [HintRegionKindEnum.BOX]: techniqueName => msg`${techniqueName}: the highlighted box has one empty cell left.`
};

const getSingleCellPatternNarration: UnitPatternNarrationType = (techniqueName, value) =>
    msg`${techniqueName}: the highlighted cells leave ${value} only one place.`;

const getPlacementPatternNarration = (
    { cell, value }: StepScriptCandidateInterface,
    technique: SolutionTechniqueEnum,
    hintRegion: HintRegionInterface | null,
    techniqueName: string
): MessageDescriptor => {
    const regionKind = hintRegion?.kind ?? HintRegionKindEnum.CELL;

    if (technique === SolutionTechniqueEnum.NakedSingle) {
        const cellName = `R${cell.y + 1}C${cell.x + 1}`;

        return msg`${techniqueName}: ${cellName} sees every highlighted digit except one.`;
    }

    if (technique === SolutionTechniqueEnum.HiddenSingle) {
        return (hiddenSinglePatternNarrations[regionKind] ?? getSingleCellPatternNarration)(techniqueName, value);
    }

    if (technique === SolutionTechniqueEnum.FullHouse) {
        return (fullHousePatternNarrations[regionKind] ?? getSingleCellPatternNarration)(techniqueName, value);
    }

    return getSingleCellPatternNarration(techniqueName, value);
};

export const gameGetPatternNarration = (
    { steps }: Pick<StepScriptInterface, 'steps'>,
    hintRegion: HintRegionInterface | null,
    techniqueName: string
): MessageDescriptor => {
    const firstStep = steps.at(0);
    const revealStep = steps.find(step => step.kind === StepScriptStepKindEnum.RevealCandidates);
    const placement = revealStep?.narration.placement;

    if (firstStep?.kind === StepScriptStepKindEnum.SHOW_BRANCH) {
        const { cell, value } = firstStep.branch.assumption;
        const cellName = `R${cell.y + 1}C${cell.x + 1}`;

        return firstStep.branchCount > 1
            ? msg`${techniqueName}: try each highlighted possibility in turn and follow what it forces.`
            : msg`${techniqueName}: assume ${cellName} is ${value} and follow what it forces.`;
    }

    if (!isDefined(revealStep)) {
        return msg`Look for ${techniqueName}.`;
    }

    return isDefined(placement)
        ? getPlacementPatternNarration(placement, revealStep.narration.technique, hintRegion, techniqueName)
        : gameGetStepNarration(revealStep, techniqueName);
};
