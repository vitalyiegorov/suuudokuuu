import { Breakpoints } from '../../theme/constant/breakpoints.constant';

import { appLayoutGetSizeClass } from './app-layout-get-size-class.util';

import type { AppLayoutInterface } from '../../interface/app-layout.interface';

export const appLayoutScreenIsWide = (screen: Pick<AppLayoutInterface, 'width' | 'height'>): boolean =>
    appLayoutGetSizeClass(screen.width, screen.height, Breakpoints.md) === 'wide';
