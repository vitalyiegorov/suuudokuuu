import { StyleSheet } from 'react-native-unistyles';

import { WideLayoutMediaQuery } from '../../../../@generic/constants/layout-media-query.constant';

const CompactStripHeight = 52;
const CompactStripPaddingVertical = 4;
const WideStripMinHeight = 0;
const WideStripPaddingVertical = 0;

export const GameScreenMetricsStyles = StyleSheet.create(() => ({
    container: {
        alignSelf: { xs: 'flex-start', [WideLayoutMediaQuery]: 'stretch' },
        flexGrow: { xs: 0, [WideLayoutMediaQuery]: 1 },
        justifyContent: { xs: 'flex-start', [WideLayoutMediaQuery]: 'space-between' },
        minHeight: { xs: CompactStripHeight, [WideLayoutMediaQuery]: WideStripMinHeight },
        paddingHorizontal: 0,
        paddingVertical: { xs: CompactStripPaddingVertical, [WideLayoutMediaQuery]: WideStripPaddingVertical }
    },
    item: {
        gap: 3,
        paddingHorizontal: 7,
        width: 'auto'
    },
    label: {
        fontSize: 10,
        letterSpacing: 0.9,
        lineHeight: 12,
        opacity: 0.55,
        textTransform: 'uppercase'
    },
    separator: {
        height: 28,
        marginHorizontal: 0
    },
    value: {
        fontSize: 16,
        fontVariant: ['tabular-nums'],
        fontWeight: '800',
        letterSpacing: -0.2,
        lineHeight: 20
    }
}));
