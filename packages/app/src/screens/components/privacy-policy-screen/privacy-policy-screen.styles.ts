import { StyleSheet } from 'react-native-unistyles';

import { PageHorizontalPaddingConstant } from '../../../@generic/constants/page-horizontal-padding.constant';
import { pageColumnScrollViewStyle } from '../../utils/page-column-screen-styles.util';

export const PrivacyPolicyScreenStyles = StyleSheet.create(theme => ({
    content: {
        alignItems: 'center',
        paddingHorizontal: PageHorizontalPaddingConstant
    },
    scrollView: pageColumnScrollViewStyle(theme)
}));
