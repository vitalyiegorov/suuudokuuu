import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { settingsFontSizeMultiplierSelector } from '../../settings/store/settings.selectors';
import { getCellFontSize } from '../utils/get-cell-font-size.util';

export const useCellFontSize = (boardCellSize: number) => {
    const fontSizeMultiplier = useAppSelector(settingsFontSizeMultiplierSelector);

    return getCellFontSize(boardCellSize, fontSizeMultiplier);
};
