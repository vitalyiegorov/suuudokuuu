import * as Device from 'expo-device';
import { Dimensions } from 'react-native';

const getCellSize = (): number => {
    if (Device.deviceType === Device.DeviceType.TABLET) {
        return 50;
    } else if (Device.deviceType === Device.DeviceType.DESKTOP) {
        return 70;
    }

    return 40;
};

// Responsive font size based on screen dimensions
const getResponsiveFontSize = (): number => {
    const { width, height } = Dimensions.get('window');
    const screenSize = Math.min(width, height);
    
    // Base font size as percentage of screen size for responsiveness
    // This ensures text scales appropriately across different screen sizes
    if (Device.deviceType === Device.DeviceType.TABLET) {
        return screenSize * 0.03; // ~3% of screen size for tablets
    } else if (Device.deviceType === Device.DeviceType.DESKTOP) {
        return screenSize * 0.025; // ~2.5% of screen size for desktop
    }
    
    return screenSize * 0.035; // ~3.5% of screen size for mobile
};

// Legacy static sizing - kept for compatibility
export const CellSizeConstant = getCellSize();
export const CellFontSizeConstant = getResponsiveFontSize();
