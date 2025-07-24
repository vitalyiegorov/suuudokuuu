import * as Device from 'expo-device';

const getCellSize = (): number => {
    if (Device.deviceType === Device.DeviceType.TABLET) {
        return 50;
    } else if (Device.deviceType === Device.DeviceType.DESKTOP) {
        return 70;
    }

    return 40;
};

export const CellSizeConstant = getCellSize();
export const CellFontSizeConstant = CellSizeConstant / 2.9;
export const CellCandidateOffsetConstant = CellSizeConstant * 0.1;
export const CellCandidateFontSizeConstant = CellFontSizeConstant / 1.5;
