import { StyleSheet } from 'react-native';

export const ScoringScreenStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        padding: 20,
        paddingHorizontal: 40
    },
    scrollView: {
        marginBottom: 20,
        maxWidth: 600,
        width: '100%'
    },
    scrollViewContent: {
        gap: 8,
        paddingBottom: 20
    },
    listItem: {
        marginLeft: 12,
        marginVertical: 4
    }
});
