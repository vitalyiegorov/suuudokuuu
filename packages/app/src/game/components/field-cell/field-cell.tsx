import { use } from 'react';
import { Pressable } from 'react-native';
import Reanimated, { interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

import { type OnEventFn, cs } from '@rnw-community/shared';

import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { ThemeContext } from '../../../@generic/context/theme.context';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsFontSizeSelector, settingsKeySelector } from '../../../settings/store/settings.selectors';
import { GameContext } from '../../context/game.context';
import { CellCandidateFontSizeConstant, CellFontSizeConstant } from '../constants/dimensions.contant';

import { FieldCellSelectors as selectors } from './field-cell.selectors';
import { FieldCellStyles as styles } from './field-cell.styles';

import type { BlackTheme } from '../../../@generic/styles/theme';
import type { CellInterface } from '@suuudokuuu/generator';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

const getText = (isActive: boolean, isEmpty: boolean, hasCandidates: boolean, cell: CellInterface): string => {
    if (isEmpty) {
        return isActive && !hasCandidates ? '•' : '';
    }

    return cell.value.toString();
};

const getCellBgColor = (
    theme: typeof BlackTheme,
    isActiveValue: boolean,
    isCellHighlighted: boolean,
    isWrong: boolean,
    isEmpty: boolean,
    showAreas: boolean,
    showIdenticalNumbers: boolean
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
    }

    return theme.colors.cell.filled;
};

const getCellTextColor = (
    theme: typeof BlackTheme,
    isActive: boolean,
    isEmpty: boolean,
    isHighlighted: boolean,
    isActiveValue: boolean,
    showAreas: boolean,
    showIdenticalNumbers: boolean
    // eslint-disable-next-line @typescript-eslint/max-params
) => {
    if (isActive) {
        return theme.colors.cell.activeText;
    } else if (isActiveValue && showIdenticalNumbers) {
        return theme.colors.cell.activeValueText;
    } else if (isHighlighted && showAreas) {
        return theme.colors.cell.highlightedText;
    } else if (isEmpty) {
        return theme.colors.cell.emptyValueText;
    }

    return theme.colors.black;
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

const getCandidateTextStyles = (theme: typeof BlackTheme, candidate: number, fontSize: number) => {
    const textCandidatePositionStyles = {
        1: styles.textCandidatePosition1,
        2: styles.textCandidatePosition2,
        3: styles.textCandidatePosition3,
        4: styles.textCandidatePosition4,
        5: styles.textCandidatePosition5,
        6: styles.textCandidatePosition6,
        7: styles.textCandidatePosition7,
        8: styles.textCandidatePosition8,
        9: styles.textCandidatePosition9
    };

    const textCandidateStyle = textCandidatePositionStyles[candidate as keyof typeof textCandidatePositionStyles];

    return [
        styles.textCandidate,
        { fontSize: CellCandidateFontSizeConstant * fontSize, color: theme.colors.cell.candidate },
        textCandidateStyle
    ];
};

const animationConfig = { duration: animationDurationConstant };

interface Props {
    readonly cell: CellInterface;
    readonly onSelect: OnEventFn<CellInterface | undefined>;
    readonly isActive: boolean;
    readonly isActiveValue: boolean;
    readonly isHighlighted: boolean;
    readonly isWrong: boolean;
    readonly hasCandidates: boolean;
    readonly hasAnimation: boolean;
    readonly textAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
}

// TODO: Components is overloaded - split into smaller components
// eslint-disable-next-line max-statements
export const FieldCell = (props: Props) => {
    const { cell, onSelect, isActive, isActiveValue, isHighlighted, isWrong, hasCandidates, hasAnimation, textAnimatedStyle } = props;

    const { sudoku } = use(GameContext);
    const { theme } = use(ThemeContext);

    const hasTextAnimation = useAppSelector(settingsKeySelector('showComboAnimation'));
    const showAreas = useAppSelector(settingsKeySelector('showAreas'));
    const showIdenticalNumbers = useAppSelector(settingsKeySelector('showIdenticalNumbers'));
    // eslint-disable-next-line id-length
    const fontSizeMultiplier = { xs: 0.75, s: 0.875, m: 1, xl: 1.25 }[useAppSelector(settingsFontSizeSelector)];

    const isEmpty = sudoku.isBlankCell(cell);
    const cellBackgroundColor = getCellBgColor(theme, isActiveValue, isHighlighted, isWrong, isEmpty, showAreas, showIdenticalNumbers);
    const candidates = isEmpty && hasCandidates ? sudoku.getCellCandidates(cell) : [];

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
    const textStyles = [
        { color: getCellTextColor(theme, isActive, isEmpty, isHighlighted, isActiveValue, showAreas, showIdenticalNumbers) },
        cs(isActive, styles.textActive),
        cs(hasAnimation && hasTextAnimation, textAnimatedStyle),
        { fontSize: CellFontSizeConstant * fontSizeMultiplier }
    ];

    return (
        <ReanimatedPressable onPress={handlePress} style={cellStyles} testID={getCellSelector(props)}>
            {candidates.map(candidate => (
                <Reanimated.Text
                    allowFontScaling={false}
                    key={`candidate-${candidate}`}
                    style={getCandidateTextStyles(theme, candidate, fontSizeMultiplier)}
                >
                    {candidate}
                </Reanimated.Text>
            ))}

            <Reanimated.Text allowFontScaling={false} style={textStyles}>
                {getText(isActive, isEmpty, hasCandidates, cell)}
            </Reanimated.Text>
        </ReanimatedPressable>
    );
};
