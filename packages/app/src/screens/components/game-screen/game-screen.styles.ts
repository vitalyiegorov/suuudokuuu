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
        alignItems: 'center',
        flex: 1,
        padding: 10,
        paddingBottom: 20
    },
    controls: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        maxWidth: 600,
        minWidth: 380
    },
    controlsWrapper: {
        alignItems: 'center'
    },
    fieldWrapper: {
        flex: 5
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
        alignItems: 'flex-end'
    }
});
