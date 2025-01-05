import { Pressable, type StyleProp, Text, View, type ViewStyle } from 'react-native';
import Reanimated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming
} from 'react-native-reanimated';

import { type OnEventFn, cs } from '@rnw-community/shared';
import { setTestID } from '@rnw-community/wdio';

import { Colors } from '../../../@generic';

import { AvailableValueItemSelectors as selectors } from './available-value-item.selectors';
import { AvailableValuesItemStyles as styles } from './available-values-item.styles';

const ReanimatedPressable = Reanimated.createAnimatedComponent(Pressable);

interface Props {
    value: number;
    canPress: boolean;
    isActive: boolean;
    progress: number;
    correctValue?: number;
    onSelect: OnEventFn<number>;
}

// TODO: Add animation when correct value is selected
export const AvailableValuesItem = ({ value, isActive, onSelect, progress, correctValue, canPress }: Props) => {
    const isCorrect = value === correctValue;
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
    const progressStyles = [styles.progress, { width: `${progress}%` }] as StyleProp<ViewStyle>;

    return (
        <View style={styles.container} {...setTestID(selectors.Root)}>
            <ReanimatedPressable
                key={value}
                style={buttonStyles}
                {...(canPress && { onPress: handlePress })}
                {...setTestID(selectors.Button)}
            >
                <Text style={textStyles}>{value}</Text>
            </ReanimatedPressable>

            <View style={progressStyles} />
        </View>
    );
};
