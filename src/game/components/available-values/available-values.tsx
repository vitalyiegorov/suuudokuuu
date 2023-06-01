import { useCallback } from 'react';
import { View } from 'react-native';

import { type OnEventFn, isDefined } from '@rnw-community/shared';

import type { CellInterface, ScoredCellsInterface, Sudoku } from '../../../@logic';
import { AvailableValuesItem } from '../available-values-item/available-values-item';

import { AvailableValuesStyles as styles } from './available-values.styles';

interface Props {
    sudoku: Sudoku;
    possibleValues: number[];
    selectedCell?: CellInterface;
    onCorrectValue: OnEventFn<[CellInterface, ScoredCellsInterface]>;
    onWrongValue: OnEventFn<number>;
}

export const AvailableValues = ({ sudoku, possibleValues, selectedCell, onCorrectValue, onWrongValue }: Props) => {
    const isBlankCellSelected = sudoku.isBlankCell(selectedCell);
    const currentCorrectValue = sudoku.getCorrectValue(selectedCell);

    const handleSelectValue = useCallback(
        (value: number) => {
            if (isBlankCellSelected && isDefined(selectedCell)) {
                const newValueCell = { ...selectedCell, value };
                if (sudoku.isCorrectValue(newValueCell)) {
                    onCorrectValue([selectedCell, sudoku.setCellValue(newValueCell)]);
                } else {
                    onWrongValue(value);
                }
            }
        },
        [isBlankCellSelected, onCorrectValue, onWrongValue, selectedCell, sudoku]
    );

    return (
        <View style={styles.wrapper}>
            {possibleValues.map(value => (
                <AvailableValuesItem
                    canPress={isBlankCellSelected}
                    correctValue={currentCorrectValue}
                    isActive={false}
                    key={`possible-value-${value}`}
                    onSelect={handleSelectValue}
                    progress={sudoku.getValueProgress(value)}
                    value={value}
                />
            ))}
        </View>
    );
};
