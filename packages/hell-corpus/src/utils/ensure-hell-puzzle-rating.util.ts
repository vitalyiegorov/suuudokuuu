import { ensureRatedCorpusPuzzle } from './ensure-rated-corpus-puzzle.util';

import type { DecodedCorpusRecordInterface } from '../interfaces/decoded-corpus-record.interface';
import type { RatedCorpusPuzzleInterface } from '../interfaces/rated-corpus-puzzle.interface';

const createMissingRatingMessage = (index: number): string => `Hell corpus record at index ${index} is missing its stored rating`;

export const ensureHellPuzzleRating = (record: DecodedCorpusRecordInterface, index: number): RatedCorpusPuzzleInterface =>
    ensureRatedCorpusPuzzle(record, index, createMissingRatingMessage);
