import { StyleSheet } from 'react-native-unistyles';

export const HistoryTechniqueChipStyles = StyleSheet.create(theme => ({
    chip: {
        alignItems: 'center',
        borderRadius: theme.radius.pill,
        flexDirection: 'row',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6
    },
    label: {
        fontSize: 11,
        fontWeight: '700'
    }
}));
