import { type StyleProp, View, type ViewStyle } from 'react-native';

import { AppProgressBarStyles as styles } from './app-progress-bar.styles';

interface Props {
    readonly percent: number;
    readonly style?: StyleProp<ViewStyle>;
}

export const AppProgressBar = ({ percent, style }: Props) => {
    const boundedPercent = Math.max(0, Math.min(100, percent));
    const remainderPercent = 100 - boundedPercent;
    const trackStyles = [styles.track, style];
    const fillStyles = [styles.fill, { flex: boundedPercent }];
    const remainderStyles = [styles.remainder, { flex: remainderPercent }];

    return (
        <View style={trackStyles}>
            <View style={fillStyles} />
            <View style={remainderStyles} />
        </View>
    );
};
