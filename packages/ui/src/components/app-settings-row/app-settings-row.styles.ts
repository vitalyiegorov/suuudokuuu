import { StyleSheet } from 'react-native';

import {
    AppSettingsRowBorderRadius,
    AppSettingsRowDescriptionFontSize,
    AppSettingsRowDescriptionLineHeight,
    AppSettingsRowGap,
    AppSettingsRowHorizontalPadding,
    AppSettingsRowMinHeight,
    AppSettingsRowTitleFontSize,
    AppSettingsRowTitleLineHeight,
    AppSettingsRowVerticalPadding
} from './constant/app-settings-row-size.constant';

export const AppSettingsRowStyles = StyleSheet.create({
    content: {
        flex: 1,
        gap: 4,
        minWidth: 0
    },
    description: {
        fontSize: AppSettingsRowDescriptionFontSize,
        fontWeight: '700',
        lineHeight: AppSettingsRowDescriptionLineHeight
    },
    row: {
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: AppSettingsRowBorderRadius,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        gap: AppSettingsRowGap,
        justifyContent: 'space-between',
        minHeight: AppSettingsRowMinHeight,
        paddingHorizontal: AppSettingsRowHorizontalPadding,
        paddingVertical: AppSettingsRowVerticalPadding,
        width: '100%'
    },
    title: {
        fontSize: AppSettingsRowTitleFontSize,
        fontWeight: '900',
        lineHeight: AppSettingsRowTitleLineHeight
    },
    trailing: {
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 0,
        justifyContent: 'center'
    }
});
