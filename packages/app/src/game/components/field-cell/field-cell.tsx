import { use, useCallback, useImperativeHandle } from 'react';
import { Pressable } from 'react-native';
import Reanimated, {
    type SharedValue,
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
    withTiming
} from 'react-native-reanimated';

import { type OnEventFn, cs } from '@rnw-community/shared';

import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { Colors } from '../../../@generic/styles/theme';
import { GameContext } from '../../context/game.context';
import { CellFontSizeConstant } from '../constants/dimensions.contant';

import { FieldCellSelectors as selectors } from './field-cell.selectors';
import { FieldCellStyles as styles } from './field-cell.styles';

import type { CellInterface, ScoredCellsInterface } from '@suuudokuuu/generator';
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

export interface FieldCellRef {
    // Kept for backwards compatibility, but no longer used
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
    readonly cellAnimation?: SharedValue<number>;
    readonly animatedScoredCells?: ScoredCellsInterface;
}

// eslint-disable-next-line max-statements
export const FieldCell = (props: Props) => {
    const { cell, onSelect, isActive, isActiveValue, isHighlighted, isWrong, ref, cellAnimation, animatedScoredCells } = props;

    const { sudoku } = use(GameContext);

    const isEmpty = sudoku.isBlankCell(cell);
    const cellBackgroundColor = getCellBgColor(isActiveValue, isHighlighted, isWrong);
    const text = getText(isActive, isEmpty, cell);

    const animation = useDerivedValue(() => withTiming(isActive ? 1 : 0, animationConfig));

    useImperativeHandle(
        ref,
        () => ({
            triggerAnimation: () => {
                /*
                 * This method is kept for backwards compatibility but is no longer used
                 * Animation is now handled at the GameScreen level with a single shared value
                 */
            }
        }),
        []
    );

    const cellAnimatedStyles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(animation.value, [0, 1], [cellBackgroundColor, Colors.cell.active])
    }));

    // Check if this cell should animate based on scored cells
    const shouldAnimate = Boolean(animatedScoredCells && cellAnimation && sudoku.isScoredCell(cell, animatedScoredCells));
    
const FONT_SIZE_MULTIPLIER = 1.5;

    const textAnimatedStyles = useAnimatedStyle(() => {
        if (!shouldAnimate || cellAnimation === undefined) {
            return {};
        }
        
        return {
            color: interpolateColor(cellAnimation.value, [0, 0.5, 1], [Colors.black, Colors.cell.highlightedText, Colors.black]),
            fontSize: interpolate(cellAnimation.value, [0, 0.5, 1], [CellFontSizeConstant, CellFontSizeConstant * FONT_SIZE_MULTIPLIER, CellFontSizeConstant])
        };
    });

    const handlePress = useCallback(() => {
        onSelect(isActive ? undefined : cell);
    }, [cell, isActive, onSelect]);

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
