import { TechniqueExampleCell } from '../technique-example-cell/technique-example-cell';

import type { TechniqueExampleRowInterface } from '../../interfaces/technique-example-row.interface';

interface Props {
    row: TechniqueExampleRowInterface;
}

export const TechniqueExampleRow = ({ row }: Props) => (
    <tr className="sudoku-board__row">
        <th className="sudoku-board__row-header" scope="row">
            r{row.index + 1}
        </th>
        {row.cells.map(cell => (
            <TechniqueExampleCell cell={cell} key={cell.label} />
        ))}
    </tr>
);
