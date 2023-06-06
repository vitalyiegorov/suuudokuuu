import { useMemo } from 'react';
import { View } from 'react-native';

import { type OnEventFn, isDefined } from '@rnw-community/shared';

import { type AvailableValuesType } from '../../../@logic/types/available-values.type';
import { AvailableValuesItem } from '../available-values-item/available-values-item';

import { AvailableValuesStyles as styles } from './available-values.styles';

const getPossibleValues = (availableValues: AvailableValuesType) =>
    Object.keys(availableValues)
        .map(Number)
        .filter(key => availableValues[key].count > 0 && key > 0)
        .map(key => key);

interface Props {
    availableValues: AvailableValuesType;
    onSelectValue?: OnEventFn<number>;
    currentCorrectValue: number;
}

export const AvailableValues = ({ currentCorrectValue, onSelectValue, availableValues }: Props) => {
    const possibleValues = useMemo(() => getPossibleValues(availableValues), [availableValues]);

    return (
        <View style={styles.wrapper}>
            {possibleValues.map(value => (
                <AvailableValuesItem
                    correctValue={currentCorrectValue}
                    isActive={false}
                    key={`possible-value-${value}`}
                    progress={availableValues[value].progress}
                    value={value}
                    {...(isDefined(onSelectValue) && { onSelect: onSelectValue })}
                />
            ))}
        </View>
    );
};
