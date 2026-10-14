import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { getRunTechniqueEvents } from '../../challenge/utils/get-run-technique-events.util';
import { decodeSharedGameState } from '../../game/utils/decode-shared-game-state.util';

import { getReplayTimeline } from './get-replay-timeline.util';
import { historyGetTechniqueUsageList } from './history-get-technique-usage.util';

import type { CompletedGameSummaryInterface } from '../interfaces/completed-game-summary.interface';

const CompletedGameTechniqueSummaryLimit = 3;

export const getCompletedGameTechniqueSummary = (encodedState: string): CompletedGameSummaryInterface => {
    const { gameState } = decodeSharedGameState(encodedState);
    const timeline = getReplayTimeline(gameState);
    const hintedTechniques = timeline.events.flatMap(event =>
        event.kind === TimelineEventKindEnum.Cell && event.hinted === true ? [event.technique] : []
    );
    const revealCount = hintedTechniques.filter(technique => technique === SolutionTechniqueEnum.Guess).length;
    const usageCounts: Partial<Record<SolutionTechniqueEnum, number>> = {};

    for (const event of getRunTechniqueEvents(timeline.events, timeline.givens)) {
        usageCounts[event.technique] = (usageCounts[event.technique] ?? 0) + 1;
    }

    return {
        techniqueUsageList: historyGetTechniqueUsageList(usageCounts).slice(0, CompletedGameTechniqueSummaryLimit),
        hintCount: hintedTechniques.length - revealCount,
        revealCount
    };
};
