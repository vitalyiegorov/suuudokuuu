import { ImpactFeedbackStyle } from 'expo-haptics/src/Haptics.types';
import { useRouter } from 'expo-router';
import { type ReactNode, use } from 'react';
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

import { ThemeContext } from '../../context/theme.context';
import { hapticImpact } from '../../utils/haptic/haptic.util';

import { BlackButtonStyles as styles } from './black-button.styles';

interface Props extends PressableProps {
    readonly text?: string;
    readonly styleText?: TextProps['style'];
    readonly href?: string;
    readonly isLoading?: boolean;
    readonly isActive?: boolean;
    readonly children?: ReactNode;
}

export const BlackButton = ({ text, style, href, styleText, onPress, children, isActive = false, isLoading = false, ...props }: Props) => {
    const { theme } = use(ThemeContext);
    const router = useRouter();

    const wrapperStyles = [
        styles.button,
        { backgroundColor: isActive ? theme.colors.white : theme.colors.black },
        style
    ] as StyleProp<ViewStyle>;
    const textStyles = [styles.buttonText, { color: isActive ? theme.colors.black : theme.colors.white }, styleText];

    const handlePress = (event: GestureResponderEvent) => {
        onPress?.(event);

        hapticImpact(ImpactFeedbackStyle.Light);

        if (isNotEmptyString(href)) {
            router.push(href);
        }
    };

    const renderContent = () =>
        children ?? (
            <Text allowFontScaling={false} style={textStyles}>
                {text}
            </Text>
        );

    return (
        <Pressable onPress={handlePress} style={wrapperStyles} {...props}>
            {isLoading ? <ActivityIndicator color={theme.colors.white} /> : renderContent()}
        </Pressable>
    );
};
