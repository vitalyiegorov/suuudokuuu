import {
    ActivityIndicator,
    Pressable,
    type PressableProps,
    type StyleProp,
    Text,
    type TextProps,
    View,
    type ViewStyle
} from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { MaxFontSizeMultiplierConstant } from '../../theme/constant/font-scaling.constant';

import { AppButtonStyles as styles } from './app-button.styles';
import { AppButtonDefaultIconSize } from './constant/app-button-default-icon-size.constant';
import { AppButtonLoaderTestId } from './constant/app-button-loader-test-id.constant';
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
    disabled,
    icon: Icon,
    children,
    size = 'regular',
    variant = 'primary',
    ...restProps
}: AppButtonProps) => {
    const { theme } = useUnistyles();
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
    const isDisabled = isLoading || disabled === true;
    const accessibilityState = { busy: isLoading, disabled: isDisabled };

    const contentStyles = [styles.content, isLoading && styles.contentHidden];

    return (
        <Pressable onPress={onPress} style={buttonStyles} {...restProps} accessibilityState={accessibilityState} disabled={isDisabled}>
            <View pointerEvents="none" style={contentStyles}>
                {isDefined(children) && children}

                {!isDefined(children) && (
                    <>
                        {isDefined(Icon) && <Icon color={colors.textColor} size={iconSize} />}
                        {shouldShowText && (
                            <Text
                                adjustsFontSizeToFit
                                maxFontSizeMultiplier={MaxFontSizeMultiplierConstant}
                                minimumFontScale={0.72}
                                numberOfLines={2}
                                style={textStyles}
                            >
                                {text}
                            </Text>
                        )}
                    </>
                )}
            </View>

            {isLoading && (
                <View pointerEvents="none" style={styles.loaderOverlay}>
                    <ActivityIndicator color={colors.textColor} testID={AppButtonLoaderTestId} />
                </View>
            )}
        </Pressable>
    );
};
