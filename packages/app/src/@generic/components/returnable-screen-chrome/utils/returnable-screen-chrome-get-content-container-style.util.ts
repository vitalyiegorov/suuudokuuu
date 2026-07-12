import { StyleSheet } from 'react-native';

import { isNumber } from '@rnw-community/shared';

import {
    ReturnableScreenChromeBottomContentInset,
    ReturnableScreenChromeTopContentInset
} from '../constant/returnable-screen-chrome.constant';

import type { StyleProp, ViewStyle } from 'react-native';

interface ReturnableScreenChromeContentContainerStyleOptionsInterface {
    readonly bottomContentInset?: number;
    readonly bottomInset: number;
    readonly contentContainerStyle?: StyleProp<ViewStyle>;
    readonly topContentInset?: number;
    readonly topInset: number;
}

export const returnableScreenChromeGetContentContainerStyle = ({
    bottomContentInset = ReturnableScreenChromeBottomContentInset,
    bottomInset,
    contentContainerStyle = {},
    topContentInset = ReturnableScreenChromeTopContentInset,
    topInset
}: ReturnableScreenChromeContentContainerStyleOptionsInterface) => {
    const flattenedContentContainerStyle = StyleSheet.flatten(contentContainerStyle);
    const customPaddingBottom = flattenedContentContainerStyle.paddingBottom;
    const extraPaddingBottom = isNumber(customPaddingBottom) ? customPaddingBottom : 0;

    return [
        { paddingTop: topInset + topContentInset },
        contentContainerStyle,
        { paddingBottom: bottomInset + bottomContentInset + extraPaddingBottom }
    ];
};
