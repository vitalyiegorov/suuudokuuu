import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { use, useEffect, useState } from 'react';
import Reanimated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { cs } from '@rnw-community/shared';

import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsKeySelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { useCellFontSize } from '../../hooks/use-cell-font-size.hook';

import { FieldCellTextStyles as styles } from './field-cell-text.styles';

import type { CellInterface } from '@suuudokuuu/generator';

const comboAnimationConfig = { duration: 6 * animationDurationConstant };
const FONT_SIZE_MULTIPLIER = 1.5;

interface Props {
    readonly cell: CellInterface;
    readonly cellSize: number;
    readonly comboAnimationGeneration: number;
    readonly isActive: boolean;
    readonly isActiveValue: boolean;
    readonly isHighlighted: boolean;
    readonly showAutoCandidates: boolean;
    readonly isEmpty: boolean;
}

export const FieldCellText = (props: Props) => {
    const { cell, cellSize, comboAnimationGeneration, isActive, isActiveValue, isHighlighted, isEmpty, showAutoCandidates } = props;

    const { theme } = use(ThemeContext);

    const hasComboAnimation = useAppSelector(settingsKeySelector('showComboAnimation'));
    const showAreas = useAppSelector(settingsKeySelector('showAreas'));
    const showIdenticalNumbers = useAppSelector(settingsKeySelector('showIdenticalNumbers'));
    const fontSize = useCellFontSize(cellSize);

    const [isComboAnimating, setIsComboAnimating] = useState(false);
    const [seenComboAnimationGeneration, setSeenComboAnimationGeneration] = useState(comboAnimationGeneration);

    const comboAnimation = useSharedValue(0);

    if (comboAnimationGeneration !== seenComboAnimationGeneration) {
        setSeenComboAnimationGeneration(comboAnimationGeneration);

        if (comboAnimationGeneration > 0) {
            setIsComboAnimating(true);
        }
    }

    const comboAnimatedStyle = useAnimatedStyle(() => ({
        color: interpolateColor(comboAnimation.value, [0, 0.5, 1], [theme.colors.ink, theme.colors.surface.subtleText, theme.colors.ink]),
        fontSize: interpolate(comboAnimation.value, [0, 0.5, 1], [fontSize, fontSize * FONT_SIZE_MULTIPLIER, fontSize]),
        transform: [{ rotate: `${interpolate(comboAnimation.value, [0, 1], [0, 360])}deg` }]
    }));

    useEffect(() => {
        if (comboAnimationGeneration === 0) {
            return;
        }

        comboAnimation.value = withSequence(
            withTiming(1, comboAnimationConfig),
            withTiming(0, { duration: 0 }, finished => {
                if (finished) {
                    scheduleOnRN(setIsComboAnimating, false);
                }
            })
        );
    }, [comboAnimationGeneration, comboAnimation]);

    const getCellTextColor = () => {
        if (isActive) {
            return theme.colors.board.selectedText;
        } else if (isActiveValue && showIdenticalNumbers) {
            return theme.colors.board.sameValueText;
        } else if (isHighlighted && showAreas) {
            return theme.colors.surface.subtleText;
        } else if (isEmpty) {
            return theme.colors.board.emptyText;
        }

        return theme.colors.ink;
    };

    const getText = (): string => {
        if (isEmpty) {
            return isActive && !showAutoCandidates ? '•' : '';
        }

        return cell.value.toString();
    };

    const textStyles = [
        { color: getCellTextColor() },
        cs(isActive, resolveUnistyleForAnimated(styles.textActive)),
        cs(isComboAnimating && hasComboAnimation, comboAnimatedStyle),
        { fontSize }
    ];

    return (
        <Reanimated.Text allowFontScaling={false} style={textStyles}>
            {getText()}
        </Reanimated.Text>
    );
};
