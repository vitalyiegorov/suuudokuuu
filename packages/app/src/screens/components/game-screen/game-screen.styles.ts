import { StyleSheet } from 'react-native';

export const GameScreenStyles = StyleSheet.create({
    availableValuesWrapper: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center'
    },
    button: { paddingHorizontal: 10 },
    buttonsWrapper: { flexDirection: 'row', gap: 5 },
    container: {
        flex: 1,
        padding: 10,
        paddingBottom: 20
    },
    controls: {
        alignItems: 'center',
        flexDirection: 'row',
        flex: 0.25,
        justifyContent: 'space-between',
        marginBottom: 40
    },
    controlsWrapper: {
        alignItems: 'center'
    },
    mistakesCountText: {
        fontWeight: 'bold'
    },
    mistakesMaxText: {
        fontWeight: 'bold'
    },
    mistakesSeparator: {
        marginHorizontal: 5
    },
    scoreText: {
        fontWeight: 'bold'
    },
    scoreWrapper: {
        alignItems: 'flex-end',
        minWidth: 130
    }
});
