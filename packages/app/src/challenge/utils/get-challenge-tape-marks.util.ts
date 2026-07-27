import { TimelineEventKindEnum } from '@suuudokuuu/encoder';

import { isDefined } from '@rnw-community/shared';

import { techniqueComplexityConstant } from '../constants/technique-complexity.constant';
import { ChallengeTechniqueTierEnum } from '../enums/challenge-technique-tier.enum';

import { getTechniqueTier } from './get-technique-tier.util';

import type { GameTimelineEventInterface } from '../../game/interface/game-timeline-event.interface';
import type { SolutionTechniqueEnum } from '@suuudokuuu/solver';

export interface ChallengeTapeMarkInterface {
    complexity: number;
    isAway: boolean;
    tier: ChallengeTechniqueTierEnum | null;
}

const buildEmptyMarks = (tickCount: number): ChallengeTapeMarkInterface[] =>
    Array.from({ length: tickCount }, () => ({ complexity: 0, isAway: false, tier: null }));

const getSlot = (cumulativeTime: number, elapsedTime: number, tickCount: number): number =>
    Math.min(tickCount - 1, Math.max(0, Math.floor((cumulativeTime / elapsedTime) * tickCount)));

const getPlacementComplexity = (technique: SolutionTechniqueEnum | undefined): number =>
    isDefined(technique) ? techniqueComplexityConstant[technique] : 0;

const markPlacement = (marks: ChallengeTapeMarkInterface[], slot: number, technique: SolutionTechniqueEnum | undefined): void => {
    const tier = isDefined(technique) ? getTechniqueTier(technique) : ChallengeTechniqueTierEnum.Basic;
    const complexity = getPlacementComplexity(technique);
    const existingMark = marks[slot];

    if (existingMark.tier === null || complexity > existingMark.complexity) {
        marks[slot] = { ...existingMark, complexity, tier };
    }
};

const markAwayRange = (marks: ChallengeTapeMarkInterface[], startSlot: number, endSlot: number): void => {
    for (let slot = startSlot; slot <= endSlot; slot += 1) {
        marks[slot] = { ...marks[slot], isAway: true };
    }
};

const applyEvent = (
    marks: ChallengeTapeMarkInterface[],
    event: GameTimelineEventInterface,
    slot: number,
    awayStartSlot: number | null
): number | null => {
    if (event.kind === TimelineEventKindEnum.Cell) {
        markPlacement(marks, slot, event.technique);

        return awayStartSlot;
    }

    if (event.kind === TimelineEventKindEnum.Away) {
        return slot;
    }

    if (event.kind === TimelineEventKindEnum.Return && isDefined(awayStartSlot)) {
        markAwayRange(marks, awayStartSlot, slot);

        return null;
    }

    return awayStartSlot;
};

export const getChallengeTapeMarks = (
    events: GameTimelineEventInterface[],
    elapsedTime: number,
    tickCount: number
): ChallengeTapeMarkInterface[] => {
    const marks = buildEmptyMarks(tickCount);

    if (elapsedTime <= 0) {
        return marks;
    }

    let cumulativeTime = 0;
    let awayStartSlot: number | null = null;

    for (const event of events) {
        cumulativeTime += event.ts;
        awayStartSlot = applyEvent(marks, event, getSlot(cumulativeTime, elapsedTime, tickCount), awayStartSlot);
    }

    if (isDefined(awayStartSlot)) {
        markAwayRange(marks, awayStartSlot, tickCount - 1);
    }

    return marks;
};
