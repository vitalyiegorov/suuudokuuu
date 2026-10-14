import { TimelineEventKindEnum } from '@suuudokuuu/encoder';
import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { TechniqueManager } from '@suuudokuuu/techniques';

import { isNotEmptyArray, isNotEmptyString } from '@rnw-community/shared';

import { getTapeTechniqueEvents } from './get-tape-technique-events.util';
import { getTechniqueTier } from './get-technique-tier.util';

import type { ChallengeTechniqueEventInterface } from '../interfaces/challenge-technique-event.interface';
import type { TimelineEventType } from '@suuudokuuu/progress';

export const getRunTechniqueEvents = (events: readonly TimelineEventType[], givens: string): ChallengeTechniqueEventInterface[] => {
    const storedTechniqueEvents = getTapeTechniqueEvents(events);

    if (isNotEmptyArray(storedTechniqueEvents)) {
        return storedTechniqueEvents;
    }

    if (!isNotEmptyString(givens)) {
        return [];
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
                const { technique } = new TechniqueManager(sudoku).identifyMove(cell);

                techniqueEvents.push({ cumulativeTime, technique, tier: getTechniqueTier(technique) });
            }

            sudoku.Field[row][column] = cell;
        }
    }

    return techniqueEvents;
};
