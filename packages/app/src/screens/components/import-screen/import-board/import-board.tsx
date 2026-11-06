import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { SpacingConstant } from '@suuudokuuu/ui/theme';
import { useState } from 'react';
import { View, useWindowDimensions, type LayoutChangeEvent } from 'react-native';

import { FieldStyles as fieldStyles } from '../../../../game/components/field/field.styles';
import { gameGetBoardGeometry } from '../../../../game/utils/game-get-board-geometry.util';
import { useSettings } from '../../../../settings/query/use-settings.query';
import { ImportCellToneEnum } from '../enums/import-cell-tone.enum';
import { ImportBoardCell } from '../import-board-cell/import-board-cell';

import { ImportBoardStyles as styles } from './import-board.styles';

import type { CellInterface } from '@suuudokuuu/generator';

const boardMaxWidth = 480;
const { fieldSize } = defaultSudokuConfig;

interface Props {
    readonly entryString: string;
    readonly uncertainCellIndexes: readonly number[];
    readonly puzzleString: string;
    readonly conflictCellIndexes: readonly number[];
    readonly selectedCellIndex: number | null;
    readonly onSelectCell: (cellIndex: number) => void;
}

export const ImportBoard = ({
    puzzleString,
    entryString,
    uncertainCellIndexes,
    conflictCellIndexes,
    selectedCellIndex,
    onSelectCell
}: Props) => {
    const settings = useSettings();
    const window = useWindowDimensions();
    const [width, setWidth] = useState(Math.min(boardMaxWidth, window.width - SpacingConstant.lg * 2));
    const handleLayout = (event: LayoutChangeEvent) => void setWidth(event.nativeEvent.layout.width);
    const { cellSize, cellMargin } = gameGetBoardGeometry({
        availableWidth: width,
        availableHeight: width,
        reservedHeight: 0,
        fieldSize,
        fieldGroupSize: defaultSudokuConfig.fieldGroupWidth,
        cellMargin: settings.cellMargin
    });

    const handleSelect = (cell: CellInterface) => void onSelectCell(cell.y * fieldSize + cell.x);
    const [field] = Sudoku.convertFieldFromString(
        Array.from(puzzleString, (digit, index) => (digit === '.' ? entryString[index] : digit)).join(''),
        defaultSudokuConfig
    );

    return (
        <View onLayout={handleLayout} style={styles.area}>
            {cellSize > 0 ? (
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
            ) : null}
        </View>
    );
};
