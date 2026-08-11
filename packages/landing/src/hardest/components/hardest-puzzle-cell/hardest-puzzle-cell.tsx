import { isPositiveNumber } from '@rnw-community/shared';

import type { HardestPuzzleCellInterface } from '../../interfaces/hardest-puzzle-cell.interface';

interface Props {
    cell: HardestPuzzleCellInterface;
}

export const HardestPuzzleCell = ({ cell }: Props) => {
    const hasValue = isPositiveNumber(cell.value);
    const content = hasValue ? <span className="sudoku-cell__value">{cell.value}</span> : null;

    return <td className="sudoku-cell">{content}</td>;
};
