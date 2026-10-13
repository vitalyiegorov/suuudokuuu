const SettingsOptionSheetBaseContentHeight = 147;
const SettingsOptionSheetCompactMaxOptionCount = 4;
const SettingsOptionSheetDetentPrecision = 100;
const SettingsOptionSheetExpandedDetent = 0.88;
const SettingsOptionSheetMaxInitialDetent = 0.64;
const SettingsOptionSheetMinInitialDetent = 0.32;
const SettingsOptionSheetMinimumScreenHeight = 1;
const SettingsOptionSheetRowMinHeight = 68;

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
