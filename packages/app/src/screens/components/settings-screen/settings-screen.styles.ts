import { StyleSheet } from 'react-native-unistyles';

import { pageColumnScrollViewStyle } from '../../utils/page-column-screen-styles.util';

export const SettingsScreenStyles = StyleSheet.create(theme => ({
    content: {
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl
    },
    scrollView: pageColumnScrollViewStyle(theme),
    scrollViewContent: {
        alignItems: 'stretch',
        flexDirection: 'column',
        gap: theme.spacing.xl,
        paddingBottom: theme.spacing.sm
    },
    primaryColumn: {
        gap: theme.spacing.xl,
        width: '100%'
    },
    secondaryColumn: {
        gap: theme.spacing.xl,
        width: '100%'
    }
}));
