import { StyleSheet } from 'react-native-unistyles';

import { PageHorizontalPaddingConstant } from '../../../@generic/constants/page-horizontal-padding.constant';
import { pageColumnScrollViewStyle } from '../../utils/page-column-screen-styles.util';

export const BetaScreenStyles = StyleSheet.create(theme => ({
    content: {
        alignItems: 'center',
        paddingHorizontal: PageHorizontalPaddingConstant
    },
    readyContent: {
        gap: 20,
        width: '100%'
    },
    scrollContent: {
        gap: 20,
        paddingBottom: 32,
        width: '100%'
    },
    scrollView: pageColumnScrollViewStyle(theme)
}));
