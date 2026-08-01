import { HELL_CORPUS_BASE64, HELL_CORPUS_SIZE } from '../constants/hell-corpus-data.constant';
import { HELL_CORPUS_RECORD_BASE64_LENGTH } from '../constants/hell-corpus.constant';

import { decodeBase64Bytes } from './decode-base64-bytes.util';
import { decodeHellCorpusRecord } from './decode-hell-corpus-record.util';

export const getHellCorpusPuzzle = (index: number): string => {
    const isValidIndex = Number.isInteger(index) && index >= 0 && index < HELL_CORPUS_SIZE;
    if (!isValidIndex) {
        throw new Error(`Hell corpus index must be an integer between 0 and ${HELL_CORPUS_SIZE - 1}, received ${index}`);
    }

    const recordStart = index * HELL_CORPUS_RECORD_BASE64_LENGTH;
    const recordBase64 = HELL_CORPUS_BASE64.slice(recordStart, recordStart + HELL_CORPUS_RECORD_BASE64_LENGTH);

    return decodeHellCorpusRecord(decodeBase64Bytes(recordBase64));
};
