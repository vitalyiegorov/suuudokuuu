import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { ThemeEnum } from '../../theme/enum/theme.enum';

interface MockExpoConfigInterface {
    readonly extra?: Record<string, unknown>;
}

interface MockConstantsHolderInterface {
    expoConfig: MockExpoConfigInterface | undefined;
}

const validBrand = {
    appName: 'suuudokuuu',
    defaultTheme: 'black-and-white',
    links: { donation: 'https://savelife.in.ua/en/donate-en/#donate-army-card-monthly' }
};

const mockConstantsHolder: MockConstantsHolderInterface = { expoConfig: { extra: { brand: validBrand } } };

jest.mock('expo-constants', () => ({
    __esModule: true,
    default: {
        get expoConfig() {
            return mockConstantsHolder.expoConfig;
        }
    }
}));

import { getBrand } from './get-brand.util';

describe('getBrand', () => {
    beforeEach(() => {
        mockConstantsHolder.expoConfig = { extra: { brand: validBrand } };
    });

    it('returns validated brand values from expo config', () => {
        expect.assertions(3);

        const brand = getBrand();

        expect(brand.appName.length).toBeGreaterThan(0);
        expect(Object.values(ThemeEnum)).toContain(brand.defaultTheme);
        expect(brand.links.donation.startsWith('https://')).toBe(true);
    });

    it('returns the fallback brand when extra.brand fails schema validation', () => {
        expect.assertions(3);

        mockConstantsHolder.expoConfig = { extra: { brand: { appName: '', links: {} } } };

        const brand = getBrand();

        expect(brand.appName).toBe('suuudokuuu');
        expect(brand.defaultTheme).toBe(ThemeEnum.BlackAndWhite);
        expect(brand.links.donation).toBe('https://savelife.in.ua/en/donate-en/#donate-army-card-monthly');
    });

    it('returns the fallback brand when expoConfig is missing', () => {
        expect.assertions(1);

        mockConstantsHolder.expoConfig = undefined;

        expect(getBrand().appName).toBe('suuudokuuu');
    });

    it('returns the fallback brand when extra is missing', () => {
        expect.assertions(1);

        mockConstantsHolder.expoConfig = {};

        expect(getBrand().appName).toBe('suuudokuuu');
    });
});
