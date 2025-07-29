import * as Device from 'expo-device';
import { Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');

const getCellSize = (): number => {
    // TODO: We need orientation to determine the correct size
    const minDimension = Math.min(height, width);

    if (Device.deviceType === Device.DeviceType.PHONE) {
        if (minDimension <= 300) {
            return 35;
        } else if (minDimension <= 400) {
            return 40;
        } else if (minDimension <= 500) {
            return 45;
        }

        return 60;
    }

    if (minDimension <= 500) {
        return 20;
    } else if (minDimension <= 600) {
        return 30;
    } else if (minDimension <= 700) {
        return 40;
    } else if (minDimension <= 800) {
        return 50;
    } else if (minDimension <= 960) {
        return 60;
    }

    return 70;
};

export const CellSizeConstant = getCellSize();
export const CellFontSizeConstant = CellSizeConstant / 2;
export const CellCandidateOffsetConstant = CellSizeConstant * 0.1;
export const CellCandidateFontSizeConstant = CellFontSizeConstant / 2;
