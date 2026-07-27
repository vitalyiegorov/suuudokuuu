import { GameStateSerializer, SharedPayloadKindEnum } from '@suuudokuuu/encoder';

import { initialGameState } from '../store/game.state';

import { stringToGameState } from './string-to-game-state.util';

import type { GameState } from '../store/game.state';

export interface DecodedSharedGameStateInterface {
    gameState: GameState;
    isReadable: boolean;
    kind: SharedPayloadKindEnum;
}

const serializer = new GameStateSerializer();

export const decodeSharedGameState = (stateString: string): DecodedSharedGameStateInterface => {
    try {
        const { kind } = serializer.decodeState(stateString);

        return { gameState: stringToGameState(stateString), isReadable: true, kind };
    } catch {
        return { gameState: initialGameState, isReadable: false, kind: SharedPayloadKindEnum.Puzzle };
    }
};
