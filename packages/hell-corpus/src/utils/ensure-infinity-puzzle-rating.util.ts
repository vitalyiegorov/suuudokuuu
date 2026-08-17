import { ensureRatedCorpusPuzzle } from './ensure-rated-corpus-puzzle.util';

import type { DecodedCorpusRecordInterface } from '../interfaces/decoded-corpus-record.interface';
import type { RatedCorpusPuzzleInterface } from '../interfaces/rated-corpus-puzzle.interface';

const createMissingRatingMessage = (index: number): string => `Infinity corpus record at index ${index} is missing its curated rating`;

export const ensureInfinityPuzzleRating = (record: DecodedCorpusRecordInterface, index: number): RatedCorpusPuzzleInterface =>
    ensureRatedCorpusPuzzle(record, index, createMissingRatingMessage);
