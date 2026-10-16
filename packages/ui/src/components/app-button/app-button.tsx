import {
    Pressable,
    type PressableProps,
    type HostInstance,
    type PressableStateCallbackType,
    type StyleProp,
    Text,
    type TextProps,
    View,
    type ViewStyle
} from 'react-native';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { MaxFontSizeMultiplierConstant } from '../../theme/constant/font-scaling.constant';

import { AppButtonIcon } from './app-button-icon/app-button-icon';
import { AppButtonLoader } from './app-button-loader/app-button-loader';
import { AppButtonStyles as styles } from './app-button.styles';
import { appButtonGetTextColor } from './utils/app-button-get-text-color.util';

import type { UnistylesThemeInterface } from '../../theme/interface/unistyles-theme.interface';
import type { LucideIcon } from 'lucide-react-native';
import type { ReactNode, Ref } from 'react';

export type AppButtonSize = 'compact' | 'regular' | 'large';
export type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverted' | 'glass' | 'dangerFilled' | 'boardSelected';

export interface AppButtonProps extends Omit<PressableProps, 'style'> {
    readonly text?: string;
    readonly icon?: LucideIcon;
    readonly textStyle?: TextProps['style'];
    readonly style?: StyleProp<ViewStyle>;
    readonly isLoading?: boolean;
    readonly children?: ReactNode;
    readonly size?: AppButtonSize;
    readonly variant?: AppButtonVariant;
    readonly ref?: Ref<HostInstance>;
}

export const AppButton = ({
    text,
    style,
    textStyle,
    onPress,
    isLoading = false,
    disabled,
    icon: Icon,
    children,
    size = 'regular',
    variant = 'primary',
    accessibilityState: accessibilityStateProp,
    ...restProps
}: AppButtonProps) => {
    styles.useVariants({ size, variant });
    const tintProps = (theme: UnistylesThemeInterface) => ({ color: appButtonGetTextColor(theme, variant) });
    const buttonStyles = [styles.button, style];
    const textStyles = [styles.text, textStyle];
    const shouldShowText = isNotEmptyString(text);
    const isDisabled = isLoading || disabled === true;
    const accessibilityState = { ...accessibilityStateProp, busy: isLoading, disabled: isDisabled };

    const contentStyles = [styles.content, isLoading && styles.contentHidden];
    const pressableStyles = ({ pressed }: PressableStateCallbackType) => [...buttonStyles, pressed && styles.pressed];

    return (
        <Pressable
            accessibilityRole="button"
            onPress={onPress}
            style={pressableStyles}
            {...restProps}
            accessibilityState={accessibilityState}
            disabled={isDisabled}
        >
            <View pointerEvents="none" style={contentStyles}>
                {isDefined(children) && children}

                {!isDefined(children) && (
                    <>
                        {isDefined(Icon) && <AppButtonIcon icon={Icon} uniProps={tintProps} />}
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
                    <AppButtonLoader testID="AppButtonSelectors.Loader" uniProps={tintProps} />
                </View>
            )}
        </Pressable>
    );
};
