import { GameStateSerializer, SharedPayloadKindEnum } from '@suuudokuuu/encoder';
import { initialCurrentRun } from '@suuudokuuu/progress';

import { stringToGameState } from './string-to-game-state.util';

import type { CurrentRunType } from '@suuudokuuu/progress';

export interface DecodedSharedGameStateInterface {
    gameState: CurrentRunType;
    isReadable: boolean;
    kind: SharedPayloadKindEnum;
}

const serializer = new GameStateSerializer();

export const decodeSharedGameState = (stateString: string): DecodedSharedGameStateInterface => {
    try {
        const { kind } = serializer.decodeState(stateString);

        return { gameState: stringToGameState(stateString), isReadable: true, kind };
    } catch {
        return { gameState: initialCurrentRun, isReadable: false, kind: SharedPayloadKindEnum.Puzzle };
    }
};
