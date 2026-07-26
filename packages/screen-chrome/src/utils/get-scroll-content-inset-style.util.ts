import { EdgeInsets } from 'react-native-safe-area-context';

import { readStyleNumber } from './read-style-number.util';

import type { StyleProp, ViewStyle } from 'react-native';

export const getScrollContentInsetStyle = (
    insets: EdgeInsets,
    contentInsetTop: number,
    contentInsetBottom: number,
    contentContainerStyle: StyleProp<ViewStyle>
): ViewStyle => ({
    paddingBottom: insets.bottom + contentInsetBottom + readStyleNumber(contentContainerStyle, 'paddingBottom'),
    paddingTop: insets.top + contentInsetTop + readStyleNumber(contentContainerStyle, 'paddingTop')
});
