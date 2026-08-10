import { useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { use } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { useVibration } from '../../../../@generic/hooks/use-vibration.hook';
import { getDifficultyMessage } from '../../../../@generic/utils/get-difficulty-message.util';
import { ThemeContext } from '../../../../theme/context/theme.context';
import {
    DifficultyComplexitySliderDifficulties,
    DifficultyComplexitySliderMaxIndex,
    DifficultyComplexitySliderThumbRadius
} from '../constant/difficulty-complexity-slider.constant';
import { DifficultyComplexityRailOption } from '../difficulty-complexity-rail-option/difficulty-complexity-rail-option';
import { DifficultyComplexitySliderStyles as styles } from '../difficulty-complexity-slider.styles';

import { useDifficultyComplexityRailGesture } from './hooks/use-difficulty-complexity-rail-gesture.hook';

import type { AccessibilityActionEvent } from 'react-native';

interface Props {
    readonly difficulty: DifficultyEnum;
    readonly onChange: (difficulty: DifficultyEnum) => void;
    readonly selectedDifficulty: DifficultyEnum;
    readonly selectedIndex: number;
}

export const DifficultyComplexityRail = (props: Props) => {
    const { difficulty, onChange, selectedDifficulty, selectedIndex } = props;
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const [, hapticImpact] = useVibration();
    const optionCount = DifficultyComplexitySliderDifficulties.length;
    const difficultyStopFraction = (selectedIndex + 0.5) / optionCount;

    const setSelectedDifficulty = (newDifficulty: DifficultyEnum) => {
        if (newDifficulty !== difficulty) {
            hapticImpact(ImpactFeedbackStyle.Light);
            onChange(newDifficulty);
        }
    };

    const commitDifficultyIndex = (newDifficultyIndex: number) => {
        const newDifficulty = DifficultyComplexitySliderDifficulties[newDifficultyIndex] ?? selectedDifficulty;

        setSelectedDifficulty(newDifficulty);
    };

    const { difficultyProgressValue, handleRailLayout, railGesture, railWidth } = useDifficultyComplexityRailGesture({
        difficultyStopFraction,
        maxDifficultyIndex: DifficultyComplexitySliderMaxIndex,
        onCommitDifficultyIndex: commitDifficultyIndex,
        optionCount
    });

    const sliderTrackStyles = [styles.sliderTrack, { backgroundColor: theme.colors.text.primary }];
    const sliderFillStyles = [resolveUnistyleForAnimated(styles.sliderFill), { backgroundColor: theme.colors.text.primary }];
    const sliderThumbStyles = [
        resolveUnistyleForAnimated(styles.sliderThumb),
        { backgroundColor: theme.colors.text.primary, borderColor: theme.colors.background }
    ];
    const sliderFillAnimatedStyles = useAnimatedStyle(() => ({ width: difficultyProgressValue.value * railWidth }));
    const sliderFillWithAnimatedStyles = [sliderFillStyles, sliderFillAnimatedStyles];
    const sliderThumbAnimatedStyles = useAnimatedStyle(() => ({
        opacity: railWidth > 0 ? 1 : 0,
        transform: [{ translateX: difficultyProgressValue.value * railWidth - DifficultyComplexitySliderThumbRadius }]
    }));
    const sliderThumbWithAnimatedStyles = [sliderThumbStyles, sliderThumbAnimatedStyles];
    const currentDifficultyLabel = t(getDifficultyMessage(selectedDifficulty));
    const railAccessibilityLabel = t`Difficulty`;
    const railAccessibilityValue = { max: DifficultyComplexitySliderMaxIndex, min: 0, now: selectedIndex, text: currentDifficultyLabel };
    const railAccessibilityActions = [{ name: 'increment' }, { name: 'decrement' }];

    const handleDifficultyPress = (newDifficulty: DifficultyEnum) => () => {
        setSelectedDifficulty(newDifficulty);
    };

    const handleAccessibilityAction = (event: AccessibilityActionEvent) => {
        if (event.nativeEvent.actionName === 'increment') {
            commitDifficultyIndex(Math.min(selectedIndex + 1, DifficultyComplexitySliderMaxIndex));
        }

        if (event.nativeEvent.actionName === 'decrement') {
            commitDifficultyIndex(Math.max(selectedIndex - 1, 0));
        }
    };

    return (
        <View style={styles.sliderWrap}>
            <GestureDetector gesture={railGesture}>
                <View
                    accessibilityActions={railAccessibilityActions}
                    accessibilityLabel={railAccessibilityLabel}
                    accessibilityRole="adjustable"
                    accessibilityValue={railAccessibilityValue}
                    accessible
                    onAccessibilityAction={handleAccessibilityAction}
                    onLayout={handleRailLayout}
                    style={styles.sliderRail}
                >
                    <View style={sliderTrackStyles} />
                    <Animated.View style={sliderFillWithAnimatedStyles} />
                    <Animated.View style={sliderThumbWithAnimatedStyles} />
                </View>
            </GestureDetector>

            <View style={styles.optionRow}>
                {DifficultyComplexitySliderDifficulties.map(optionDifficulty => (
                    <DifficultyComplexityRailOption
                        difficulty={optionDifficulty}
                        key={optionDifficulty}
                        onPress={handleDifficultyPress(optionDifficulty)}
                        selectedDifficulty={selectedDifficulty}
                    />
                ))}
            </View>
        </View>
    );
};
