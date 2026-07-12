import { ActivityIndicator, Pressable, type PressableProps, type StyleProp, Text, type TextProps, type ViewStyle } from 'react-native';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { useUiTheme } from '../../theme/hooks/use-ui-theme.hook';

import { AppButtonStyles as styles } from './app-button.styles';
import { AppButtonDefaultIconSize } from './constant/app-button-default-icon-size.constant';
import { type AppButtonVariant, appButtonGetColors } from './utils/app-button-get-colors.util';

import type { LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';

export type AppButtonSize = 'compact' | 'regular' | 'large';

export interface AppButtonProps extends Omit<PressableProps, 'style'> {
    readonly text?: string;
    readonly icon?: LucideIcon;
    readonly textStyle?: TextProps['style'];
    readonly style?: StyleProp<ViewStyle>;
    readonly iconSize?: number;
    readonly isLoading?: boolean;
    readonly children?: ReactNode;
    readonly size?: AppButtonSize;
    readonly variant?: AppButtonVariant;
}

export const AppButton = ({
    text,
    style,
    textStyle,
    onPress,
    iconSize = AppButtonDefaultIconSize,
    isLoading = false,
    icon: Icon,
    children,
    size = 'regular',
    variant = 'primary',
    ...restProps
}: AppButtonProps) => {
    const { theme } = useUiTheme();
    const colors = appButtonGetColors(theme, variant);
    const buttonStyles = [styles.button, styles[size], { backgroundColor: colors.backgroundColor, borderColor: colors.borderColor }, style];
    let textSizeStyles = styles.textRegular;
    if (size === 'compact') {
        textSizeStyles = styles.textCompact;
    }
    if (size === 'large') {
        textSizeStyles = styles.textLarge;
    }
    const textStyles = [styles.text, textSizeStyles, { color: colors.textColor }, textStyle];
    const shouldShowText = isNotEmptyString(text);

    return (
        <Pressable onPress={onPress} style={buttonStyles} {...restProps}>
            {isLoading && <ActivityIndicator color={colors.textColor} />}

            {!isLoading && isDefined(children) && children}

            {!isLoading && !isDefined(children) && (
                <>
                    {isDefined(Icon) && <Icon color={colors.textColor} size={iconSize} />}
                    {shouldShowText && (
                        <Text adjustsFontSizeToFit allowFontScaling={false} minimumFontScale={0.72} numberOfLines={1} style={textStyles}>
                            {text}
                        </Text>
                    )}
                </>
            )}
        </Pressable>
    );
};
