import { StyleSheet } from 'react-native';

export const CompletedGameItemStyles = StyleSheet.create({
    container: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginVertical: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    infoContainer: {
        flex: 1
    },
    row: {
        flexDirection: 'row',
        gap: 12
    },
    boldText: {
        fontWeight: 'bold'
    },
    lostText: {
        opacity: 0.7
    },
    replayButton: {
        paddingVertical: 6,
        paddingHorizontal: 12
    }
});
