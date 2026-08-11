import type { HypothesisBoardInterface } from '../interfaces/hypothesis-board.interface';

export const getPropagationKey = (board: HypothesisBoardInterface, cellIndex: number, value: number): number =>
    cellIndex * (board.valueCount + 1) + value;
