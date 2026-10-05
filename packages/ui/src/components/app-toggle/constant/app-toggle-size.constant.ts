export const AppToggleTrackWidth = 52;
export const AppToggleTrackHeight = 32;
export const AppToggleKnobSize = 24;
export const AppToggleKnobInset = 4;
export const AppToggleOffKnobScale = 20 / AppToggleKnobSize;
export const AppToggleKnobTravel = AppToggleTrackWidth - AppToggleKnobSize - AppToggleKnobInset * 2;
const AppToggleMinimumTouchTarget = 44;
export const AppToggleHitSlop = (AppToggleMinimumTouchTarget - AppToggleTrackHeight) / 2;
