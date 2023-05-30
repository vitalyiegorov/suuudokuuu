import { View } from 'react-native';
import { useSelector } from 'react-redux';

import { isDefined } from '@rnw-community/shared';

import { useAppDispatch } from '../../../@generic';
import type { CellInterface, FieldInterface } from '../../../@logic';
import { BlankCellValueConstant, FieldSizeConstant } from '../../../@logic';
import { gameSelectValueAction } from '../../store/actions/game-select-value.action';
import {
    gameAvailableValuesSelector,
    gameFullFieldSelector,
    gamePossibleValuesSelector,
    gameSelectedCellSelector
} from '../../store/game.selectors';
import { AvailableValuesItem } from '../available-values-item/available-values-item';

import { AvailableValuesStyles as styles } from './available-values.styles';

const getValueProgress = (allValues: Record<number, number>, value: number) => (allValues[value] / FieldSizeConstant) * 100;
const getCorrectValue = (filledField: FieldInterface, selectedCell?: CellInterface): number => {
    if (isDefined(selectedCell) && filledField.length > 0) {
        return filledField[selectedCell.y][selectedCell.x].value;
    }

    return BlankCellValueConstant;
};

export const AvailableValues = () => {
    const fullField = useSelector(gameFullFieldSelector);
    const possibleValues = useSelector(gamePossibleValuesSelector);
    const selectedCell = useSelector(gameSelectedCellSelector);
    const allValues = useSelector(gameAvailableValuesSelector);

    const correctValue = getCorrectValue(fullField, selectedCell);
    const canPress = isDefined(selectedCell) && selectedCell.value === BlankCellValueConstant;

    const dispatch = useAppDispatch();
    const handleSelect = (value: number) => void dispatch(gameSelectValueAction(value));

    return (
        <View style={styles.wrapper}>
            {possibleValues.map(value => (
                <AvailableValuesItem
                    canPress={canPress}
                    isActive={false}
                    isCorrect={value === correctValue}
                    key={value}
                    onSelect={handleSelect}
                    progress={getValueProgress(allValues, value)}
                    value={value}
                />
            ))}
        </View>
    );
};
