import { View } from 'react-native';

import { type OnEventFn, isDefined } from '@rnw-community/shared';

import { AvailableValuesItem } from '../available-values-item/available-values-item';

import { AvailableValuesStyles as styles } from './available-values.styles';

import type { Sudoku } from '../../../@logic/classes/sudoku/sudoku';
import type { CellInterface } from '../../../@logic/interfaces/cell.interface';
import type { ScoredCellsInterface } from '../../../@logic/interfaces/scored-cells.interface';


interface Props {
    readonly sudoku: Sudoku;
    readonly possibleValues: number[];
    readonly selectedCell?: CellInterface;
    readonly onCorrectValue: OnEventFn<[CellInterface, ScoredCellsInterface]>;
    readonly onWrongValue: OnEventFn<number>;
}

export const AvailableValues = ({ sudoku, possibleValues, selectedCell, onCorrectValue, onWrongValue }: Props) => {
    const isBlankCellSelected = sudoku.isBlankCell(selectedCell);
    const currentCorrectValue = sudoku.getCorrectValue(selectedCell);

    const handleSelectValue = (value: number) => {
        if (isBlankCellSelected && isDefined(selectedCell)) {
            const newValueCell = { ...selectedCell, value };
            if (sudoku.isCorrectValue(newValueCell)) {
                onCorrectValue([selectedCell, sudoku.setCellValue(newValueCell)]);
            } else {
                onWrongValue(value);
            }
        }
    };

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
