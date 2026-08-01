import Constants from 'expo-constants';

import { ThemeEnum } from '../../theme/enum/theme.enum';
import { BrandSchema } from '../schema/brand.schema';

import type { BrandType } from '../schema/brand.schema';

const fallbackBrand: BrandType = {
    appName: 'suuudokuuu',
    defaultTheme: ThemeEnum.BlackAndWhite,
    links: { donation: 'https://savelife.in.ua/en/donate-en/#donate-army-card-monthly' }
};

const BrandConfigExtraKey = 'brand';

export const getBrand = (): BrandType => {
    const parsed = BrandSchema.safeParse(Constants.expoConfig?.extra?.[BrandConfigExtraKey]);

    return parsed.success ? parsed.data : fallbackBrand;
};
