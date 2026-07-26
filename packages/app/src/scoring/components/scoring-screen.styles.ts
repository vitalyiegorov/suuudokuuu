import { StyleSheet } from 'react-native-unistyles';

export const ScoringScreenStyles = StyleSheet.create(theme => ({
    content: {
        alignItems: 'center',
        paddingHorizontal: 40
    },
    scrollView: {
        maxWidth: theme.contentWidth.standard,
        width: '100%'
    },
    scrollViewContent: {
        flexDirection: 'column',
        gap: theme.spacing.sm
    },
    section: {
        marginBottom: 16,
        width: '100%'
    },
    listItem: {
        marginLeft: 12,
        marginVertical: 4
    }
}));
