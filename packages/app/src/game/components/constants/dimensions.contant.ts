import * as Device from 'expo-device';

const getCellSize = (): number => {
    if (Device.deviceType === Device.DeviceType.TABLET) {
        return 50;
    } else if (Device.deviceType === Device.DeviceType.DESKTOP) {
        return 70;
    }

    return 40;
};

/*
 * Legacy static sizing - kept for compatibility
 * Use useDynamicCellSize hook for responsive sizing instead
 */
export const CellSizeConstant = getCellSize();
export const CellFontSizeConstant = CellSizeConstant / 2.9;
