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
    const { sudokuString, score, mistakes, elapsedTime, isPaused, isFinished, hasCandidates } = gameState;

    const url = new URL(window.location.href);
    url.searchParams.set('sudokuString', sudokuString);
    url.searchParams.set('score', score.toString());
    url.searchParams.set('mistakes', mistakes.toString());
    url.searchParams.set('elapsedTime', elapsedTime.toString());
    url.searchParams.set('paused', isPaused.toString());
    url.searchParams.set('isFinished', isFinished.toString());
    url.searchParams.set('hasCandidates', hasCandidates.toString());

    return url.toString();
};

export const urlToGameState = (input: SerializedGameState): GameState => ({
    ...initialGameState,
    ...(isDefined(input.sudokuString) && { sudokuString: input.sudokuString }),
    ...(isDefined(input.score) && { score: parseInt(input.score ?? '0', 10) }),
    ...(isDefined(input.mistakes) && { mistakes: parseInt(input.mistakes ?? '0', 10) }),
    ...(isDefined(input.elapsedTime) && { elapsedTime: parseInt(input.elapsedTime ?? '0', 10) }),
    ...(isDefined(input.isPaused) && { paused: Boolean(input.isPaused) }),
    ...(isDefined(input.isFinished) && { isFinished: Boolean(input.isFinished) }),
    ...(isDefined(input.hasCandidates) && { hasCandidates: Boolean(input.hasCandidates) })
});
