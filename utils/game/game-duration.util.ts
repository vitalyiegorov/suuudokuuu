import { intervalToDuration } from 'date-fns';

import { type GameInterface } from '../../interfaces/game.interface';

export const gameDuration = (game: GameInterface): Duration =>
    intervalToDuration({ start: new Date(game.endedAt), end: new Date(game.startedAt) });
