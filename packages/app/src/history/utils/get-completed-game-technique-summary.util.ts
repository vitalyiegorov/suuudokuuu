import { getRunTechniqueEvents } from '../../challenge/utils/get-run-technique-events.util';
import { getTimelineCellSteps } from '../../game/utils/get-timeline-cell-steps.util';
import { stringToGameState } from '../../game/utils/string-to-game-state.util';

import { getReplayTechniqueUsageCounts } from './get-replay-technique-usage-counts.util';
import { getReplayTimeline } from './get-replay-timeline.util';
import { historyGetTechniqueUsageList } from './history-get-technique-usage.util';

import type { TechniqueUsageInterface } from '../interfaces/technique-usage.interface';

const CompletedGameTechniqueSummaryLimit = 3;

export const getCompletedGameTechniqueSummary = (encodedState: string): readonly TechniqueUsageInterface[] => {
    const gameState = stringToGameState(encodedState);
    const timeline = getReplayTimeline(gameState);

    if (getTimelineCellSteps(timeline.events).length === 0) {
        return [];
    }

    const techniqueEvents = getRunTechniqueEvents(timeline.events, timeline.givens);
    const usageCounts = getReplayTechniqueUsageCounts(techniqueEvents);

    return historyGetTechniqueUsageList(usageCounts).slice(0, CompletedGameTechniqueSummaryLimit);
};
