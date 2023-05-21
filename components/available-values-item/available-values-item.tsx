import { cs, type OnEventFn } from '@rnw-community/shared';
import { Pressable, Text, View } from 'react-native';
import Reanimated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming
} from 'react-native-reanimated';

import { Colors } from '../theme';

import { AvailableValuesItemStyles as styles } from './available-values-item.styles';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

interface Props {
    value: number;
    isActive: boolean;
    progress: number;
    isCorrect: boolean;
    onSelect: OnEventFn<number>;
}

// TODO: Add animation when correct value is selected
export const AvailableValuesItem = ({ value, isActive, onSelect, progress, isCorrect }: Props) => {
    const pressAnimatedBgColor = isCorrect ? Colors.cell.active : Colors.cell.error;

    const animated = useSharedValue(0);
    const animatedStyles = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(animated.value, [0, 1], [Colors.white, pressAnimatedBgColor]),
        ...(!isCorrect && {
            transform: [
                { translateX: interpolate(animated.value, [0, 0.5, 1], [0, -10, 10]) },
                { rotate: `${interpolate(animated.value, [0, 0.5, 1], [0, -20, 20])}deg` }
            ]
        })
    }));

    const handlePress = () => {
        animated.value = withSequence(withTiming(1, { duration: 200 }), withTiming(0, { duration: 200 }));
        onSelect(value);
    };

    const buttonStyles = [styles.button, cs(isActive, styles.wrapperActive), animatedStyles];
    const textStyles = [styles.text, cs(isActive, styles.textActive)];
    const progressStyles = [styles.progress, { width: `${progress}%` }];

    return (
        <View style={styles.container}>
            <ReanimatedPressable key={value} style={buttonStyles} onPress={handlePress}>
                <Text style={textStyles}>{value}</Text>
            </ReanimatedPressable>
            <View style={progressStyles} />
        </View>
    );
};
