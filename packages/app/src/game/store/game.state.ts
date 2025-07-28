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
    const { isFinished, isPaused, hasCandidates, ...persistedParams } = gameState;

    return btoa(JSON.stringify(persistedParams));
};

export const urlToGameState = (gameStateString: string): Omit<GameState, 'isPaused' | 'isFinished' | 'hasCandidates'> => {
    const input = JSON.parse(atob(gameStateString)) as SerializedGameState;

    return {
        sudokuString: input.sudokuString,
        score: parseInt(input.score ?? '0', 10),
        mistakes: parseInt(input.mistakes ?? '0', 10),
        elapsedTime: parseInt(input.elapsedTime ?? '0', 10)
    };
};
