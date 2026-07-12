import { type ComponentProps, type ReactNode } from 'react';
import { type PressableProps, type StyleProp, type TextProps, type ViewStyle } from 'react-native';

import { AppLinkButton } from '../app-link-button/app-link-button';

import { BlackButtonStyles as styles } from './black-button.styles';
import { BlackButtonIconSize } from './constant/black-button-icon-size.constant';

import type { AppButtonVariant } from '@suuudokuuu/ui';
import type { Link } from 'expo-router';
import type { LucideIcon } from 'lucide-react-native';

interface Props extends Omit<PressableProps, 'style'> {
    readonly text?: string;
    readonly icon?: LucideIcon;
    readonly styleText?: TextProps['style'];
    readonly style?: StyleProp<ViewStyle>;
    readonly replace?: ComponentProps<typeof Link>['replace'];
    readonly href?: ComponentProps<typeof Link>['href'];
    readonly isLoading?: boolean;
    readonly isActive?: boolean;
    readonly children?: ReactNode;
    readonly variant?: AppButtonVariant;
}

export const BlackButton = (props: Props) => {
    const { style, styleText, isActive = false, variant, ...restProps } = props;
    const buttonVariant = variant ?? (isActive ? 'inverted' : 'primary');
    const buttonStyles = [styles.button, style];
    const textStyles = [styles.buttonText, styleText];

    return (
        <AppLinkButton iconSize={BlackButtonIconSize} style={buttonStyles} textStyle={textStyles} variant={buttonVariant} {...restProps} />
    );
};
