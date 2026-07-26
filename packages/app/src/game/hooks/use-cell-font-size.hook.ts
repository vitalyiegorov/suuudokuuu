import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { settingsFontSizeMultiplierSelector } from '../../settings/store/settings.selectors';

export const useCellFontSize = (boardCellSize: number) => {
    const fontSizeMultiplier = useAppSelector(settingsFontSizeMultiplierSelector);

    return (boardCellSize / 2.5) * fontSizeMultiplier;
};
