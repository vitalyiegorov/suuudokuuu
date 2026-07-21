import { use } from 'react';
import { Platform, Pressable } from 'react-native';
import Reanimated, { interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

import { type OnEventFn } from '@rnw-community/shared';

import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { CellStyles as styles } from '../../../@generic/styles/cell.styles';
import { settingsKeySelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { GameContext } from '../../context/game.context';
import { useCellBorderStyles } from '../../hooks/use-cell-border-styles.hook';

import { fieldCellGetBackgroundColor } from './utils/field-cell-get-background-color.util';

import type { CellInterface } from '@suuudokuuu/generator';
import type { ReactNode } from 'react';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

const animationConfig = { duration: animationDurationConstant };

interface Props {
    readonly cell: CellInterface;
    readonly onSelect: OnEventFn<CellInterface | undefined>;
    readonly isActive: boolean;
    readonly isEmpty: boolean;
    readonly isActiveValue: boolean;
    readonly isHighlighted: boolean;
    readonly isWrong: boolean;
    readonly children?: ReactNode;
}

export const FieldCell = (props: Props) => {
    const { cell, onSelect, isActive, isActiveValue, isHighlighted, isWrong, isEmpty, children } = props;

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

    const handlePress = () => {
        // eslint-disable-next-line no-undefined
        onSelect(isActive ? undefined : cell);
    };

    const cellStyles = [
        styles.container,
        ...useCellBorderStyles(sudoku, cell),
        { backgroundColor: cellBackgroundColor },
        cellAnimatedStyles,
        Platform.select({ web: { outline: 'none' } })
    ];
    // Stable, unique per-cell testID by board coordinate. Selection/highlight
    // state must NOT change the testID: E2E flows target exact cells, and a
    // state-dependent id makes positional selection diverge across platforms.
    const cellSelector = `CellSelectors.Cell.${cell.y}-${cell.x}`;

    return (
        <ReanimatedPressable onPress={handlePress} style={cellStyles} testID={cellSelector}>
            {children}
        </ReanimatedPressable>
    );
};
