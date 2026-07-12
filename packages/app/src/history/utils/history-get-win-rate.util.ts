import { isPositiveNumber } from '@rnw-community/shared';

export const historyGetWinRate = (gamesWon: number, gamesCompleted: number) =>
    isPositiveNumber(gamesCompleted) ? Math.round((gamesWon / gamesCompleted) * 100) : 0;
