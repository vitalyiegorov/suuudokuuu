import { HELL_CORPUS_BASE64, HELL_CORPUS_SIZE } from '../constants/hell-corpus-data.constant';
import { HELL_CORPUS_RECORD_BASE64_LENGTH, HELL_CORPUS_RECORD_BYTES } from '../constants/hell-corpus.constant';

import { ensureHellPuzzleRating } from './ensure-hell-puzzle-rating.util';
import { getCorpusRecord } from './get-corpus-record.util';

import type { HellPuzzleInterface } from '../interfaces/hell-puzzle.interface';

export const getHellCorpusRecord = (index: number): HellPuzzleInterface =>
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
