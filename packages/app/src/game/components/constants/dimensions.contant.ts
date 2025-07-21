/*
 * Responsive font size based on screen dimensions
 * Uses dynamic sizing that adapts to viewport proportionally
 */
import { Dimensions } from 'react-native';

const minFontSize = 14;
const maxFontSize = 24;
const fontSizeRatio = 0.04;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/*
 * Calculate font size as a percentage of screen dimensions
 * Use the smaller dimension to ensure it fits on both portrait and landscape
 */
const smallerDimension = Math.min(screenWidth, screenHeight);
export const CellFontSizeConstant = Math.max(minFontSize, Math.min(maxFontSize, smallerDimension * fontSizeRatio));
