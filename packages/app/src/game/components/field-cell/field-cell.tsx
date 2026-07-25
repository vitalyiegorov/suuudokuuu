import { use } from 'react';
import { Pressable } from 'react-native';
import Reanimated, { interpolate, interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

import { type OnEventFn } from '@rnw-community/shared';

import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { CellStyles as styles } from '../../../@generic/styles/cell.styles';
import { settingsKeySelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { GameContext } from '../../context/game.context';
import { useCellBorderStyles } from '../../hooks/use-cell-border-styles.hook';
import { FieldCellSuccessRing } from '../field-cell-success-ring/field-cell-success-ring';

import { fieldCellGetBackgroundColor } from './utils/field-cell-get-background-color.util';

import type { CellInterface } from '@suuudokuuu/generator';
import type { ReactNode } from 'react';
import type { SharedValue } from 'react-native-reanimated';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

const animationConfig = { duration: animationDurationConstant };
const SUCCESS_POP_PEAK = 1 + 0.1;
const SUCCESS_POP_DIP = 1 - 0.05;
const SUCCESS_POP_INPUT = [0, 0.5, 0.8, 1];
const SUCCESS_POP_OUTPUT = [1, SUCCESS_POP_PEAK, SUCCESS_POP_DIP, 1];

interface Props {
    readonly cell: CellInterface;
    readonly cellSize: number;
    readonly onSelect: OnEventFn<CellInterface | undefined>;
    readonly isActive: boolean;
    readonly isEmpty: boolean;
    readonly isActiveValue: boolean;
    readonly isHighlighted: boolean;
    readonly isWrong: boolean;
    readonly isSuccessPulse: boolean;
    readonly successAnimation: SharedValue<number>;
    readonly children?: ReactNode;
}

export const FieldCell = (props: Props) => {
    const {
        cell,
        cellSize,
        onSelect,
        isActive,
        isActiveValue,
        isHighlighted,
        isWrong,
        isEmpty,
        isSuccessPulse,
        successAnimation,
        children
    } = props;

    const { sudoku } = use(GameContext);
    const { theme } = use(ThemeContext);

    const showAreas = useAppSelector(settingsKeySelector('showAreas'));
    const showIdenticalNumbers = useAppSelector(settingsKeySelector('showIdenticalNumbers'));
    const showFilledNumbers = useAppSelector(settingsKeySelector('showFilledNumbers'));

    const cellBackgroundColor = fieldCellGetBackgroundColor({
        isActiveValue,
        isCellHighlighted: isHighlighted,
        isEmpty,
        isWrong,
        showAreas,
        showFilledNumbers,
        showIdenticalNumbers,
        theme
    });
    const animation = useDerivedValue(() => withTiming(isActive ? 1 : 0, animationConfig));

    const cellAnimatedStyles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(animation.value, [0, 1], [cellBackgroundColor, theme.colors.cell.active])
    }));
    const successPopAnimatedStyles = useAnimatedStyle(() => {
        if (!isSuccessPulse) {
            return { transform: [{ scale: 1 }], zIndex: 0 };
        }

        return {
            transform: [{ scale: interpolate(successAnimation.value, SUCCESS_POP_INPUT, SUCCESS_POP_OUTPUT) }],
            zIndex: 2
        };
    });

    const handlePress = () => {
        // eslint-disable-next-line no-undefined
        onSelect(isActive ? undefined : cell);
    };

    const cellStyles = [
        styles.container(cellSize),
        ...useCellBorderStyles(sudoku, cell),
        { backgroundColor: cellBackgroundColor },
        cellAnimatedStyles,
        successPopAnimatedStyles
    ];

    // Stable, unique per-cell testID by board coordinate. Selection/highlight
    // state must NOT change the testID: E2E flows target exact cells, and a
    // state-dependent id makes positional selection diverge across platforms.
    return (
        <ReanimatedPressable onPress={handlePress} style={cellStyles} testID={`CellSelectors.Cell.${cell.y}-${cell.x}`}>
            {isSuccessPulse ? <FieldCellSuccessRing animation={successAnimation} /> : null}
            {children}
        </ReanimatedPressable>
    );
};
