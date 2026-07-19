import { StyleSheet } from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';

import { isDefined, isNumber } from '@rnw-community/shared';

import type { StyleProp, ViewStyle } from 'react-native';

export const mergeScrollContentInset = (
    insets: EdgeInsets,
    contentInsetTop: number,
    contentInsetBottom: number,
    contentContainerStyle: StyleProp<ViewStyle>
): ViewStyle => {
    const flattenedContentContainerStyle = StyleSheet.flatten(contentContainerStyle);
    const consumerPaddingTop =
        isDefined(flattenedContentContainerStyle) && isNumber(flattenedContentContainerStyle.paddingTop)
            ? flattenedContentContainerStyle.paddingTop
            : 0;
    const consumerPaddingBottom =
        isDefined(flattenedContentContainerStyle) && isNumber(flattenedContentContainerStyle.paddingBottom)
            ? flattenedContentContainerStyle.paddingBottom
            : 0;

    return {
        ...flattenedContentContainerStyle,
        paddingTop: insets.top + contentInsetTop + consumerPaddingTop,
        paddingBottom: insets.bottom + contentInsetBottom + consumerPaddingBottom
    };
};
