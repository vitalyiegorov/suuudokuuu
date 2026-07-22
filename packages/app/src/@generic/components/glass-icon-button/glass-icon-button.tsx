import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { type ComponentProps } from 'react';

import { BlackIconButton } from '../black-icon-button/black-icon-button';

import { GlassIconButtonStyles as styles } from './glass-icon-button.styles';

type Props = ComponentProps<typeof BlackIconButton>;

export const GlassIconButton = (props: Props) => {
    if (!isLiquidGlassAvailable()) {
        return <BlackIconButton variant="inverted" {...props} />;
    }

    return (
        <GlassView glassEffectStyle="regular" style={styles.glass}>
            <BlackIconButton {...props} variant="glass" />
        </GlassView>
    );
};
