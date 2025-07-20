import { memo } from 'react';
import { Pressable } from 'react-native';
import Reanimated, { type SharedValue, interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

import { type OnEventFn, cs } from '@rnw-community/shared';

import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { Colors } from '../../../@generic/styles/theme';
import { FieldCellText } from '../field-cell-text/field-cell-text';

import { FieldCellSelectors as selectors } from './field-cell.selectors';
import { FieldCellStyles as styles } from './field-cell.styles';

import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

const getCellBgColor = (isActiveValue: boolean, isCellHighlighted: boolean, isWrong: boolean) => {
    if (isWrong) {
        return Colors.cell.error;
    } else if (isActiveValue) {
        return Colors.cell.activeValue;
    } else if (isCellHighlighted) {
        return Colors.cell.highlighted;
    }

    return Colors.white;
};

const getCellSelector = (props: Props): selectors => {
    if (props.isActive) {
        return selectors.Active;
    } else if (props.isActiveValue) {
        return selectors.ActiveValue;
    } else if (props.isHighlighted) {
        return selectors.Highlighted;
    }

    return selectors.Root;
};

const animationConfig = { duration: animationDurationConstant };

interface Props {
    readonly hasAnimation: boolean;
    readonly textAnimation: SharedValue<number>;
    readonly cell: CellInterface;
    readonly sudoku: Sudoku;
    readonly onSelect: OnEventFn<CellInterface | undefined>;
    readonly isActive: boolean;
    readonly isActiveValue: boolean;
    readonly isHighlighted: boolean;
    readonly isWrong: boolean;
}

const FieldCellComponent = (props: Props) => {
    const { sudoku, cell, onSelect, isActive, isActiveValue, isHighlighted, isWrong, hasAnimation, textAnimation } = props;

    const isLastRow = cell.y === 8;
    const isLastCol = cell.x === 8;
    const backgroundColor = getCellBgColor(isActiveValue, isHighlighted, isWrong);

    const animation = useDerivedValue(() => withTiming(isActive ? 1 : 0, animationConfig));

    const animatedStyles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(animation.value, [0, 1], [backgroundColor, Colors.cell.active])
    }));

    // eslint-disable-next-line no-undefined
    const handlePress = () => void onSelect(isActive ? undefined : cell);

    const cellStyles = [
        styles.container,
        cs(sudoku.isLastInCellGroupX(cell), styles.groupXEnd),
        cs(sudoku.isLastInCellGroupY(cell), styles.groupYEnd),
        cs(isLastRow, styles.lastRow),
        cs(isLastCol, styles.lastCol),
        animatedStyles
    ];

    return (
        <ReanimatedPressable onPress={handlePress} style={cellStyles} testID={getCellSelector(props)}>
            <FieldCellText
                animation={textAnimation}
                cell={cell}
                hasAnimation={hasAnimation}
                isActive={isActive}
                isActiveValue={isActiveValue}
                isHighlighted={isHighlighted}
                sudoku={sudoku}
            />
        </ReanimatedPressable>
    );
};

export const FieldCell = memo(
    FieldCellComponent,
    (prevProps, nextProps) =>
        prevProps.cell.value === nextProps.cell.value &&
        prevProps.hasAnimation === nextProps.hasAnimation &&
        prevProps.isActive === nextProps.isActive &&
        prevProps.isWrong === nextProps.isWrong &&
        prevProps.isActiveValue === nextProps.isActiveValue &&
        prevProps.isHighlighted === nextProps.isHighlighted
);
