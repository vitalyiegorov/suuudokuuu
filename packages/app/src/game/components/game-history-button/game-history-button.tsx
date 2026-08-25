import { use } from 'react';

import { AppIconButton } from '../../../@generic/components/app-icon-button/app-icon-button';
import { ThemeContext } from '../../../theme/context/theme.context';

import type { LucideIcon } from 'lucide-react-native';
import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly accessibilityLabel: string;
    readonly icon: LucideIcon;
    readonly isDisabled: boolean;
    readonly onPress: () => void;
    readonly sizeStyle: StyleProp<ViewStyle>;
    readonly testID: string;
}

export const GameHistoryButton = ({ accessibilityLabel, icon: Icon, isDisabled, onPress, sizeStyle, testID }: Props) => {
    const { theme } = use(ThemeContext);

    const iconColor = isDisabled ? theme.colors.text.hint : theme.colors.surface.raisedText;

    return (
        <AppIconButton
            accessibilityLabel={accessibilityLabel}
            disabled={isDisabled}
            hitSlop={10}
            onPress={onPress}
            style={sizeStyle}
            testID={testID}
            variant="inverted"
        >
            <Icon color={iconColor} />
        </AppIconButton>
    );
};
