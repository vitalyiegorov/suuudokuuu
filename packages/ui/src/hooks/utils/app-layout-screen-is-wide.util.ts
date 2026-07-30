import { Breakpoints } from '../../theme/constant/breakpoints.constant';

import { appLayoutGetSizeClass } from './app-layout-get-size-class.util';

interface AppLayoutScreenInterface {
    readonly width: number;
    readonly height: number;
}

export const appLayoutScreenIsWide = (screen: AppLayoutScreenInterface): boolean =>
    appLayoutGetSizeClass(screen.width, screen.height, Breakpoints.md) === 'wide';
