import type { TechniqueExampleCellInterface } from '../../interfaces/technique-example-cell.interface';

interface Props {
    cell: TechniqueExampleCellInterface;
}

export const TechniqueExampleCellValue = ({ cell }: Props) => {
    const isPlacedValue = cell.placedValue > 0;
    const value = isPlacedValue ? cell.placedValue : cell.value;

    return (
        <span className="sudoku-cell__value" data-placed={isPlacedValue}>
            {value}
        </span>
    );
};
