import { StyleSheet } from 'react-native-unistyles';

export const HistoryTechniqueHeroStyles = StyleSheet.create(() => ({
    container: {
        borderRadius: 20,
        borderWidth: StyleSheet.hairlineWidth,
        gap: 10,
        padding: 18,
        width: '100%'
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.2
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10
    },
    value: {
        flex: 1,
        fontSize: 20,
        fontWeight: '800'
    }
}));
