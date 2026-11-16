import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { View } from 'react-native';

import { FieldStyles as fieldStyles } from '../../../../game/components/field/field.styles';
import { ImportCellToneEnum } from '../enums/import-cell-tone.enum';
import { ImportBoardCell } from '../import-board-cell/import-board-cell';

import { ImportBoardStyles as styles } from './import-board.styles';

import type { BoardGeometryInterface } from '../../../../game/interface/board-geometry.interface';
import type { ImportReviewStateInterface } from '../interface/import-review-state.interface';
import type { CellInterface } from '@suuudokuuu/generator';

const { fieldSize } = defaultSudokuConfig;

interface Props {
    readonly geometry: BoardGeometryInterface;
    readonly puzzleString: string;
    readonly review: Pick<ImportReviewStateInterface, 'entryString' | 'selectedCellIndex' | 'uncertainCellIndexes'>;
    readonly conflictCellIndexes: readonly number[];
    readonly onSelectCell: (cellIndex: number) => void;
}

export const ImportBoard = ({ geometry, puzzleString, review, conflictCellIndexes, onSelectCell }: Props) => {
    const { entryString, selectedCellIndex, uncertainCellIndexes } = review;
    const { boardSize, cellSize, cellMargin } = geometry;

    const handleSelect = (cell: CellInterface) => void onSelectCell(cell.y * fieldSize + cell.x);
    const [field] = Sudoku.convertFieldFromString(
        Array.from(puzzleString, (digit, index) => (digit === '.' ? entryString[index] : digit)).join(''),
        defaultSudokuConfig
    );

    const areaStyles = [styles.area, { height: boardSize, width: boardSize }];

    return (
        <View style={areaStyles}>
            <View style={fieldStyles.wrapper}>
                {field.map(row => (
                    <View key={`row-${row[0].y}`} style={fieldStyles.row}>
                        {row.map(cell => {
                            const cellIndex = cell.y * fieldSize + cell.x;

                            const isEntry = /[1-9]/u.test(entryString[cellIndex]);
                            const isUncertain = uncertainCellIndexes.includes(cellIndex);
                            const entryTone = isUncertain ? ImportCellToneEnum.UNCERTAIN_ENTRY : ImportCellToneEnum.ENTRY;
                            const clueTone = isUncertain ? ImportCellToneEnum.UNCERTAIN : ImportCellToneEnum.CLUE;
                            const tone = isEntry ? entryTone : clueTone;
                            const cellTone = conflictCellIndexes.includes(cellIndex) ? ImportCellToneEnum.CONFLICT : tone;

                            return (
                                <ImportBoardCell
                                    cell={cell}
                                    cellMargin={cellMargin}
                                    cellSize={cellSize}
                                    isSelected={cellIndex === selectedCellIndex}
                                    key={cellIndex}
                                    onSelect={handleSelect}
                                    tone={cellTone}
                                />
                            );
                        })}
                    </View>
                ))}
            </View>
        </View>
    );
};
