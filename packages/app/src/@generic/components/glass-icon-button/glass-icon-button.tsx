import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { type ComponentProps, use } from 'react';

import { ThemeContext } from '../../../theme/context/theme.context';
import { AppIconButton } from '../app-icon-button/app-icon-button';

import { GlassIconButtonStyles as styles } from './glass-icon-button.styles';

type Props = ComponentProps<typeof AppIconButton>;

export const GlassIconButton = (props: Props) => {
    const { theme } = use(ThemeContext);

    if (!isLiquidGlassAvailable()) {
        return <AppIconButton variant="primary" {...props} />;
    }

    return (
        <GlassView glassEffectStyle="regular" style={styles.glass} tintColor={theme.colors.ink}>
            <AppIconButton {...props} variant="glass" />
        </GlassView>
    );
};
