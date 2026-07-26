import { useUnistyles } from 'react-native-unistyles';

import { Breakpoints } from '../theme/constant/breakpoints.constant';

import { appLayoutGetSizeClass } from './utils/app-layout-get-size-class.util';

import type { AppLayoutInterface } from '../interface/app-layout.interface';

export const useAppLayout = (): AppLayoutInterface => {
    const { rt } = useUnistyles();
    const { width, height } = rt.screen;

    return {
        sizeClass: appLayoutGetSizeClass(width, height, Breakpoints.md),
        width,
        height
    };
};
