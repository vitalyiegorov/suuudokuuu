import { ReturnableScreenHeaderHeight } from '../../returnable-screen-header/constant/returnable-screen-header.constant';

const ReturnableScreenChromeBottomContentInsetExtra = 8;
const ReturnableScreenChromeCompactBottomContentInset = 40;
const ReturnableScreenChromeCompactTopContentInsetExtra = 8;
const ReturnableScreenChromeTopContentInsetExtra = 36;

export const ReturnableScreenChromeCompactBottomContentPreset = 'compact';
export const ReturnableScreenChromeFullBottomContentPreset = 'full';
export const ReturnableScreenChromeCompactContentPreset = 'compact';
export const ReturnableScreenChromeRegularContentPreset = 'regular';
export type ReturnableScreenChromeBottomContentPreset =
    typeof ReturnableScreenChromeCompactBottomContentPreset | typeof ReturnableScreenChromeFullBottomContentPreset;
export type ReturnableScreenChromeContentPreset =
    typeof ReturnableScreenChromeCompactContentPreset | typeof ReturnableScreenChromeRegularContentPreset;

export const ReturnableScreenChromeBottomOverlayHeight = 96;
export const ReturnableScreenChromeBottomContentInset =
    ReturnableScreenChromeBottomOverlayHeight + ReturnableScreenChromeBottomContentInsetExtra;
export const ReturnableScreenChromeBottomBlurIntensity = 70;
export const ReturnableScreenChromeTopContentInset = ReturnableScreenHeaderHeight + ReturnableScreenChromeTopContentInsetExtra;
const ReturnableScreenChromeCompactTopContentInset = ReturnableScreenHeaderHeight + ReturnableScreenChromeCompactTopContentInsetExtra;
export const ReturnableScreenChromeBottomContentInsetByPreset: Record<ReturnableScreenChromeBottomContentPreset, number> = {
    [ReturnableScreenChromeCompactBottomContentPreset]: ReturnableScreenChromeCompactBottomContentInset,
    [ReturnableScreenChromeFullBottomContentPreset]: ReturnableScreenChromeBottomContentInset
};
export const ReturnableScreenChromeTopContentInsetByPreset: Record<ReturnableScreenChromeContentPreset, number> = {
    [ReturnableScreenChromeCompactContentPreset]: ReturnableScreenChromeCompactTopContentInset,
    [ReturnableScreenChromeRegularContentPreset]: ReturnableScreenChromeTopContentInset
};
export const ReturnableScreenChromeScrollEventThrottle = 16;
