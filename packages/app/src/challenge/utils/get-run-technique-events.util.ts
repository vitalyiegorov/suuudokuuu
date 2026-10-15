import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { isNotEmptyString } from '@rnw-community/shared';

import { classifyTimelineMove } from './classify-timeline-move.util';
import { getTapeTechniqueEvents } from './get-tape-technique-events.util';
import { getTechniqueTier } from './get-technique-tier.util';

import type { ChallengeTechniqueEventInterface } from '../interfaces/challenge-technique-event.interface';
import type { TimelineEventType } from '@suuudokuuu/progress';

export const getRunTechniqueEvents = (events: readonly TimelineEventType[], givens: string): ChallengeTechniqueEventInterface[] => {
    if (!isNotEmptyString(givens)) {
        return getTapeTechniqueEvents(events);
    }

    const sudoku = Sudoku.fromString(givens, defaultSudokuConfig);
    const techniqueEvents: ChallengeTechniqueEventInterface[] = [];
    let cumulativeTime = 0;

    for (const event of events) {
        cumulativeTime += event.ts;

        if (event.kind === TimelineEventKindEnum.Cell) {
            const column = event.cellIndex % defaultSudokuConfig.fieldSize;
            const row = Math.floor(event.cellIndex / defaultSudokuConfig.fieldSize);
            const cell = { ...sudoku.Field[row][column], value: event.value };

            if (event.hinted !== true) {
                const technique = event.technique ?? classifyTimelineMove(sudoku, cell);

                techniqueEvents.push({ cumulativeTime, technique, tier: getTechniqueTier(technique) });
            }

            sudoku.Field[row][column] = cell;
        }
    }

    return techniqueEvents;
};
