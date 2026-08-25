import { TechniqueExampleRow } from '../technique-example-row/technique-example-row';
import { TechniqueExampleSolverOutput } from '../technique-example-solver-output/technique-example-solver-output';

import type { TechniqueExampleInterface } from '../../interfaces/technique-example.interface';
import type { ReactNode } from 'react';

const COLUMN_LABELS = Array.from({ length: 9 }, (_, index) => `c${index + 1}`);

interface Props {
    example: TechniqueExampleInterface;
    children: ReactNode;
}

export const TechniqueExampleBoard = ({ children, example }: Props) => (
    <div className="technique-example">
        <table className="sudoku-board">
            <caption className="sudoku-board__caption">{children}</caption>
            <thead>
                <tr>
                    <td className="sudoku-board__corner" />
                    {COLUMN_LABELS.map(columnLabel => (
                        <th className="sudoku-board__column-header" key={columnLabel} scope="col">
                            {columnLabel}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {example.rows.map(row => (
                    <TechniqueExampleRow key={row.index} row={row} />
                ))}
            </tbody>
        </table>
        <TechniqueExampleSolverOutput example={example} />
    </div>
);
