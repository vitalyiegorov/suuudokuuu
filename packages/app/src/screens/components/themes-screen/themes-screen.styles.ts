import { StyleSheet } from 'react-native-unistyles';

import { pageColumnScrollViewStyle } from '../../utils/page-column-screen-styles.util';

export const ThemesScreenStyles = StyleSheet.create(theme => ({
    footer: { paddingHorizontal: 16, paddingTop: 12 },
    scrollContent: { gap: 16, paddingVertical: 16 },
    scrollView: pageColumnScrollViewStyle(theme)
}));
