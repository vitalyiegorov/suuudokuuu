import { StyleSheet } from 'react-native-unistyles';

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

export const AppSettingsRowStyles = StyleSheet.create(theme => ({
    content: {
        flex: 1,
        gap: theme.spacing.xs,
        minWidth: 0
    },
    description: {
        fontSize: AppSettingsRowDescriptionFontSize,
        fontWeight: theme.typography.weight.regular,
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
        fontWeight: theme.typography.weight.bold,
        lineHeight: AppSettingsRowTitleLineHeight
    },
    trailing: {
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 0,
        justifyContent: 'center'
    }
}));
