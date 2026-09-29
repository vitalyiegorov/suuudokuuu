import type { GameFieldStatePayloadInterface } from './game-field-state-payload.interface';
import type { CellInterface, ScoredCellsInterface } from '@suuudokuuu/generator';

export interface GameSavePayloadInterface extends GameFieldStatePayloadInterface {
    readonly correctCell: CellInterface;
    readonly scoredCells: ScoredCellsInterface;
}
