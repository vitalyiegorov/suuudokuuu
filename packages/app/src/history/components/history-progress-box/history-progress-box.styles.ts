import { StyleSheet } from 'react-native-unistyles';

export const HistoryProgressBoxStyles = StyleSheet.create(theme => ({
    box: {
        backgroundColor: theme.colors.surface.group,
        borderColor: theme.colors.surface.border,
        borderCurve: 'continuous',
        borderRadius: 20,
        borderWidth: 1.5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden',
        width: '100%'
    },
    container: {
        gap: 10,
        width: '100%'
    }
}));
