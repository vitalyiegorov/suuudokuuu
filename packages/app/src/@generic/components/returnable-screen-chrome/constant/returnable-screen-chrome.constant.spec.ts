import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

import { ReturnableScreenHeaderHeight } from '../../returnable-screen-header/constant/returnable-screen-header.constant';

import {
    ReturnableScreenChromeCompactContentPreset,
    ReturnableScreenChromeRegularContentPreset,
    ReturnableScreenChromeTopContentInsetByPreset
} from './returnable-screen-chrome.constant';

const ReturnableScreenChromeRegularTopContentInsetExtra = 36;

describe('ReturnableScreenChrome constants', () => {
    it('uses compact bottom chrome spacing instead of full fade height scroll space', () => {
        const source = readFileSync(join(__dirname, 'returnable-screen-chrome.constant.ts'), 'utf8');

        expect(source).toContain('ReturnableScreenChromeBottomOverlayHeight = 96');
        expect(source).toContain("ReturnableScreenChromeCompactBottomContentPreset = 'compact'");
        expect(source).toContain('ReturnableScreenChromeCompactBottomContentInset = 40');
        expect(source).not.toContain('ScreenChromeBottomFadeHeight * ReturnableScreenChromeBottomVisibleRatio');
    });

    it('keeps compact top content below the visible returnable header', () => {
        const compactTopContentInset = ReturnableScreenChromeTopContentInsetByPreset[ReturnableScreenChromeCompactContentPreset];
        const regularTopContentInset = ReturnableScreenChromeTopContentInsetByPreset[ReturnableScreenChromeRegularContentPreset];

        expect(compactTopContentInset).toBe(ReturnableScreenHeaderHeight + 8);
        expect(regularTopContentInset).toBe(ReturnableScreenHeaderHeight + ReturnableScreenChromeRegularTopContentInsetExtra);
        expect(compactTopContentInset).toBeLessThan(regularTopContentInset);
    });
});
