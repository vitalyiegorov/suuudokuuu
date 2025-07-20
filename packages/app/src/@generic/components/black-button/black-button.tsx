import { ImpactFeedbackStyle } from 'expo-haptics/src/Haptics.types';
import { useRouter } from 'expo-router';
import {
    ActivityIndicator,
    type GestureResponderEvent,
    Pressable,
    type PressableProps,
    type StyleProp,
    Text,
    type TextProps,
    type ViewStyle
} from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { Colors } from '../../styles/theme';
import { hapticImpact } from '../../utils/haptic/haptic.util';

import { BlackButtonStyles as styles } from './black-button.styles';

interface Props extends PressableProps {
    readonly text: string;
    readonly styleText?: TextProps['style'];
    readonly href?: string;
    readonly isLoading?: boolean;
}

export const BlackButton = ({ text, style, href, styleText, onPress, isLoading = false, ...props }: Props) => {
    const router = useRouter();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const wrapperStyles = [styles.button, style] as StyleProp<ViewStyle>;
    const textStyles = [styles.buttonText, styleText];

    const handlePress = (event: GestureResponderEvent) => {
        onPress?.(event);

        hapticImpact(ImpactFeedbackStyle.Light);

        if (isNotEmptyString(href)) {
            router.push(href);
        }
    };

    return (
        <Pressable onPress={handlePress} style={wrapperStyles} {...props}>
            {isLoading ? <ActivityIndicator color={Colors.white} /> : <Text style={textStyles}>{text}</Text>}
        </Pressable>
    );
};
