import type { GameFieldStatePayloadInterface } from './game-field-state-payload.interface';
import type { CellInterface, ScoredCellsInterface } from '@suuudokuuu/generator';
import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

export interface GameSavePayloadInterface extends GameFieldStatePayloadInterface {
    readonly correctCell: CellInterface;
    readonly scoredCells: ScoredCellsInterface;
    readonly technique?: SolutionTechniqueEnum;
}
