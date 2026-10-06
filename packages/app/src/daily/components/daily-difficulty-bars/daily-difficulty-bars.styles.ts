import { StyleSheet } from 'react-native-unistyles';

export const DailyDifficultyBarsStyles = StyleSheet.create(() => ({
    bar: {
        borderRadius: 1,
        width: 3
    },
    bars: {
        alignItems: 'flex-end',
        flexDirection: 'row',
        gap: 2,
        height: 11
    }
}));
