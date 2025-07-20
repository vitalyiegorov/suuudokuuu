import * as Device from 'expo-device';
import { StyleSheet } from 'react-native';

export const FieldStyles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    wrapper: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 'auto',
        zIndex: 99,
        ...(Device.deviceType === Device.DeviceType.DESKTOP
            ? { flex: 4 }
            : {
                  flex: 3
              })
    }
});
