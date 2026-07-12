import {
    SettingsOptionSheetBaseContentHeight,
    SettingsOptionSheetCompactMaxOptionCount,
    SettingsOptionSheetDetentPrecision,
    SettingsOptionSheetExpandedDetent,
    SettingsOptionSheetMaxInitialDetent,
    SettingsOptionSheetMinInitialDetent,
    SettingsOptionSheetMinimumScreenHeight,
    SettingsOptionSheetRowMinHeight
} from '../constant/settings-option-sheet-layout.constant';

export const settingsOptionSheetGetAllowedDetents = (optionCount: number, screenHeight: number) => {
    const contentHeight = SettingsOptionSheetBaseContentHeight + SettingsOptionSheetRowMinHeight * optionCount;
    const measuredScreenHeight = Math.max(screenHeight, SettingsOptionSheetMinimumScreenHeight);
    const unclampedDetent = contentHeight / measuredScreenHeight;
    const boundedDetent = Math.min(Math.max(unclampedDetent, SettingsOptionSheetMinInitialDetent), SettingsOptionSheetMaxInitialDetent);
    const initialDetent = Math.ceil(boundedDetent * SettingsOptionSheetDetentPrecision) / SettingsOptionSheetDetentPrecision;

    if (optionCount <= SettingsOptionSheetCompactMaxOptionCount) {
        return [initialDetent];
    }

    return [initialDetent, SettingsOptionSheetExpandedDetent];
};
