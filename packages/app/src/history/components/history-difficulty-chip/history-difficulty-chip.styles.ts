import { StyleSheet } from 'react-native-unistyles';

export const HistoryDifficultyChipStyles = StyleSheet.create(theme => ({
    container: {
        alignItems: 'center',
        borderRadius: theme.radius.pill,
        borderWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        minHeight: 42,
        minWidth: 96,
        paddingHorizontal: 17,
        paddingVertical: 10,
        _web: {
            cursor: 'pointer'
        }
    },
    label: {
        fontSize: 15,
        fontWeight: '800',
        lineHeight: 19,
        textAlign: 'center'
    }
}));
