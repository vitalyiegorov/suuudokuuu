import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { settingsFontSizeMultiplierSelector } from '../../settings/store/settings.selectors';
import { CellFontSizeConstant } from '../components/constants/dimensions.contant';

export const useCellFontSize = () => {
    const fontSizeMultiplier = useAppSelector(settingsFontSizeMultiplierSelector);

    return CellFontSizeConstant * fontSizeMultiplier;
};
