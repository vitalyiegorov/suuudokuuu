import { useImperativeHandle } from 'react';
import { Pressable } from 'react-native';
import Reanimated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

import { type OnEventFn, cs } from '@rnw-community/shared';

import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { Colors } from '../../../@generic/styles/theme';
import { sudoku } from '../../store/sudoku-instance';
import { CellFontSizeConstant } from '../constants/dimensions.contant';

import { FieldCellSelectors as selectors } from './field-cell.selectors';
import { FieldCellStyles as styles } from './field-cell.styles';

import type { CellInterface } from '@suuudokuuu/generator';
import type { Ref } from 'react';

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
const textAnimationConfig = { duration: 8 * animationDurationConstant };

export interface FieldCellRef {
    triggerAnimation: () => void;
}

interface Props {
    readonly cell: CellInterface;
    readonly onSelect: OnEventFn<CellInterface | undefined>;
    readonly isActive: boolean;
    readonly isActiveValue: boolean;
    readonly isHighlighted: boolean;
    readonly isWrong: boolean;
    readonly ref: Ref<FieldCellRef>;
}

// eslint-disable-next-line max-statements
export const FieldCell = (props: Props) => {
    const { cell, onSelect, isActive, isActiveValue, isHighlighted, isWrong, ref } = props;

    const isEmpty = sudoku.isBlankCell(cell);
    const cellBackgroundColor = getCellBgColor(isActiveValue, isHighlighted, isWrong);
    const text = getText(isActive, isEmpty, cell);

    const animation = useDerivedValue(() => withTiming(isActive ? 1 : 0, animationConfig));
    const textAnimation = useSharedValue(0);

    useImperativeHandle(
        ref,
        () => ({
            triggerAnimation: () => {
                textAnimation.value = withTiming(1, textAnimationConfig, finished => {
                    if (finished === true) {
                        textAnimation.value = 0;
                    }
                });
            }
        }),
        [textAnimation, cell]
    );

    const cellAnimatedStyles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(animation.value, [0, 1], [cellBackgroundColor, Colors.cell.active])
    }));
    const textAnimatedStyles = useAnimatedStyle(() => ({
        color: interpolateColor(textAnimation.value, [0, 0.5, 1], [Colors.black, Colors.cell.highlightedText, Colors.black]),
        fontSize: interpolate(textAnimation.value, [0, 0.5, 1], [CellFontSizeConstant, CellFontSizeConstant * 2, CellFontSizeConstant]),
        transform: [{ rotate: `${interpolate(textAnimation.value, [0, 1], [0, 360])}deg` }]
    }));

    const handlePress = () => {
        onSelect(isActive ? undefined : cell);
    };

    const cellStyles = [
        styles.container,
        cs(sudoku.isLastInCellGroupX(cell), styles.groupXEnd),
        cs(sudoku.isLastInCellGroupY(cell), styles.groupYEnd),
        cs(sudoku.isLastInRow(cell), styles.lastRow),
        cs(sudoku.isLastInColumn(cell), styles.lastCol),
        { backgroundColor: cellBackgroundColor },
        cellAnimatedStyles
    ];
    const textStyles = [
        styles.textRegular,
        cs(isEmpty, styles.textEmpty),
        cs(isHighlighted, styles.textHighlighted),
        cs(isActiveValue, styles.textActiveValue),
        cs(isActive, styles.textActive),
        textAnimatedStyles
    ];

    return (
        <ReanimatedPressable onPress={handlePress} style={cellStyles} testID={getCellSelector(props)}>
            <Reanimated.Text style={textStyles}>{text}</Reanimated.Text>
        </ReanimatedPressable>
    );
};
