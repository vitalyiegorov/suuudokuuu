import { StyleSheet } from 'react-native';

import { AppScreenChromeLayoutConfig } from '../../constants/screen-chrome-config.constant';

const contentCapWidth = AppScreenChromeLayoutConfig.contentMaxWidth + AppScreenChromeLayoutConfig.contentHorizontalPadding * 2;

export const CollapsibleChromePageStyles = StyleSheet.create({
    expandedTitleLayer: {
        alignItems: 'flex-start',
        paddingTop: AppScreenChromeLayoutConfig.headerTopInset,
        alignSelf: 'center',
        maxWidth: contentCapWidth,
        paddingHorizontal: AppScreenChromeLayoutConfig.contentHorizontalPadding,
        width: '100%'
    },
    largeTitle: {
        fontSize: 31,
        marginBottom: 0,
        textAlign: 'left',
        transform: [{ translateY: 2 }]
    },
    persistentLayer: {
        alignSelf: 'center',
        maxWidth: contentCapWidth,
        paddingTop: AppScreenChromeLayoutConfig.headerTopInset,
        width: '100%'
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
