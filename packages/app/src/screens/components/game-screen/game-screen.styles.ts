import * as Device from 'expo-device';
import { Platform, StyleSheet } from 'react-native';

const GameScreenControlsGap = 16;
const GameScreenButtonGroupGap = 8;

export const GameScreenBottomInset = 16;

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
    buttonsWrapper: { flexDirection: 'row', flexShrink: 0, gap: GameScreenButtonGroupGap },
    container: {
        alignItems: 'center',
        flex: 1,
        padding: 10,
        paddingBottom: 20
    },
    controls: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: GameScreenControlsGap,
        justifyContent: 'center',
        marginBottom: 14,
        maxWidth: 600,
        width: '100%',

        ...(Device.deviceType === Device.DeviceType.PHONE && Platform.select({ web: { height: 50 } }))
    },
    fieldWrapper: {
        flex: 3
    }
});
