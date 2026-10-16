import { msg } from '@lingui/core/macro';
import { HintRegionKindEnum, StepScriptStepKindEnum } from '@suuudokuuu/field-core';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import { gameGetCellName } from './game-get-cell-name.util';
import { gameGetStepNarration } from './game-get-step-narration.util';

import type { I18n, MessageDescriptor } from '@lingui/core';
import type { HintRegionInterface, StepScriptCandidateInterface, StepScriptInterface } from '@suuudokuuu/field-core';

type UnitPatternNarrationType = (techniqueName: string, value: number, regionNumber: number) => MessageDescriptor;

const hiddenSinglePatternNarrations: Partial<Record<HintRegionKindEnum, UnitPatternNarrationType>> = {
    [HintRegionKindEnum.ROW]: (techniqueName, value, regionNumber) =>
        msg`${techniqueName}: in row ${regionNumber}, ${value} fits in only one cell.`,
    [HintRegionKindEnum.COLUMN]: (techniqueName, value, regionNumber) =>
        msg`${techniqueName}: in column ${regionNumber}, ${value} fits in only one cell.`,
    [HintRegionKindEnum.BOX]: (techniqueName, value, regionNumber) =>
        msg`${techniqueName}: in box ${regionNumber}, ${value} fits in only one cell.`
};

const fullHousePatternNarrations: Partial<Record<HintRegionKindEnum, UnitPatternNarrationType>> = {
    [HintRegionKindEnum.ROW]: (techniqueName, _value, regionNumber) => msg`${techniqueName}: row ${regionNumber} has one empty cell left.`,
    [HintRegionKindEnum.COLUMN]: (techniqueName, _value, regionNumber) =>
        msg`${techniqueName}: column ${regionNumber} has one empty cell left.`,
    [HintRegionKindEnum.BOX]: (techniqueName, _value, regionNumber) => msg`${techniqueName}: box ${regionNumber} has one empty cell left.`
};

const getSingleCellPatternNarration = (techniqueName: string, value: number): MessageDescriptor =>
    msg`${techniqueName}: the highlighted cells leave ${value} only one place.`;

const getPlacementPatternNarration = (
    { cell, value }: StepScriptCandidateInterface,
    technique: SolutionTechniqueEnum,
    hintRegion: HintRegionInterface | null,
    techniqueName: string
): MessageDescriptor => {
    const regionKind = hintRegion?.kind ?? HintRegionKindEnum.CELL;
    const regionNumber = hintRegion?.number ?? 0;

    if (technique === SolutionTechniqueEnum.NakedSingle) {
        const cellName = gameGetCellName(cell);

        return msg`${techniqueName}: ${cellName} sees every highlighted digit except one.`;
    }

    if (technique === SolutionTechniqueEnum.HiddenSingle) {
        return (hiddenSinglePatternNarrations[regionKind] ?? getSingleCellPatternNarration)(techniqueName, value, regionNumber);
    }

    if (technique === SolutionTechniqueEnum.FullHouse) {
        return (fullHousePatternNarrations[regionKind] ?? getSingleCellPatternNarration)(techniqueName, value, regionNumber);
    }

    return getSingleCellPatternNarration(techniqueName, value);
};

export const gameGetPatternNarration = (
    { steps }: Pick<StepScriptInterface, 'steps'>,
    hintRegion: HintRegionInterface | null,
    techniqueName: string,
    i18n: I18n
): MessageDescriptor => {
    const firstStep = steps.at(0);
    const revealStep = steps.find(step => step.kind === StepScriptStepKindEnum.RevealCandidates);
    const placement = revealStep?.narration.placement;

    if (firstStep?.kind === StepScriptStepKindEnum.SHOW_BRANCH) {
        const { cell, value } = firstStep.branch.assumption;
        const cellName = gameGetCellName(cell);

        return firstStep.branchCount > 1
            ? msg`${techniqueName}: try each highlighted possibility in turn and follow what it forces.`
            : msg`${techniqueName}: assume ${cellName} is ${value} and follow what it forces.`;
    }

    if (!isDefined(revealStep)) {
        return msg`Look for ${techniqueName}.`;
    }

    return isDefined(placement)
        ? getPlacementPatternNarration(placement, revealStep.narration.technique, hintRegion, techniqueName)
        : gameGetStepNarration(revealStep, techniqueName, i18n);
};
