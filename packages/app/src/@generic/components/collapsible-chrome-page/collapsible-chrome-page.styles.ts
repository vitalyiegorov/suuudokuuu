import { StyleSheet } from 'react-native';

import { AppScreenChromeLayoutConfig } from '../../constants/screen-chrome-config.constant';

const CollapsibleHeaderRowHorizontalPadding = 16;
const CollapsibleHeaderSlotWidth = 44;

const contentCapWidth = AppScreenChromeLayoutConfig.contentMaxWidth + AppScreenChromeLayoutConfig.contentHorizontalPadding * 2;
const rowGutter = AppScreenChromeLayoutConfig.contentHorizontalPadding - CollapsibleHeaderRowHorizontalPadding;
const titleGutter = AppScreenChromeLayoutConfig.contentHorizontalPadding + CollapsibleHeaderSlotWidth;
const cappedHeaderLayer = {
    marginHorizontal: 'auto',
    maxWidth: contentCapWidth,
    paddingTop: AppScreenChromeLayoutConfig.headerTopInset,
    width: '100%'
} as const;

export const CollapsibleChromePageStyles = StyleSheet.create({
    content: {
        flex: 1,
        width: '100%'
    },
    expandedTitleLayer: {
        ...cappedHeaderLayer,
        alignItems: 'flex-start',
        paddingHorizontal: titleGutter
    },
    frame: {
        flex: 1
    },
    largeTitle: {
        fontSize: 31,
        marginBottom: 0,
        textAlign: 'left',
        transform: [{ translateY: 2 }]
    },
    persistentLayer: {
        ...cappedHeaderLayer,
        paddingHorizontal: rowGutter
    },
    smallTitle: {
        fontSize: 17,
        marginBottom: 0,
        transform: [{ translateY: 3 }]
    },
    titleLayer: {
        paddingTop: AppScreenChromeLayoutConfig.headerTopInset
    }
});
