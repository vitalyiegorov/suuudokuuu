import * as Device from 'expo-device';
import { Platform, StyleSheet } from 'react-native';

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
        flex: 1,
        ...(Device.deviceType === Device.DeviceType.PHONE && Platform.select({ web: { flex: 1.3 } }))
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
        marginBottom: 20,
        maxWidth: 600,
        minWidth: 345,

        ...(Device.deviceType === Device.DeviceType.PHONE && Platform.select({ web: { height: 50 } }))
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
    }
});
