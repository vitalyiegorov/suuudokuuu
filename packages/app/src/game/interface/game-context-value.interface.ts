import type { GameSetupInterface } from './game-setup.interface';
import type { FieldEngine, FieldSnapshotInterface } from '@suuudokuuu/field-core';
import type { CurrentRunType } from '@suuudokuuu/progress';

export interface GameContextValueInterface {
    readonly create: (setup: GameSetupInterface) => void;
    readonly createDaily: (maxMistakes: number) => void;
    readonly createFromState: (newState: CurrentRunType) => void;
    readonly engine: FieldEngine;
    readonly isCreatingGame: boolean;
    readonly snapshot: FieldSnapshotInterface;
}
