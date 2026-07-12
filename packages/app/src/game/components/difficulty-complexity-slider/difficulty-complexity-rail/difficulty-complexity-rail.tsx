import { DifficultyEnum } from '@suuudokuuu/generator';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { use, useEffect, useState } from 'react';
import { type GestureResponderEvent, type LayoutChangeEvent, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useVibration } from '../../../../@generic/hooks/use-vibration.hook';
import { resolveUnistyleForAnimated } from '../../../../@generic/utils/resolve-unistyle-for-animated.util';
import { ThemeContext } from '../../../../theme/context/theme.context';
import {
    DifficultyComplexitySliderDifficulties,
    DifficultyComplexitySliderMaxIndex,
    DifficultyComplexitySliderProgressAnimationDurationMs,
    DifficultyComplexitySliderThumbDiameter,
    DifficultyComplexitySliderThumbRadius
} from '../constant/difficulty-complexity-slider.constant';
import { DifficultyComplexityRailOption } from '../difficulty-complexity-rail-option/difficulty-complexity-rail-option';
import { DifficultyComplexitySliderStyles as styles } from '../difficulty-complexity-slider.styles';

interface Props {
    readonly difficulty: DifficultyEnum;
    readonly onChange: (difficulty: DifficultyEnum) => void;
    readonly selectedDifficulty: DifficultyEnum;
    readonly selectedIndex: number;
}

export const DifficultyComplexityRail = (props: Props) => {
    const { difficulty, onChange, selectedDifficulty, selectedIndex } = props;
    const { theme } = use(ThemeContext);
    const [, hapticImpact] = useVibration();
    const [railWidth, setRailWidth] = useState(0);
    const difficultyProgress = selectedIndex / DifficultyComplexitySliderMaxIndex;
    const difficultyProgressValue = useSharedValue(difficultyProgress);
    const sliderTrackWidth = Math.max(railWidth - DifficultyComplexitySliderThumbDiameter, 1);
    const sliderTrackStyles = [styles.sliderTrack, { backgroundColor: theme.colors.label.main }];
    const sliderTrackPositionStyles = { left: DifficultyComplexitySliderThumbRadius, right: DifficultyComplexitySliderThumbRadius };
    const sliderTrackWithPositionStyles = [sliderTrackStyles, sliderTrackPositionStyles];
    const sliderFillStyles = [
        resolveUnistyleForAnimated(styles.sliderFill),
        { backgroundColor: theme.colors.label.main, left: DifficultyComplexitySliderThumbRadius }
    ];
    const sliderThumbStyles = [
        resolveUnistyleForAnimated(styles.sliderThumb),
        { backgroundColor: theme.colors.label.main, borderColor: theme.colors.background }
    ];
    const sliderFillAnimatedStyles = useAnimatedStyle(() => ({ width: difficultyProgressValue.value * sliderTrackWidth }));
    const sliderFillWithAnimatedStyles = [sliderFillStyles, sliderFillAnimatedStyles];
    const sliderThumbAnimatedStyles = useAnimatedStyle(() => ({
        opacity: railWidth > 0 ? 1 : 0,
        transform: [{ translateX: difficultyProgressValue.value * sliderTrackWidth }]
    }));
    const sliderThumbWithAnimatedStyles = [sliderThumbStyles, sliderThumbAnimatedStyles];

    useEffect(() => {
        difficultyProgressValue.value = withTiming(difficultyProgress, { duration: DifficultyComplexitySliderProgressAnimationDurationMs });
    }, [difficultyProgress, difficultyProgressValue]);

    const setSelectedDifficulty = (newDifficulty: DifficultyEnum) => {
        if (newDifficulty !== difficulty) {
            hapticImpact(ImpactFeedbackStyle.Light);
            onChange(newDifficulty);
        }
    };

    const handleRailLayout = (event: LayoutChangeEvent) => {
        setRailWidth(event.nativeEvent.layout.width);
    };

    const updateDifficultyFromLocation = (locationX: number) => {
        const clampedLocationX = Math.min(Math.max(locationX - DifficultyComplexitySliderThumbRadius, 0), sliderTrackWidth);
        const newDifficultyIndex = Math.round((clampedLocationX / sliderTrackWidth) * DifficultyComplexitySliderMaxIndex);
        const newDifficulty = DifficultyComplexitySliderDifficulties[newDifficultyIndex] ?? selectedDifficulty;

        setSelectedDifficulty(newDifficulty);
    };

    const handleRailResponder = (event: GestureResponderEvent) => {
        updateDifficultyFromLocation(event.nativeEvent.locationX);
    };

    const handleShouldSetRailResponder = () => true;

    const handleDifficultyPress = (newDifficulty: DifficultyEnum) => () => {
        setSelectedDifficulty(newDifficulty);
    };

    return (
        <View style={styles.sliderWrap}>
            <View
                onLayout={handleRailLayout}
                onMoveShouldSetResponder={handleShouldSetRailResponder}
                onResponderGrant={handleRailResponder}
                onResponderMove={handleRailResponder}
                onStartShouldSetResponder={handleShouldSetRailResponder}
                style={styles.sliderRail}
            >
                <View style={sliderTrackWithPositionStyles} />
                <Animated.View style={sliderFillWithAnimatedStyles} />
                <Animated.View style={sliderThumbWithAnimatedStyles} />
            </View>

            <View style={styles.optionRow}>
                {DifficultyComplexitySliderDifficulties.map((optionDifficulty, optionIndex) => (
                    <DifficultyComplexityRailOption
                        difficulty={optionDifficulty}
                        key={optionDifficulty}
                        onPress={handleDifficultyPress(optionDifficulty)}
                        optionIndex={optionIndex}
                        selectedDifficulty={selectedDifficulty}
                    />
                ))}
            </View>
        </View>
    );
};
