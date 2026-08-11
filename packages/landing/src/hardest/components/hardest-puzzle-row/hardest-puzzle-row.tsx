import { HardestPuzzleCell } from '../hardest-puzzle-cell/hardest-puzzle-cell';

import type { HardestPuzzleRowInterface } from '../../interfaces/hardest-puzzle-row.interface';

interface Props {
    row: HardestPuzzleRowInterface;
}

export const HardestPuzzleRow = ({ row }: Props) => (
    <tr className="sudoku-board__row">
        <th className="sudoku-board__row-header" scope="row">
            r{row.index + 1}
        </th>
        {row.cells.map(cell => (
            <HardestPuzzleCell cell={cell} key={cell.label} />
        ))}
    </tr>
);
