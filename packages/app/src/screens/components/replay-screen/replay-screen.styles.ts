import { StyleSheet } from 'react-native-unistyles';

import { WideLayoutMediaQuery } from '../../../@generic/constants/layout-media-query.constant';
import { WideContentWidthMultiplierConstant } from '../../constant/wide-content-width.constant';

export const ReplayScreenStyles = StyleSheet.create(theme => ({
    container: {
        alignSelf: 'center',
        flex: 1,
        flexDirection: 'column',
        gap: 18,
        maxWidth: {
            xs: theme.contentWidth.standard,
            [WideLayoutMediaQuery]: theme.contentWidth.standard * WideContentWidthMultiplierConstant
        },
        paddingBottom: 18,
        paddingHorizontal: 20,
        paddingTop: 18,
        width: '100%'
    },
    content: {
        flex: 1,
        flexDirection: { xs: 'column', [WideLayoutMediaQuery]: 'row' },
        gap: 18
    },
    fieldWrapper: {
        alignItems: 'center',
        flexGrow: 1,
        flexShrink: 1,
        justifyContent: 'center',
        minHeight: 0,
        minWidth: 0
    },
    controlsColumn: {
        flexGrow: { xs: 0, [WideLayoutMediaQuery]: 1 },
        flexShrink: 0,
        gap: 18,
        justifyContent: 'center'
    }
}));
