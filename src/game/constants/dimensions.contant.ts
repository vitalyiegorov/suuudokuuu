import { isDesktopScreen, isTabletScreen } from '../../@generic';

const getCellSize = (): number => {
    if (isDesktopScreen()) {
        return 70;
    } else if (isTabletScreen()) {
        return 60;
    }

    return 40;
};

export const CellSizeConstant = getCellSize();
export const CellFontSizeConstant = CellSizeConstant / 2.9;
