import { use } from 'react';
import Reanimated from 'react-native-reanimated';

import { cs } from '@rnw-community/shared';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsFontSizeMultiplierSelector, settingsKeySelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';

import { FieldCellTextStyles as styles } from './field-cell-text.styles';

import type { CellInterface } from '@suuudokuuu/generator';
import type { useAnimatedStyle } from 'react-native-reanimated';

interface Props {
    readonly cell: CellInterface;
    readonly cellSize: number;
    readonly isActive: boolean;
    readonly isActiveValue: boolean;
    readonly isHighlighted: boolean;
    readonly showAutoCandidates: boolean;
    readonly hasAnimation: boolean;
    readonly isEmpty: boolean;
    readonly textAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
}

export const FieldCellText = (props: Props) => {
    const { cell, cellSize, isActive, isActiveValue, isHighlighted, isEmpty, showAutoCandidates, hasAnimation, textAnimatedStyle } = props;

    const { theme } = use(ThemeContext);

    const hasTextAnimation = useAppSelector(settingsKeySelector('showComboAnimation'));
    const showAreas = useAppSelector(settingsKeySelector('showAreas'));
    const showIdenticalNumbers = useAppSelector(settingsKeySelector('showIdenticalNumbers'));
    const fontSizeMultiplier = useAppSelector(settingsFontSizeMultiplierSelector);

    const getCellTextColor = () => {
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

    const getText = (): string => {
        if (isEmpty) {
            return isActive && !showAutoCandidates ? '•' : '';
        }

        return cell.value.toString();
    };

    const textStyles = [
        { color: getCellTextColor() },
        cs(isActive, styles.textActive),
        cs(hasAnimation && hasTextAnimation, textAnimatedStyle),
        { fontSize: (cellSize / 2.5) * fontSizeMultiplier }
    ];

    return (
        <Reanimated.Text allowFontScaling={false} style={textStyles}>
            {getText()}
        </Reanimated.Text>
    );
};
