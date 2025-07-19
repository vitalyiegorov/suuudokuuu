export interface GameState {
    sudokuString: string;
    score: number;
    mistakes: number;
    elapsedTime: number;
    paused: boolean;
    isFinished: boolean;
}

export const initialGameState: GameState = {
    isFinished: false,
    paused: false,
    elapsedTime: 0,
    sudokuString: '',
    mistakes: 0,
    score: 0
};
