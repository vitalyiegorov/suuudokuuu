import LucideHouse from 'lucide-react-native/icons/house';
import { use } from 'react';

import { ThemeContext } from '../../../theme/context/theme.context';
import { GlassIconButton } from '../glass-icon-button/glass-icon-button';

import type { ComponentProps } from 'react';

interface Props {
    readonly accessibilityLabel: string;
    readonly testID: string;
    readonly onPress?: ComponentProps<typeof GlassIconButton>['onPress'];
}

export const GameResultHomeButton = ({ accessibilityLabel, onPress, testID }: Props) => {
    const { theme } = use(ThemeContext);

    return (
        <GlassIconButton accessibilityLabel={accessibilityLabel} href="/" onPress={onPress} replace testID={testID}>
            <LucideHouse color={theme.colors.inkText} />
        </GlassIconButton>
    );
};
