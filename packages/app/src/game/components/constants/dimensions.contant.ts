import * as Device from 'expo-device';
import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const getCellSize = (screenMarginPercentage = 4): number => {
    // TODO: We need orientation to determine the correct size
    const minDimension = Math.min(height, width);

    const screenMargin = minDimension * (screenMarginPercentage / 100);

    if (Device.deviceType === Device.DeviceType.PHONE) {
        return Math.ceil((minDimension - screenMargin * 2) / 9);
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

export const CellFontSizeConstant = CellSizeConstant / 2.5;

export const CellCandidateVerticalOffsetConstant = CellSizeConstant * 0.05;
export const CellCandidateHorizontalOffsetConstant = CellSizeConstant * 0.05;
export const CellCandidateFontSizeConstant = CellSizeConstant / 3;
export const CellCandidateMaxFontSizeConstant = CellSizeConstant / 3.7;
