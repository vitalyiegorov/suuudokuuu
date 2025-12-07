import { StyleSheet } from 'react-native';

export const HistoryGamesScreenStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        padding: 20,
        paddingHorizontal: 40
    },
    list: {
        marginBottom: 20,
        maxWidth: 500,
        width: '100%'
    },
    listContent: {
        gap: 8
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyText: {
        opacity: 0.6,
        textAlign: 'center'
    }
});
