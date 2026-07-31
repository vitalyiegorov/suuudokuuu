import { HellQueueEntrySchemaVersion } from '../schema/hell-queue-entry.schema';

import { HellQueueGeneratorVersion } from './hell-queue.constant';

import type { HellQueueEntryInterface } from '../interfaces/hell-queue-entry.interface';

const HellQueueE2eSeedPuzzle = '000000010400000000020000000000050407008000300001090000300400200050100000000806000';
const HellQueueE2eSeedSolution = '693784512487512936125963874932651487568247391741398625319475268856129743274836159';
const HellQueueE2eSeedGivensCount = 17;
const HellQueueE2eSeedCreatedAt = 1;

export const HellQueueE2eSeedEntry: HellQueueEntryInterface = {
    createdAt: HellQueueE2eSeedCreatedAt,
    generatorVersion: HellQueueGeneratorVersion,
    givensCount: HellQueueE2eSeedGivensCount,
    id: HellQueueE2eSeedPuzzle,
    puzzle: HellQueueE2eSeedPuzzle,
    schemaVersion: HellQueueEntrySchemaVersion,
    solution: HellQueueE2eSeedSolution
};
