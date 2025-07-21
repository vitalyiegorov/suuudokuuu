import * as Device from 'expo-device';
import { useWindowDimensions } from 'react-native';

// UI component reserved heights
const MOBILE_RESERVED_HEIGHT = 260;
const TABLET_RESERVED_HEIGHT = 280;
const DESKTOP_RESERVED_HEIGHT = 300;

// Device-specific cell size bounds
const MOBILE_MIN_SIZE = 30;
const MOBILE_MAX_SIZE = 50;
const TABLET_MIN_SIZE = 35;
const TABLET_MAX_SIZE = 65;
const DESKTOP_MIN_SIZE = 40;
const DESKTOP_MAX_SIZE = 90;

// Layout constants
const GRID_GAPS_SIZE = 10;
const PADDING_SIZE = 40;
const FONT_SIZE_RATIO = 2.9;
const SUDOKU_GRID_SIZE = 9;

/**
 * Get reserved height for UI elements other than the field
 */
const getReservedHeight = (): number => {
    /*
     * Controls section (flex: 1, typically ~60-80px)
     * GameTimer (~40px)
     * Available values section (flex: 1, typically ~100-120px)
     * Padding and margins (~40px)
     */
    
    if (Device.deviceType === Device.DeviceType.TABLET) {
        return TABLET_RESERVED_HEIGHT;
    } else if (Device.deviceType === Device.DeviceType.DESKTOP) {
        return DESKTOP_RESERVED_HEIGHT;
    }
    
    return MOBILE_RESERVED_HEIGHT;
};

/**
 * Get minimum and maximum cell size bounds based on device type
 */
const getDeviceBounds = (): { minSize: number; maxSize: number } => {
    if (Device.deviceType === Device.DeviceType.TABLET) {
        return { minSize: TABLET_MIN_SIZE, maxSize: TABLET_MAX_SIZE };
    } else if (Device.deviceType === Device.DeviceType.DESKTOP) {
        return { minSize: DESKTOP_MIN_SIZE, maxSize: DESKTOP_MAX_SIZE };
    }
    
    return { minSize: MOBILE_MIN_SIZE, maxSize: MOBILE_MAX_SIZE };
};

/**
 * Hook to calculate dynamic cell size based on available screen space
 * Ensures the sudoku field fits properly on different screen heights
 */
export const useDynamicCellSize = () => {
    const { width, height } = useWindowDimensions();
    
    const reservedHeight = getReservedHeight();
    const availableHeight = height - reservedHeight;
    // Account for padding (20px on each side)
    const availableWidth = width - PADDING_SIZE;
    
    /*
     * Calculate maximum cell size that fits in available space
     * 9 cells + 2 gaps between 3x3 groups (5px each) + borders
     */
    const maxCellSizeByHeight = (availableHeight - GRID_GAPS_SIZE) / SUDOKU_GRID_SIZE;
    const maxCellSizeByWidth = (availableWidth - GRID_GAPS_SIZE) / SUDOKU_GRID_SIZE;
    
    // Use the smaller dimension to ensure the field fits
    const calculatedCellSize = Math.min(maxCellSizeByHeight, maxCellSizeByWidth);
    
    // Apply device-specific bounds to ensure good usability
    const { minSize, maxSize } = getDeviceBounds();
    const cellSize = Math.max(minSize, Math.min(maxSize, calculatedCellSize));
    
    return {
        cellSize: Math.floor(cellSize),
        fontSize: Math.floor(cellSize / FONT_SIZE_RATIO)
    };
};