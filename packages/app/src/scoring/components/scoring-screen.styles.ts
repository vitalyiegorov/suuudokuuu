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
    scrollViewContent: (sizeClass: 'compact' | 'wide') => ({
        flexDirection: sizeClass === 'wide' ? 'row' : 'column',
        flexWrap: 'wrap',
        gap: theme.spacing.md
    }),
    section: (sizeClass: 'compact' | 'wide') => ({
        marginBottom: 16,
        width: sizeClass === 'wide' ? '48%' : '100%'
    }),
    listItem: {
        marginLeft: 12,
        marginVertical: 4
    }
}));
