import { cs, type OnEventFn } from '@rnw-community/shared';
import { memo } from 'react';
import { Pressable, Text } from 'react-native';
import Reanimated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Colors } from '../../../@generic';
import { BlankCellValueConstant } from '../../constants/blank-cell-value.constant';
import { FieldGroupSizeConstant, FieldSizeConstant } from '../../constants/field.constant';
import { type CellInterface } from '../../interfaces/cell.interface';

import { CellStyles as styles } from './cell.styles';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

const isGroupEnd = (index: number): boolean => {
    return index < FieldSizeConstant - 1 && (index + 1) % FieldGroupSizeConstant === 0;
};

interface Props {
    cell: CellInterface;
    onSelect: OnEventFn<CellInterface | undefined>;
    isActive: boolean;
    isActiveValue: boolean;
    isCellHighlighted: boolean;
}

const getCellBgColor = (isActiveValue: boolean, isCellHighlighted: boolean) => {
    if (isActiveValue) {
        return Colors.cell.activeValue;
    } else if (isCellHighlighted) {
        return Colors.cell.highlighted;
    }

    return Colors.white;
};

const CellComponent = ({ cell, onSelect, isActive, isActiveValue, isCellHighlighted }: Props) => {
    const value = cell.value === BlankCellValueConstant ? '' : cell.value.toString();
    const isLastRow = cell.y === 8;
    const isLastCol = cell.x === 8;
    const backgroundColor = getCellBgColor(isActiveValue, isCellHighlighted);

    const progress = useSharedValue(0);
    const animatedStyles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(progress.value, [0, 1], [backgroundColor, Colors.cell.active])
    }));
    progress.value = withTiming(isActive ? 1 : 0, { duration: 200 });

    const handlePress = () => void onSelect(isActive ? undefined : cell);

    const cellStyles = [
        styles.cell,
        cs(isGroupEnd(cell.x), styles.cellGroupXEnd),
        cs(isGroupEnd(cell.y), styles.cellGroupYEnd),
        cs(isLastRow, styles.cellLastRow),
        cs(isLastCol, styles.cellLastCol),
        animatedStyles
    ];
    const textStyles = [styles.cellText, cs(isActiveValue, styles.cellActiveValueText), cs(isActive, styles.cellActiveText)];

    return (
        <ReanimatedPressable style={cellStyles} onPress={handlePress}>
            <Text style={textStyles}>{value}</Text>
        </ReanimatedPressable>
    );
};

export const Cell = memo(CellComponent);
