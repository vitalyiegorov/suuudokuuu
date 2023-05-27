import { isDefined } from '@rnw-community/shared';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '../../../@generic';
import { BlankCellValueConstant } from '../../constants/blank-cell-value.constant';
import { FieldSizeConstant } from '../../constants/field.constant';
import { type CellInterface } from '../../interfaces/cell.interface';
import { type FieldInterface } from '../../interfaces/field.interface';
import { gameSelectValueAction } from '../../store/actions/game-select-value.action';
import { gameFieldSelector, gameFilledFieldSelector, gameSelectedCellSelector } from '../../store/game.selectors';
import { AvailableValuesItem } from '../available-values-item/available-values-item';

import { AvailableValuesStyles as styles } from './available-values.styles';

const getAvailableFieldValues = (field: FieldInterface): Record<number, number> => {
    const availableValues: Record<string, number> = {};
    for (let y = 0; y < field.length; y++) {
        for (let x = 0; x < field[y].length; x++) {
            const value = field[y][x].value;
            if (value !== BlankCellValueConstant) {
                availableValues[value] = isDefined(availableValues[value]) ? availableValues[value] + 1 : 1;
            }
        }
    }

    return availableValues;
};
const getValueProgress = (allValues: Record<number, number>, value: number) => (allValues[value] / FieldSizeConstant) * 100;
const getAvailableValues = (allValues: Record<number, number>) =>
    Object.keys(allValues)
        .filter(key => allValues[Number(key)] < FieldSizeConstant)
        .map(Number);
const getCorrectValue = (filledField: FieldInterface, selectedCell?: CellInterface): number => {
    if (isDefined(selectedCell) && filledField.length > 0) {
        return filledField[selectedCell.y][selectedCell.x].value;
    }

    return BlankCellValueConstant;
};

export const AvailableValues = () => {
    const filledField = useSelector(gameFilledFieldSelector);
    const gameField = useSelector(gameFieldSelector);
    const selectedCell = useSelector(gameSelectedCellSelector);

    const allValues = getAvailableFieldValues(gameField);
    const correctValue = getCorrectValue(filledField, selectedCell);
    const canPress = isDefined(selectedCell) && selectedCell.value === BlankCellValueConstant;

    const dispatch = useAppDispatch();
    const handleSelect = (value: number) => void dispatch(gameSelectValueAction(value));

    return (
        <View style={styles.wrapper}>
            {getAvailableValues(allValues).map(value => (
                <AvailableValuesItem
                    canPress={canPress}
                    isCorrect={value === correctValue}
                    value={value}
                    key={value}
                    onSelect={handleSelect}
                    isActive={false}
                    progress={getValueProgress(allValues, value)}
                />
            ))}
        </View>
    );
};
