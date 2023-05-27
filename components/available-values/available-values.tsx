import { isDefined } from '@rnw-community/shared';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import { BlankCellValueConstant } from '../../constants/blank-cell-value.constant';
import { FieldSizeConstant } from '../../constants/field.constant';
import { useAppDispatch } from '../../hooks/redux.hook';
import { type CellInterface } from '../../interfaces/cell.interface';
import { type FieldInterface } from '../../interfaces/field.interface';
import { appRootSelectValueAction } from '../../store/app-root/actions/app-root-select-value.action';
import {
    appRootAvailableValuesSelector,
    appRootFilledFieldSelector,
    appRootSelectedCellSelector
} from '../../store/app-root/app-root.selectors';
import { AvailableValuesItem } from '../available-values-item/available-values-item';

import { AvailableValuesStyles as styles } from './available-values.styles';

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
    const filledField = useSelector(appRootFilledFieldSelector);
    const allValues = useSelector(appRootAvailableValuesSelector);
    const selectedCell = useSelector(appRootSelectedCellSelector);

    const correctValue = getCorrectValue(filledField, selectedCell);
    const canPress = isDefined(selectedCell) && selectedCell.value === BlankCellValueConstant;

    const dispatch = useAppDispatch();
    const handleSelect = (value: number) => void dispatch(appRootSelectValueAction(value));

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
