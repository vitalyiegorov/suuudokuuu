import { Dimensions, Platform } from 'react-native';

export const isMobileScreen = () => Dimensions.get('screen').width < 600;
export const isTabletScreen = () => Dimensions.get('screen').width > 600;
export const isDesktopScreen = () => Dimensions.get('screen').width > 1200;

// TODO: Maybe there is a better way to do this? just based on the screen width?
export const getDivider = () => {
    // TODO: Implement Android design
    if (Platform.OS === 'ios') {
        if (Platform.isPad) {
            return 18;
        }

        return 9.5;
    } else if (Platform.OS === 'web') {
        if (isDesktopScreen()) {
            return 22;
        } else if (isTabletScreen()) {
            return 18;
        }

        return 9.5;
    }

    return 12;
};

export const FieldPaddingConstant = Dimensions.get('screen').width / 10;
export const CellSizeConstant = Dimensions.get('screen').width / getDivider();
export const CellFontSizeConstant = CellSizeConstant / 2.9;
