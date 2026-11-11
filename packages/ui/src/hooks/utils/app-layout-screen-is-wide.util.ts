import { Breakpoints } from '../../theme/constant/breakpoints.constant';

import type { AppLayoutInterface } from '../../interface/app-layout.interface';

export const appLayoutScreenIsWide = ({ width, height }: Pick<AppLayoutInterface, 'width' | 'height'>): boolean =>
    width >= Breakpoints.md && width / height > 1;
