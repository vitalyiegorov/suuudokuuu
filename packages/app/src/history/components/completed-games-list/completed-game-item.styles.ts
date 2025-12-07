import { StyleSheet } from 'react-native';

export const CompletedGameItemStyles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginVertical: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    infoContainer: {
        flex: 1,
        gap: 4
    },
    row: {
        flexDirection: 'row',
        gap: 16
    },
    boldText: {
        fontWeight: 'bold'
    },
    statusText: {
        fontWeight: 'bold'
    },
    replayButton: {
        paddingVertical: 8,
        paddingHorizontal: 16
    }
});
