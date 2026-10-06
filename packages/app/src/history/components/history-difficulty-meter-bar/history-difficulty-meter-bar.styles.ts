import { StyleSheet } from 'react-native-unistyles';

export const HistoryDifficultyMeterBarStyles = StyleSheet.create(theme => ({
    bar: {
        backgroundColor: theme.colors.numpad.track,
        borderRadius: 1,
        width: 3
    },
    filledBar: {
        backgroundColor: theme.colors.ink
    }
}));
