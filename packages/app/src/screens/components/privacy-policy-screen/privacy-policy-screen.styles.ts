import { StyleSheet } from 'react-native-unistyles';

import { pageColumnScrollViewStyle } from '../../utils/page-column-screen-styles.util';

export const PrivacyPolicyScreenStyles = StyleSheet.create(theme => ({
    content: {
        alignItems: 'center',
        paddingHorizontal: 20
    },
    scrollView: pageColumnScrollViewStyle(theme)
}));
