import { StyleSheet } from 'react-native-unistyles';

import { pageColumnScrollViewStyle } from '../../utils/page-column-screen-styles.util';

export const SettingsScreenStyles = StyleSheet.create(theme => ({
    scrollView: pageColumnScrollViewStyle(theme),
    scrollViewContent: {
        alignItems: 'stretch',
        flexDirection: 'column',
        gap: theme.spacing.lg,
        paddingBottom: theme.spacing.sm
    },
    primaryColumn: {
        gap: theme.spacing.lg,
        width: '100%'
    },
    secondaryColumn: {
        gap: theme.spacing.lg,
        width: '100%'
    }
}));
