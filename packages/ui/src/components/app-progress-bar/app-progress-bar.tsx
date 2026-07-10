import { type StyleProp, View, type ViewStyle } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { AppProgressBarStyles as styles } from './app-progress-bar.styles';

type AppProgressBarSize = 'compact' | 'regular';

interface Props {
    readonly percent: number;
    readonly size?: AppProgressBarSize;
    readonly style?: StyleProp<ViewStyle>;
}

export const AppProgressBar = ({ percent, size = 'regular', style }: Props) => {
    const { theme } = useUnistyles();
    const boundedPercent = Math.max(0, Math.min(100, percent));
    const remainderPercent = 100 - boundedPercent;
    const trackStyles = [styles.track, styles[size], { backgroundColor: theme.colors.value.progress }, style];
    const fillStyles = [styles.fill, { backgroundColor: theme.colors.value.progressActive, flex: boundedPercent }];
    const remainderStyles = [styles.remainder, { flex: remainderPercent }];

    return (
        <View style={trackStyles}>
            <View style={fillStyles} />
            <View style={remainderStyles} />
        </View>
    );
};
