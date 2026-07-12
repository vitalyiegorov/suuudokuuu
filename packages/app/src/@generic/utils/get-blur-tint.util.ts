import { ColorSchemaEnum } from '../../theme/enum/color-schema.enum';

import type { BlurTint } from 'expo-blur';

export const getBlurTint = (colorScheme: ColorSchemaEnum, isIos: boolean): BlurTint => {
    if (colorScheme === ColorSchemaEnum.Dark) {
        return isIos ? 'systemChromeMaterialDark' : 'systemMaterialDark';
    }

    return isIos ? 'systemChromeMaterialLight' : 'systemMaterialLight';
};
