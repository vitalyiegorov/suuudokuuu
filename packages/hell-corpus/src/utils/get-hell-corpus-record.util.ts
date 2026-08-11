import { HELL_CORPUS_BASE64, HELL_CORPUS_SIZE } from '../constants/hell-corpus-data.constant';
import { HELL_CORPUS_RECORD_BASE64_LENGTH, HELL_CORPUS_RECORD_BYTES } from '../constants/hell-corpus.constant';

import { ensureHellPuzzleRating } from './ensure-hell-puzzle-rating.util';
import { getCorpusRecord } from './get-corpus-record.util';

import type { RatedCorpusPuzzleInterface } from '../interfaces/rated-corpus-puzzle.interface';

export const getHellCorpusRecord = (index: number): RatedCorpusPuzzleInterface =>
    ensureHellPuzzleRating(
        getCorpusRecord(
            {
                corpusBase64: HELL_CORPUS_BASE64,
                corpusSize: HELL_CORPUS_SIZE,
                recordBase64Length: HELL_CORPUS_RECORD_BASE64_LENGTH,
                recordBytes: HELL_CORPUS_RECORD_BYTES
            },
            index
        ),
        index
    );
