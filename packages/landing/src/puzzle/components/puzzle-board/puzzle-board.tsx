import { parsePuzzleGivens } from '../../utils/parse-puzzle-givens.util';
import { PuzzleBoardRow } from '../puzzle-board-row/puzzle-board-row';

import type { ReactNode } from 'react';

const COLUMN_LABELS = Array.from({ length: 9 }, (_, index) => `c${index + 1}`);

interface Props {
    givens: string;
    children: ReactNode;
}

export const PuzzleBoard = ({ children, givens }: Props) => {
    const rows = parsePuzzleGivens(givens);

    return (
        <div className="puzzle-board">
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
                    {rows.map(row => (
                        <PuzzleBoardRow key={row.index} row={row} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
