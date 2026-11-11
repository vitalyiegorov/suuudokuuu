import { useUnistyles } from 'react-native-unistyles';

import { appLayoutScreenIsWide } from './utils/app-layout-screen-is-wide.util';

import type { AppLayoutInterface } from '../interface/app-layout.interface';

export const useAppLayout = (): AppLayoutInterface => {
    const { rt } = useUnistyles();
    const { width, height } = rt.screen;

    return {
        sizeClass: appLayoutScreenIsWide({ width, height }) ? 'wide' : 'compact',
        width,
        height
    };
};
