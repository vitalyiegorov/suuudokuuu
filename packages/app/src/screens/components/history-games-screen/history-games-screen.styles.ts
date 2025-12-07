import { StyleSheet } from 'react-native';

export const HistoryGamesScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16
    },
    listContent: {
        paddingBottom: 16
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
