import { cs, type OnEventFn } from '@rnw-community/shared';
import { memo } from 'react';
import { Pressable, Text } from 'react-native';
import Reanimated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { BlankCellValueContant } from '../../constants/blank-cell-value.contant';
import { type CellInterface } from '../../interfaces/cell.interface';
import { isGroupEnd } from '../../utils/cell/is-group-end.util';
import { Colors } from '../theme';

import { CellStyles as styles } from './cell.styles';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

interface Props {
    cell: CellInterface;
    onSelect: OnEventFn<CellInterface | undefined>;
    isActive: boolean;
    isActiveValue: boolean;
    isCellHighlighted: boolean;
}

const CellComponent = ({ cell, onSelect, isActive, isActiveValue, isCellHighlighted }: Props) => {
    const value = cell.value === BlankCellValueContant ? '' : cell.value.toString();
    const isLastRow = cell.y === 8;
    const isLastCol = cell.x === 8;

    const progress = useSharedValue(0);
    const animatedStyles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(progress.value, [0, 1], [Colors.white, Colors.cell.active])
    }));

    const handlePress = () => {
        progress.value = withTiming(isActive ? 0 : 1, { duration: 500 });

        onSelect(isActive ? undefined : cell);
    };

    const cellStyles = [
        styles.cell,
        cs(isGroupEnd(cell.x), styles.cellGroupXEnd),
        cs(isGroupEnd(cell.y), styles.cellGroupYEnd),
        cs(isCellHighlighted, styles.cellHighlighted),
        cs(isLastRow, styles.cellLastRow),
        cs(isLastCol, styles.cellLastCol),
        cs(isActiveValue, styles.cellHighlightedValue),
        cs(isActive, animatedStyles)
    ];
    const textStyles = [styles.cellText, cs(isActiveValue, styles.cellHighlightedText), cs(isActive, styles.cellActiveText)];

    return (
        <ReanimatedPressable style={cellStyles} onPress={handlePress}>
            <Text style={textStyles}>{value}</Text>
        </ReanimatedPressable>
    );
};

export const Cell = memo(CellComponent);
