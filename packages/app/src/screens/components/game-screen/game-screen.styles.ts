import { StyleSheet } from 'react-native';

export const GameScreenStyles = StyleSheet.create({
    additionalControlsWrapper: {
        flex: 1,
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center',
        marginBottom: 20
    },
    availableValuesWrapper: {
        alignItems: 'center',
        flex: 2,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center'
    },
    bottomContainer: {
        flex: 1
    },
    bottomContainerWide: {
        flex: 0,
        gap: 20
    },
    button: { paddingHorizontal: 10 },
    buttonsWrapper: { flexDirection: 'row', gap: 5 },
    container: {
        alignItems: 'center',
        flex: 1,
        padding: 10,
        paddingBottom: 20
    },
    containerWide: {
        flexDirection: 'row',
        alignItems: 'stretch',
        padding: 20,
        gap: 20
    },
    controls: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        maxWidth: 600,
        minWidth: 345
    },
    controlsWide: {
        flexDirection: 'column',
        flex: 0,
        gap: 30,
        marginBottom: 20,
        minWidth: 300,
        maxWidth: 400
    },
    controlsWrapper: {
        alignItems: 'center'
    },
    fieldAndScoresWrapper: {
        flex: 3
    },
    fieldAndScoresWrapperWide: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fieldWrapper: {
        flex: 1
    },
    fieldWrapperWide: {
        flex: 1,
        justifyContent: 'center',
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
        alignItems: 'flex-end'
    }
});
