import { ThemeEnum } from '@suuudokuuu/progress';
import * as Option from 'effect/Option';
import * as Schema from 'effect/Schema';
import Constants from 'expo-constants';

import { BrandSchema } from '../schema/brand.schema';

import type { BrandType } from '../schema/brand.schema';

const fallbackBrand: BrandType = {
    appName: 'suuudokuuu',
    defaultTheme: ThemeEnum.BlackAndWhite,
    links: { donation: 'https://savelife.in.ua/en/donate-en/#donate-army-card-monthly' }
};

const BrandConfigExtraKey = 'brand';

export const getBrand = (): BrandType =>
    Option.getOrElse(Schema.decodeUnknownOption(BrandSchema)(Constants.expoConfig?.extra?.[BrandConfigExtraKey]), () => fallbackBrand);
