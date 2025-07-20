import { View } from 'react-native';

import { AvailableValuesItem } from '../available-values-item/available-values-item';

import { AvailableValuesStyles as styles } from './available-values.styles';

import type { OnEventFn } from '@rnw-community/shared';
import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

interface Props {
    readonly sudoku: Sudoku;
    readonly possibleValues: number[];
    readonly selectedCell?: CellInterface;
    readonly onSelect: OnEventFn<number>;
}

export const AvailableValues = ({ sudoku, possibleValues, selectedCell, onSelect }: Props) => {
    const isBlankCellSelected = sudoku.isBlankCell(selectedCell);
    const currentCorrectValue = sudoku.getCorrectValue(selectedCell);

    return (
        <View style={styles.wrapper}>
            {possibleValues.map(value => (
                <AvailableValuesItem
                    canPress={isBlankCellSelected}
                    correctValue={currentCorrectValue}
                    isActive={false}
                    key={`possible-value-${value}`}
                    onSelect={onSelect}
                    progress={sudoku.getValueProgress(value)}
                    value={value}
                />
            ))}
        </View>
    );
};
