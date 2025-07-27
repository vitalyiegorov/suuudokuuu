import { isDefined } from '@rnw-community/shared';

export interface GameState {
    sudokuString: string;
    score: number;
    mistakes: number;
    elapsedTime: number;
    isPaused: boolean;
    isFinished: boolean;
    hasCandidates: boolean;
}

export type SerializedGameState = Partial<Record<keyof Omit<GameState, 'sudokuString'>, string>> & Pick<GameState, 'sudokuString'>;

export const initialGameState: GameState = {
    isFinished: false,
    isPaused: false,
    elapsedTime: 0,
    sudokuString: '',
    mistakes: 0,
    score: 0,
    hasCandidates: false
};

export const gameStateToUrl = (gameState: GameState): string => {
    const { sudokuString, score, mistakes, elapsedTime, isFinished, hasCandidates } = gameState;

    const searchParams = new URLSearchParams();
    searchParams.set('sudokuString', sudokuString);
    searchParams.set('score', score.toString());
    searchParams.set('mistakes', mistakes.toString());
    searchParams.set('elapsedTime', elapsedTime.toString());
    searchParams.set('isFinished', isFinished.toString());
    searchParams.set('hasCandidates', hasCandidates.toString());

    return searchParams.toString();
};

export const urlToGameState = (input: SerializedGameState): Partial<GameState> => ({
    ...(isDefined(input.sudokuString) && { sudokuString: input.sudokuString }),
    ...(isDefined(input.score) && { score: parseInt(input.score ?? '0', 10) }),
    ...(isDefined(input.mistakes) && { mistakes: parseInt(input.mistakes ?? '0', 10) }),
    ...(isDefined(input.elapsedTime) && { elapsedTime: parseInt(input.elapsedTime ?? '0', 10) }),
    ...(isDefined(input.isFinished) && { isFinished: input.isFinished === 'true' }),
    ...(isDefined(input.hasCandidates) && { hasCandidates: input.hasCandidates === 'true' })
});
