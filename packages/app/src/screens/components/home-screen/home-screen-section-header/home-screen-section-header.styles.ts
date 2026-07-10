import { StyleSheet } from 'react-native-unistyles';

export const HomeScreenSectionHeaderStyles = StyleSheet.create(theme => ({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.md,
        width: '100%'
    },
    label: {
        fontSize: 13,
        fontWeight: '900',
        lineHeight: 17,
        textAlign: 'left',
        textTransform: 'uppercase'
    },
    line: {
        flex: 1,
        height: StyleSheet.hairlineWidth
    }
}));
