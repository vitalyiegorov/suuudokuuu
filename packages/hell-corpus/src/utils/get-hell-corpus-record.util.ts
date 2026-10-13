import { HELL_CORPUS_BASE64, HELL_CORPUS_RECORD_BYTES, HELL_CORPUS_SIZE } from '../constants/hell-corpus-data.constant';
import { HELL_CORPUS_RECORD_BASE64_LENGTH } from '../constants/hell-corpus.constant';

import { getCorpusRecord } from './get-corpus-record.util';

import type { RatedCorpusPuzzleInterface } from '../interfaces/rated-corpus-puzzle.interface';

export const getHellCorpusRecord = (index: number): RatedCorpusPuzzleInterface =>
    getCorpusRecord(
        {
            corpusBase64: HELL_CORPUS_BASE64,
            corpusSize: HELL_CORPUS_SIZE,
            recordBase64Length: HELL_CORPUS_RECORD_BASE64_LENGTH,
            recordBytes: HELL_CORPUS_RECORD_BYTES
        },
        index
    );
