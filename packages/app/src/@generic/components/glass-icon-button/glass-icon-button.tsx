import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { type ComponentProps, use } from 'react';

import { ThemeContext } from '../../../theme/context/theme.context';
import { BlackIconButton } from '../black-icon-button/black-icon-button';

import { GlassIconButtonStyles as styles } from './glass-icon-button.styles';

type Props = ComponentProps<typeof BlackIconButton>;

export const GlassIconButton = (props: Props) => {
    const { theme } = use(ThemeContext);

    if (!isLiquidGlassAvailable()) {
        return <BlackIconButton variant="inverted" {...props} />;
    }

    return (
        <GlassView glassEffectStyle="regular" style={styles.glass} tintColor={theme.colors.black}>
            <BlackIconButton {...props} variant="glass" />
        </GlassView>
    );
};
