import type { GameSetupInterface } from './game-setup.interface';
import type { GameState } from '../store/game.state';
import type { FieldEngine, FieldSnapshotInterface } from '@suuudokuuu/field-core';

export interface GameContextValueInterface {
    readonly create: (setup: GameSetupInterface) => void;
    readonly createFromState: (newState: GameState) => void;
    readonly engine: FieldEngine;
    readonly isCreatingGame: boolean;
    readonly snapshot: FieldSnapshotInterface;
}
