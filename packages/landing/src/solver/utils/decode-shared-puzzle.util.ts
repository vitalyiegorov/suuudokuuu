import { GameStateSerializer } from '@suuudokuuu/encoder';

import { ENTRY_CELL_COUNT } from '../constants/puzzle-entry.constant';

import { readPuzzleEntryCells } from './read-puzzle-entry-cells.util';

const SHARED_PATH_SEGMENT = '/shared/';
const PAYLOAD_TERMINATOR_PATTERN = /[?#\s]/u;

export const decodeSharedPuzzle = (link: string): string => {
    const [payload = ''] = link.slice(link.lastIndexOf(SHARED_PATH_SEGMENT) + SHARED_PATH_SEGMENT.length).split(PAYLOAD_TERMINATOR_PATTERN);
    const cells = readPuzzleEntryCells(new GameStateSerializer().decodeState(decodeURIComponent(payload)).field);

    if (cells.length !== ENTRY_CELL_COUNT) {
        throw new Error(`The shared puzzle holds ${cells.length} cells instead of ${ENTRY_CELL_COUNT}`);
    }

    return cells.join('');
};
