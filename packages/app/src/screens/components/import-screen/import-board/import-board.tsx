import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { View } from 'react-native';

import { FieldStyles as fieldStyles } from '../../../../game/components/field/field.styles';
import { useBoardGeometry } from '../../../../game/hooks/use-board-geometry.hook';
import { ImportBoardCell } from '../import-board-cell/import-board-cell';

import { ImportBoardStyles as styles } from './import-board.styles';

import type { CellInterface } from '@suuudokuuu/generator';

const { fieldSize } = defaultSudokuConfig;

interface Props {
    readonly entranceKey: number;
    readonly puzzleString: string;
    readonly conflictCellIndexes: readonly number[];
    readonly selectedCellIndex: number | null;
    readonly onSelectCell: (cellIndex: number) => void;
}

export const ImportBoard = ({ entranceKey, puzzleString, conflictCellIndexes, selectedCellIndex, onSelectCell }: Props) => {
    const { cellSize, cellMargin, onBoardAreaLayout } = useBoardGeometry(0);

    const handleSelect = (cell: CellInterface) => void onSelectCell(cell.y * fieldSize + cell.x);
    const [field] = Sudoku.convertFieldFromString(puzzleString, defaultSudokuConfig);

    return (
        <View onLayout={onBoardAreaLayout} style={styles.area}>
            <View key={entranceKey} style={fieldStyles.wrapper}>
                {field.map(row => (
                    <View key={`row-${row[0].y}`} style={fieldStyles.row}>
                        {row.map(cell => {
                            const cellIndex = cell.y * fieldSize + cell.x;

                            return (
                                <ImportBoardCell
                                    cell={cell}
                                    cellMargin={cellMargin}
                                    cellSize={cellSize}
                                    isConflict={conflictCellIndexes.includes(cellIndex)}
                                    isSelected={cellIndex === selectedCellIndex}
                                    key={cellIndex}
                                    onSelect={handleSelect}
                                />
                            );
                        })}
                    </View>
                ))}
            </View>
        </View>
    );
};
