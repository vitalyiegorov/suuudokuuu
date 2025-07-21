import { memo, useImperativeHandle } from 'react';
import { Pressable } from 'react-native';
import Reanimated, { type AnimatedStyle, type SharedValue, interpolate, interpolateColor, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

import { type OnEventFn, cs } from '@rnw-community/shared';

import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { Colors } from '../../../@generic/styles/theme';
import { CellFontSizeConstant } from '../constants/dimensions.contant';

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
const textAnimationConfig = { duration: 8 * animationDurationConstant };

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

const useTextAnimation = () => {
    const textAnimation = useSharedValue(0);

    const resetAnimation = () => {
        textAnimation.value = 0;
    };

    const triggerAnimation = () => {
        textAnimation.value = withTiming(1, textAnimationConfig, finished => {
            if (finished === true) {
                runOnJS(resetAnimation)();
            }
        });
    };

    return { textAnimation, triggerAnimation };
};

const useTextStyles = (textAnimation: SharedValue<number>, textState: { text: string; isHighlighted: boolean; isActiveValue: boolean; isActive: boolean }) => {
    const textAnimatedStyles = useAnimatedStyle(() => ({
        color: interpolateColor(textAnimation.value, [0, 0.5, 1], [Colors.black, Colors.cell.highlightedText, Colors.black]),
        fontSize: interpolate(textAnimation.value, [0, 0.5, 1], [CellFontSizeConstant, CellFontSizeConstant * 2, CellFontSizeConstant]),
        transform: [{ rotate: `${interpolate(textAnimation.value, [0, 1], [0, 360])}deg` }]
    }));

    return [
        styles.textRegular,
        cs(textState.text === '' || textState.text === '•', styles.textEmpty),
        cs(textState.isHighlighted, styles.textHighlighted),
        cs(textState.isActiveValue, styles.textActiveValue),
        cs(textState.isActive, styles.textActive),
        cs(textAnimation.value !== 0, textAnimatedStyles)
    ];
};

const FieldCellComponent = (props: Props) => {
    const { sudoku, cell, onSelect, isActive, isActiveValue, isHighlighted, isWrong, ref } = props;

    const cellBackgroundColor = getCellBgColor(isActiveValue, isHighlighted, isWrong);
    const isEmpty = sudoku.isBlankCell(cell);
    const text = getText(isActive, isEmpty, cell);

    const animation = useDerivedValue(() => withTiming(isActive ? 1 : 0, animationConfig));
    const { textAnimation, triggerAnimation } = useTextAnimation();

    useImperativeHandle(ref, () => ({ triggerAnimation }));

    const getCellStyles = (backgroundColor: string, animatedStyles: AnimatedStyle<object>) => [
        styles.container,
        cs(sudoku.isLastInCellGroupX(cell), styles.groupXEnd),
        cs(sudoku.isLastInCellGroupY(cell), styles.groupYEnd),
        cs(sudoku.isLastInRow(cell), styles.lastRow),
        cs(sudoku.isLastInColumn(cell), styles.lastCol),
        { backgroundColor },
        animatedStyles
    ];

    const animatedStyles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(animation.value, [0, 1], [cellBackgroundColor, Colors.cell.active])
    }));

    const mergedTextStyles = useTextStyles(textAnimation, { text, isHighlighted, isActiveValue, isActive });
    const handlePress = () => void onSelect(isActive ? undefined : cell); // eslint-disable-line no-undefined

    return (
        <ReanimatedPressable 
            onPress={handlePress} 
            style={getCellStyles(cellBackgroundColor, animatedStyles)} 
            testID={getCellSelector(props)}
        >
            <Reanimated.Text style={mergedTextStyles}>{text}</Reanimated.Text>
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
