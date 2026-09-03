import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { use, useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import Reanimated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { type OnEventFn } from '@rnw-community/shared';

import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { useReduceMotion } from '../../../@generic/hooks/use-reduce-motion.hook';
import { CellStyles as styles } from '../../../@generic/styles/cell.styles';
import { settingsKeySelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { GameContext } from '../../context/game.context';
import { useCellBorderStyles } from '../../hooks/use-cell-border-styles.hook';
import { gameGetCellHitSlop } from '../../utils/game-get-cell-hit-slop.util';
import { FieldCellSuccessOutline } from '../field-cell-success-outline/field-cell-success-outline';
import { FieldCellSuccessRing } from '../field-cell-success-ring/field-cell-success-ring';

import { fieldCellGetBackgroundColor } from './utils/field-cell-get-background-color.util';
import { fieldCellGetOutlineStyle } from './utils/field-cell-get-outline-style.util';

import type { CellInterface } from '@suuudokuuu/generator';
import type { ReactNode } from 'react';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

const instantAnimationConfig = { duration: 0 };
const successAnimationConfig = { duration: 3 * animationDurationConstant, easing: Easing.out(Easing.cubic) };
const successHoldConfig = { duration: 3 * animationDurationConstant };
const SUCCESS_POP_PEAK = 1 + 0.1;
const SUCCESS_POP_DIP = 1 - 0.05;
const SUCCESS_POP_INPUT = [0, 0.5, 0.8, 1];
const SUCCESS_POP_OUTPUT = [1, SUCCESS_POP_PEAK, SUCCESS_POP_DIP, 1];

interface Props {
    readonly accessibilityLabel: string;
    readonly cell: CellInterface;
    readonly cellSize: number;
    readonly cellMargin: number;
    readonly onSelect: OnEventFn<CellInterface | undefined>;
    readonly isActive: boolean;
    readonly isEmpty: boolean;
    readonly isActiveValue: boolean;
    readonly isHighlighted: boolean;
    readonly isPatternCell: boolean;
    readonly isTargetCell: boolean;
    readonly isWrong: boolean;
    readonly isSuccessTarget: boolean;
    readonly successGeneration: number;
    readonly children?: ReactNode;
}

// eslint-disable-next-line max-lines-per-function -- Layout/form component requires many lines
export const FieldCell = (props: Props) => {
    const {
        accessibilityLabel,
        cell,
        cellSize,
        cellMargin,
        onSelect,
        isActive,
        isActiveValue,
        isHighlighted,
        isPatternCell,
        isTargetCell,
        isWrong,
        isEmpty,
        isSuccessTarget,
        successGeneration,
        children
    } = props;

    const { engine } = use(GameContext);
    const { theme } = use(ThemeContext);

    const isMotionReduced = useReduceMotion();
    const showAreas = useAppSelector(settingsKeySelector('showAreas'));
    const showIdenticalNumbers = useAppSelector(settingsKeySelector('showIdenticalNumbers'));
    const showFilledNumbers = useAppSelector(settingsKeySelector('showFilledNumbers'));

    const [isSuccessPulsing, setIsSuccessPulsing] = useState(false);
    const [seenSuccessGeneration, setSeenSuccessGeneration] = useState(successGeneration);

    const successAnimation = useSharedValue(0);

    if (successGeneration !== seenSuccessGeneration) {
        setSeenSuccessGeneration(successGeneration);

        if (isSuccessTarget) {
            setIsSuccessPulsing(true);
        }
    }

    const cellBackgroundColor = fieldCellGetBackgroundColor({
        isActive,
        isActiveValue,
        isCellHighlighted: isHighlighted,
        isEmpty,
        isPatternCell,
        isTargetCell,
        isWrong,
        showAreas,
        showFilledNumbers,
        showIdenticalNumbers,
        theme
    });
    const successPopAnimatedStyles = useAnimatedStyle(() => {
        if (!isSuccessPulsing || isMotionReduced) {
            return { transform: [{ scale: 1 }], zIndex: isSuccessPulsing ? 2 : 0 };
        }

        return {
            transform: [{ scale: interpolate(successAnimation.value, SUCCESS_POP_INPUT, SUCCESS_POP_OUTPUT) }],
            zIndex: 2
        };
    });

    useEffect(() => {
        if (!isSuccessTarget || successGeneration === 0) {
            return;
        }

        successAnimation.value = withSequence(
            withTiming(1, isMotionReduced ? successHoldConfig : successAnimationConfig),
            withTiming(0, instantAnimationConfig, finished => {
                if (finished) {
                    scheduleOnRN(setIsSuccessPulsing, false);
                }
            })
        );
    }, [successGeneration, isSuccessTarget, isMotionReduced, successAnimation]);

    const handlePress = () => {
        // eslint-disable-next-line no-undefined
        onSelect(isActive ? undefined : cell);
    };

    const cellStyles = [
        resolveUnistyleForAnimated(styles.container(cellSize)),
        ...useCellBorderStyles(engine.Sudoku, cell, cellMargin),
        { backgroundColor: cellBackgroundColor },
        successPopAnimatedStyles,
        fieldCellGetOutlineStyle({ isWrong, theme })
    ];
    const successMarker = isMotionReduced ? <FieldCellSuccessOutline /> : <FieldCellSuccessRing animation={successAnimation} />;
    const cellAccessibilityState = { selected: isActive };

    // Stable, unique per-cell testID by board coordinate. Selection/highlight
    // state must NOT change the testID: E2E flows target exact cells, and a
    // state-dependent id makes positional selection diverge across platforms.
    return (
        <ReanimatedPressable
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
            accessibilityState={cellAccessibilityState}
            hitSlop={gameGetCellHitSlop(engine.Sudoku, cell, cellMargin)}
            onPress={handlePress}
            style={cellStyles}
            tabIndex={-1}
            testID={`CellSelectors.Cell.${cell.y}-${cell.x}`}
        >
            {isSuccessPulsing ? successMarker : null}
            {children}
        </ReanimatedPressable>
    );
};
