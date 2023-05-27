import { Dimensions, Platform } from 'react-native';

export const getMultiplier = () => {
    if (Platform.OS === 'ios') {
        if (Platform.isPad) {
            return 18;
        } else {
            return 9.5;
        }
    } else if (Platform.OS === 'web') {
        return 22;
    }

    return 12;
};

export const FieldPaddingConstant = Dimensions.get('screen').width / 10;
export const CellSizeConstant = Dimensions.get('screen').width / getMultiplier();
export const CellFontSizeConstant = CellSizeConstant / 2.9;
