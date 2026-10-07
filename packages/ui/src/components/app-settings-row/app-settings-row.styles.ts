import { StyleSheet } from 'react-native-unistyles';

import {
    AppSettingsRowContentGap,
    AppSettingsRowDescriptionFontSize,
    AppSettingsRowDescriptionLineHeight,
    AppSettingsRowGap,
    AppSettingsRowLeadingPadding,
    AppSettingsRowMinHeight,
    AppSettingsRowTitleFontSize,
    AppSettingsRowTitleLetterSpacing,
    AppSettingsRowTitleLineHeight,
    AppSettingsRowTrailingPadding,
    AppSettingsRowVerticalPadding
} from './constant/app-settings-row-size.constant';

export const AppSettingsRowStyles = StyleSheet.create(theme => ({
    content: {
        flex: 1,
        gap: AppSettingsRowContentGap,
        minWidth: 0
    },
    description: {
        fontFamily: theme.typography.fontFamily,
        fontSize: AppSettingsRowDescriptionFontSize,
        lineHeight: AppSettingsRowDescriptionLineHeight
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: AppSettingsRowGap,
        justifyContent: 'space-between',
        minHeight: AppSettingsRowMinHeight,
        paddingStart: AppSettingsRowLeadingPadding,
        paddingEnd: AppSettingsRowTrailingPadding,
        paddingVertical: AppSettingsRowVerticalPadding,
        width: '100%'
    },
    title: {
        fontFamily: theme.typography.fontFamily,
        fontSize: AppSettingsRowTitleFontSize,
        letterSpacing: AppSettingsRowTitleLetterSpacing,
        lineHeight: AppSettingsRowTitleLineHeight
    },
    trailing: {
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 0,
        justifyContent: 'center'
    }
}));
