import { type StyleProp, View, type ViewStyle } from 'react-native';

import { useUiTheme } from '../../theme/hooks/use-ui-theme.hook';

import { AppProgressBarStyles as styles } from './app-progress-bar.styles';

type AppProgressBarSize = 'compact' | 'regular';
type AppProgressBarVariant = 'default' | 'inverted';

interface Props {
    readonly percent: number;
    readonly size?: AppProgressBarSize;
    readonly style?: StyleProp<ViewStyle>;
    readonly variant?: AppProgressBarVariant;
}

export const AppProgressBar = ({ percent, size = 'regular', style, variant = 'default' }: Props) => {
    const { theme } = useUiTheme();
    const isInvertedVariant = variant === 'inverted';
    const trackColor = isInvertedVariant ? theme.colors.white05 : theme.colors.value.progress;
    const fillColor = isInvertedVariant ? theme.colors.label.inverted : theme.colors.value.progressActive;
    const boundedPercent = Math.max(0, Math.min(100, percent));
    const remainderPercent = 100 - boundedPercent;
    const trackStyles = [styles.track, styles[size], { backgroundColor: trackColor }, style];
    const fillStyles = [styles.fill, { backgroundColor: fillColor, flex: boundedPercent }];
    const remainderStyles = [styles.remainder, { flex: remainderPercent }];

    return (
        <View style={trackStyles}>
            <View style={fillStyles} />
            <View style={remainderStyles} />
        </View>
    );
};
