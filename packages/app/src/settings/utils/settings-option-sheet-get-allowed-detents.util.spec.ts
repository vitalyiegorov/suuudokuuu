import { describe, expect, it } from '@jest/globals';

import {
    SettingsOptionSheetBaseContentHeight,
    SettingsOptionSheetDetentPrecision,
    SettingsOptionSheetExpandedDetent,
    SettingsOptionSheetMaxInitialDetent,
    SettingsOptionSheetRowMinHeight
} from '../constant/settings-option-sheet-layout.constant';

import { settingsOptionSheetGetAllowedDetents } from './settings-option-sheet-get-allowed-detents.util';

const CompactOptionCount = 3;
const LongOptionCount = 13;
const ShortScreenHeight = 667;
const TallScreenHeight = 956;

const settingsOptionSheetGetExpectedCompactDetent = (screenHeight: number) => {
    const contentHeight = SettingsOptionSheetBaseContentHeight + SettingsOptionSheetRowMinHeight * CompactOptionCount;

    return Math.ceil((contentHeight / screenHeight) * SettingsOptionSheetDetentPrecision) / SettingsOptionSheetDetentPrecision;
};

const CompactShortScreenDetents = [settingsOptionSheetGetExpectedCompactDetent(ShortScreenHeight)];
const CompactTallScreenDetents = [settingsOptionSheetGetExpectedCompactDetent(TallScreenHeight)];
const LongTallScreenDetents = [SettingsOptionSheetMaxInitialDetent, SettingsOptionSheetExpandedDetent];

describe('settingsOptionSheetGetAllowedDetents', () => {
    it('fits compact option sheets to content on tall screens', () => {
        expect(settingsOptionSheetGetAllowedDetents(CompactOptionCount, TallScreenHeight)).toEqual(CompactTallScreenDetents);
    });

    it('keeps compact option sheets readable on shorter screens', () => {
        expect(settingsOptionSheetGetAllowedDetents(CompactOptionCount, ShortScreenHeight)).toEqual(CompactShortScreenDetents);
    });

    it('opens long option sheets higher and allows expansion', () => {
        expect(settingsOptionSheetGetAllowedDetents(LongOptionCount, TallScreenHeight)).toEqual(LongTallScreenDetents);
    });
});
