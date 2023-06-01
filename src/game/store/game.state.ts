// ts-prune-ignore-next
export interface GameState {
    sudokuString: string;
    score: number;
    mistakes: number;
    elapsedTime: number;
    paused: boolean;
}

export const initialGameState: GameState = {
    paused: false,
    elapsedTime: 0,
    sudokuString: '',
    mistakes: 0,
    score: 0
};
