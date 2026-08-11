import { isPositiveNumber } from '@rnw-community/shared';

import type { PuzzleBoardCellInterface } from '../../interfaces/puzzle-board-cell.interface';

interface Props {
    cell: PuzzleBoardCellInterface;
}

export const PuzzleBoardCell = ({ cell }: Props) => {
    const hasValue = isPositiveNumber(cell.value);
    const content = hasValue ? <span className="sudoku-cell__value">{cell.value}</span> : null;

    return <td className="sudoku-cell">{content}</td>;
};
