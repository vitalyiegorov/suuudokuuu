import { describe, expect, it, jest } from '@jest/globals';

import { ThemeEnum } from '../../theme/enum/theme.enum';

jest.mock('expo-constants', () => ({
    default: {
        expoConfig: {
            extra: {
                brand: {
                    appName: 'suuudokuuu',
                    defaultTheme: 'black-and-white',
                    links: { donation: 'https://savelife.in.ua/en/donate-en/#donate-army-card-monthly' }
                }
            }
        }
    }
}));

import { getBrand } from './get-brand.util';

describe('getBrand', () => {
    it('returns validated brand values from expo config', () => {
        expect.assertions(3);

        const brand = getBrand();

        expect(brand.appName.length).toBeGreaterThan(0);
        expect(Object.values(ThemeEnum)).toContain(brand.defaultTheme);
        expect(brand.links.donation.startsWith('https://')).toBe(true);
    });
});
