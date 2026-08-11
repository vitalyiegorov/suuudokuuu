import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

const CompactStripHeight = 52;
const CompactStripPaddingVertical = 4;
const WideStripMinHeight = 0;
const WideStripPaddingVertical = 0;

export const GameScreenMetricsStyles = StyleSheet.create((_theme, rt) => ({
    container: {
        alignSelf: appLayoutScreenIsWide(rt.screen) ? 'stretch' : 'flex-start',
        flexGrow: appLayoutScreenIsWide(rt.screen) ? 1 : 0,
        justifyContent: appLayoutScreenIsWide(rt.screen) ? 'space-between' : 'flex-start',
        minHeight: appLayoutScreenIsWide(rt.screen) ? WideStripMinHeight : CompactStripHeight,
        paddingHorizontal: 0,
        paddingVertical: appLayoutScreenIsWide(rt.screen) ? WideStripPaddingVertical : CompactStripPaddingVertical
    },
    item: {
        gap: 3,
        minWidth: 0,
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
