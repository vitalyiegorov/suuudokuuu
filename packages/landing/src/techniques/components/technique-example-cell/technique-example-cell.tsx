import { TechniqueExampleCellCandidates } from '../technique-example-cell-candidates/technique-example-cell-candidates';
import { TechniqueExampleCellValue } from '../technique-example-cell-value/technique-example-cell-value';

import type { TechniqueExampleCellInterface } from '../../interfaces/technique-example-cell.interface';

interface Props {
    cell: TechniqueExampleCellInterface;
}

export const TechniqueExampleCell = ({ cell }: Props) => {
    const showsValue = cell.value > 0 || cell.placedValue > 0;
    const content = showsValue ? <TechniqueExampleCellValue cell={cell} /> : <TechniqueExampleCellCandidates cell={cell} />;

    return (
        <td className="sudoku-cell" data-pattern={cell.isPatternCell} data-target={cell.isTargetCell}>
            {content}
        </td>
    );
};
