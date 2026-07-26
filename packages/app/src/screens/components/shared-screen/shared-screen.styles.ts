import { StyleSheet } from 'react-native-unistyles';

export const SharedScreenStyles = StyleSheet.create(theme => ({
    buttonsWrapper: {
        alignItems: 'center',
        gap: 10,
        width: '100%'
    },
    container: {
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1,
        flexDirection: 'column',
        gap: theme.spacing.xl,
        justifyContent: 'center',
        maxWidth: theme.contentWidth.standard,
        padding: 10,
        width: '100%'
    },
    headerColumn: {
        alignItems: 'center',
        width: '100%'
    }
}));
