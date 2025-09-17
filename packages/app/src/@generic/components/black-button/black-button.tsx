import { ImpactFeedbackStyle } from 'expo-haptics/src/Haptics.types';
import { useRouter } from 'expo-router';
import { type ComponentProps, type ReactNode, use } from 'react';
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

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { ThemeContext } from '../../../theme/context/theme.context';
import { useVibration } from '../../hooks/use-vibration.hook';

import { BlackButtonStyles as styles } from './black-button.styles';

import type { Link } from 'expo-router';

interface Props extends PressableProps {
    readonly text?: string;
    readonly styleText?: TextProps['style'];
    readonly replace?: ComponentProps<typeof Link>['replace'];
    readonly href?: ComponentProps<typeof Link>['href'];
    readonly isLoading?: boolean;
    readonly isActive?: boolean;
    readonly children?: ReactNode;
}

export const BlackButton = (props: Props) => {
    const { text, style, href, replace, styleText, onPress, children, isActive = false, isLoading = false, ...restProps } = props;
    const router = useRouter();
    const { theme } = use(ThemeContext);
    const [, hapticImpact] = useVibration();

    const wrapperStyles = [
        styles.button,
        { backgroundColor: isActive ? theme.colors.white : theme.colors.black },
        style
    ] as StyleProp<ViewStyle>;
    const textStyles = [styles.buttonText, { color: isActive ? theme.colors.label.main : theme.colors.label.inverted }, styleText];

    const handlePress = (event: GestureResponderEvent) => {
        onPress?.(event);

        hapticImpact(ImpactFeedbackStyle.Light);

        if (isNotEmptyString(href)) {
            if (isDefined(replace)) {
                router.replace(href);
            } else {
                router.navigate(href);
            }
        }
    };

    const renderContent = () =>
        children ?? (
            <Text allowFontScaling={false} style={textStyles}>
                {text}
            </Text>
        );

    return (
        <Pressable onPress={handlePress} style={wrapperStyles} {...restProps}>
            {isLoading ? <ActivityIndicator color={theme.colors.white} /> : renderContent()}
        </Pressable>
    );
};
