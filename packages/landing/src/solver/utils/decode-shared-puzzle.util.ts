import { GameStateSerializer } from '@suuudokuuu/encoder';

import { normalizePuzzleEntry } from './normalize-puzzle-entry.util';

const SHARED_PATH_SEGMENT = '/shared/';
const PAYLOAD_TERMINATOR_PATTERN = /[?#\s]/u;

export const decodeSharedPuzzle = (link: string): string => {
    const [payload = ''] = link.slice(link.lastIndexOf(SHARED_PATH_SEGMENT) + SHARED_PATH_SEGMENT.length).split(PAYLOAD_TERMINATOR_PATTERN);

    return normalizePuzzleEntry(new GameStateSerializer().decodeState(decodeURIComponent(payload)).field);
};
