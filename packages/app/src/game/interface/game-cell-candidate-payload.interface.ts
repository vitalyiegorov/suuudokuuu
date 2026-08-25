import type { GameFieldStatePayloadInterface } from './game-field-state-payload.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export interface GameCellCandidatePayloadInterface extends Pick<GameFieldStatePayloadInterface, 'candidates'> {
    readonly cell: CellInterface;
}
