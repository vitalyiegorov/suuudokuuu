import { INFINITY_CORPUS_BASE64, INFINITY_CORPUS_SIZE } from '../constants/infinity-corpus-data.constant';
import { INFINITY_CORPUS_RECORD_BASE64_LENGTH, INFINITY_CORPUS_RECORD_BYTES } from '../constants/infinity-corpus.constant';

import { ensureInfinityPuzzleRating } from './ensure-infinity-puzzle-rating.util';
import { getCorpusRecord } from './get-corpus-record.util';

import type { RatedCorpusPuzzleInterface } from '../interfaces/rated-corpus-puzzle.interface';

export const getInfinityCorpusPuzzle = (index: number): RatedCorpusPuzzleInterface =>
    ensureInfinityPuzzleRating(
        getCorpusRecord(
            {
                corpusBase64: INFINITY_CORPUS_BASE64,
                corpusSize: INFINITY_CORPUS_SIZE,
                recordBase64Length: INFINITY_CORPUS_RECORD_BASE64_LENGTH,
                recordBytes: INFINITY_CORPUS_RECORD_BYTES
            },
            index
        ),
        index
    );
