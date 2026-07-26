import type { AppLayoutInterface } from '../../interface/app-layout.interface';

export const appLayoutGetSizeClass = (width: number, height: number, wideBreakpoint: number): AppLayoutInterface['sizeClass'] => {
    const isWideEnough = width >= wideBreakpoint;
    const isLandscape = width / height > 1;

    return isWideEnough && isLandscape ? 'wide' : 'compact';
};
