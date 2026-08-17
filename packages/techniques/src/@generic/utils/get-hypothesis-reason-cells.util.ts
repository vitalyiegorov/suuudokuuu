import type { HypothesisBoardInterface } from '../interfaces/hypothesis-board.interface';
import type { HypothesisPropagationInterface } from '../interfaces/hypothesis-propagation.interface';
import type { CellInterface } from '@suuudokuuu/generator';

export const getHypothesisReasonCells = (
    board: HypothesisBoardInterface,
    propagations: HypothesisPropagationInterface[]
): CellInterface[] => {
    const reasonCellIndexes = new Set<number>();

    for (const propagation of propagations) {
        for (const cellIndex of propagation.placedCellIndexes) {
            reasonCellIndexes.add(cellIndex);
        }
    }

    return [...reasonCellIndexes].sort((firstIndex, secondIndex) => firstIndex - secondIndex).map(cellIndex => board.cells[cellIndex]);
};
