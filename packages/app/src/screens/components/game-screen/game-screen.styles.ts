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
        minWidth: 345
    },
    controlsWrapper: {
        alignItems: 'center'
    },
    fieldWrapper: {
        flex: 3
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
    },
    // Wide screen layout styles
    wideScreenContainer: {
        alignItems: 'stretch',
        flexDirection: 'row',
        flex: 1,
        padding: 20,
        gap: 20
    },
    wideScreenLeftColumn: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    wideScreenRightColumn: {
        flex: 1,
        minWidth: 300,
        maxWidth: 400,
        justifyContent: 'space-between',
        paddingVertical: 20
    },
    wideScreenControls: {
        flexDirection: 'column',
        gap: 30,
        marginBottom: 20
    },
    wideScreenFieldWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    wideScreenBottomContainer: {
        gap: 20
    }
});
