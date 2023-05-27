import { Dimensions, Platform } from 'react-native';

// TODO: Maybe there is a better way to do this? just based on the screen width?
export const getMultiplier = () => {
    if (Platform.OS === 'ios') {
        if (Platform.isPad) {
            return 18;
        } else {
            return 9.5;
        }
    } else if (Platform.OS === 'web') {
        if (Dimensions.get('screen').width > 1000) {
            return 22;
        } else if (Dimensions.get('screen').width > 600) {
            return 18;
        }
        return 9.5;
    }

    return 12;
};

export const FieldPaddingConstant = Dimensions.get('screen').width / 10;
export const CellSizeConstant = Dimensions.get('screen').width / getMultiplier();
export const CellFontSizeConstant = CellSizeConstant / 2.9;
