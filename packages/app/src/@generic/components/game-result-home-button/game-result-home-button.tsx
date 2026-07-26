import { LucideHouse } from 'lucide-react-native';
import { use } from 'react';

import { ThemeContext } from '../../../theme/context/theme.context';
import { GlassIconButton } from '../glass-icon-button/glass-icon-button';

interface Props {
    readonly accessibilityLabel: string;
    readonly testID: string;
}

export const GameResultHomeButton = ({ accessibilityLabel, testID }: Props) => {
    const { theme } = use(ThemeContext);

    return (
        <GlassIconButton accessibilityLabel={accessibilityLabel} href="/" replace testID={testID}>
            <LucideHouse color={theme.colors.label.inverted} />
        </GlassIconButton>
    );
};
