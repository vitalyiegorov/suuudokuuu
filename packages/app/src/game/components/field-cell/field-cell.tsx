import { memo, useImperativeHandle, useRef } from 'react';
import { Pressable } from 'react-native';
import Reanimated, { type AnimatedStyle, interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

import { type OnEventFn, cs } from '@rnw-community/shared';

import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { Colors } from '../../../@generic/styles/theme';
import { FieldCellText, type FieldCellTextRef } from '../field-cell-text/field-cell-text';

import { FieldCellSelectors as selectors } from './field-cell.selectors';
import { FieldCellStyles as styles } from './field-cell.styles';

import type { CellInterface, Sudoku } from '@suuudokuuu/generator';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

const getText = (isActive: boolean, isEmpty: boolean, cell: CellInterface): string => {
    if (isEmpty) {
        return isActive ? '•' : '';
    }

    return cell.value.toString();
};

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

const getCellStyles = (
    sudoku: Sudoku,
    cell: CellInterface,
    backgroundColor: string,
    animatedStyles: AnimatedStyle<object>
) => [
    styles.container,
    cs(sudoku.isLastInCellGroupX(cell), styles.groupXEnd),
    cs(sudoku.isLastInCellGroupY(cell), styles.groupYEnd),
    cs(sudoku.isLastInRow(cell), styles.lastRow),
    cs(sudoku.isLastInColumn(cell), styles.lastCol),
    { backgroundColor },
    animatedStyles
];

export interface FieldCellRef {
    triggerAnimation: () => void;
}

interface Props {
    readonly cell: CellInterface;
    readonly sudoku: Sudoku;
    readonly onSelect: OnEventFn<CellInterface | undefined>;
    readonly isActive: boolean;
    readonly isActiveValue: boolean;
    readonly isHighlighted: boolean;
    readonly isWrong: boolean;
    readonly ref?: React.Ref<FieldCellRef>;
}

const FieldCellComponent = (props: Props) => {
    const { sudoku, cell, onSelect, isActive, isActiveValue, isHighlighted, isWrong, ref } = props;

    const backgroundColor = getCellBgColor(isActiveValue, isHighlighted, isWrong);
    const isEmpty = sudoku.isBlankCell(cell);

    const animation = useDerivedValue(() => withTiming(isActive ? 1 : 0, animationConfig));
    const textRef = useRef<FieldCellTextRef>(null);

    const triggerAnimation = () => textRef.current?.triggerAnimation();

    useImperativeHandle(ref, () => ({ triggerAnimation }));

    const animatedStyles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(animation.value, [0, 1], [backgroundColor, Colors.cell.active])
    }));

    // eslint-disable-next-line no-undefined
    const handlePress = () => void onSelect(isActive ? undefined : cell);

    const cellStyles = getCellStyles(sudoku, cell, backgroundColor, animatedStyles);

    return (
        <ReanimatedPressable 
            onPress={handlePress} 
            style={cellStyles} 
            testID={getCellSelector(props)}
        >
            <FieldCellText
                isActive={isActive}
                isActiveValue={isActiveValue}
                isHighlighted={isHighlighted}
                ref={textRef}
            >
                {getText(isActive, isEmpty, cell)}
            </FieldCellText>
        </ReanimatedPressable>
    );
};

export const FieldCell = memo(
    FieldCellComponent,
    (prevProps, nextProps) =>
        prevProps.cell.value === nextProps.cell.value &&
        prevProps.isActive === nextProps.isActive &&
        prevProps.isWrong === nextProps.isWrong &&
        prevProps.isActiveValue === nextProps.isActiveValue &&
        prevProps.isHighlighted === nextProps.isHighlighted
);
