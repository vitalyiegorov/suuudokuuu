import { PuzzleBoardCell } from '../puzzle-board-cell/puzzle-board-cell';

import type { PuzzleBoardRowInterface } from '../../interfaces/puzzle-board-row.interface';

interface Props {
    row: PuzzleBoardRowInterface;
}

export const PuzzleBoardRow = ({ row }: Props) => (
    <tr className="sudoku-board__row">
        <th className="sudoku-board__row-header" scope="row">
            r{row.index + 1}
        </th>
        {row.cells.map(cell => (
            <PuzzleBoardCell cell={cell} key={cell.label} />
        ))}
    </tr>
);
