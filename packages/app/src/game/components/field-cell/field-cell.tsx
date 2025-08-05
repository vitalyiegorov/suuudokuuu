import { use } from 'react';
import { Pressable } from 'react-native';
import Reanimated, { interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

import { type OnEventFn, cs } from '@rnw-community/shared';

import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsKeySelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { GameContext } from '../../context/game.context';

import { FieldCellSelectors as selectors } from './field-cell.selectors';
import { FieldCellStyles as styles } from './field-cell.styles';

import type { BWDarkTheme } from '../../../theme/themes/bw.theme';
import type { CellInterface } from '@suuudokuuu/generator';
import type { ReactNode} from 'react';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

const getCellBgColor = (
    theme: typeof BWDarkTheme,
    isActiveValue: boolean,
    isCellHighlighted: boolean,
    isWrong: boolean,
    isEmpty: boolean,
    showAreas: boolean,
    showIdenticalNumbers: boolean,
    showFilledNumbers: boolean
    // eslint-disable-next-line @typescript-eslint/max-params
) => {
    if (isWrong) {
        return theme.colors.cell.error;
    } else if (isActiveValue && showIdenticalNumbers) {
        return theme.colors.cell.activeValue;
    } else if (isCellHighlighted && showAreas) {
        return theme.colors.cell.highlighted;
    } else if (isEmpty) {
        return theme.colors.white;
    } else if (showFilledNumbers) {
        return theme.colors.cell.filled;
    }

    return theme.colors.white;
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

    const cellBackgroundColor = getCellBgColor(
        theme,
        isActiveValue,
        isHighlighted,
        isWrong,
        isEmpty,
        showAreas,
        showIdenticalNumbers,
        showFilledNumbers
    );
    const animation = useDerivedValue(() => withTiming(isActive ? 1 : 0, animationConfig));

    const cellAnimatedStyles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(animation.value, [0, 1], [cellBackgroundColor, theme.colors.cell.active])
    }));

    const handlePress = () => {
        onSelect(isActive ? undefined : cell);
    };

    const cellStyles = [
        styles.container,
        { borderColor: theme.colors.black },
        cs(sudoku.isLastInCellGroupX(cell), styles.groupXEnd),
        cs(sudoku.isLastInCellGroupY(cell), styles.groupYEnd),
        cs(sudoku.isLastInRow(cell), styles.lastRow),
        cs(sudoku.isLastInColumn(cell), styles.lastCol),
        { backgroundColor: cellBackgroundColor },
        cellAnimatedStyles
    ];

    return (
        <ReanimatedPressable onPress={handlePress} style={cellStyles} testID={getCellSelector(props)}>
            {children}
        </ReanimatedPressable>
    );
};
