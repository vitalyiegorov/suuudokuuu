import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

const CompactStripHeight = 52;
const CompactStripPaddingVertical = 4;
const WideStripMinHeight = 0;
const WideStripPaddingVertical = 0;
const CompactStripMaxScreenWidth = 360;
const CompactLabelFontSize = 9;
const CompactLabelLetterSpacing = 0.4;
const CompactLabelLineHeight = 11;
const CompactItemPaddingHorizontal = 5;
const CompactValueFontSize = 14;
const CompactValueLineHeight = 17;
const LabelFontSize = 10;
const LabelLetterSpacing = 0.9;
const LabelLineHeight = 12;
const ValueFontSize = 16;
const ValueLineHeight = 20;

export const GameScreenMetricsStyles = StyleSheet.create((_theme, rt) => {
    const isCompactStrip = !appLayoutScreenIsWide(rt.screen) && rt.screen.width <= CompactStripMaxScreenWidth;

    return {
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
            paddingHorizontal: isCompactStrip ? CompactItemPaddingHorizontal : 7,
            width: 'auto'
        },
        label: {
            fontSize: isCompactStrip ? CompactLabelFontSize : LabelFontSize,
            letterSpacing: isCompactStrip ? CompactLabelLetterSpacing : LabelLetterSpacing,
            lineHeight: isCompactStrip ? CompactLabelLineHeight : LabelLineHeight,
            opacity: 0.55,
            textTransform: 'uppercase'
        },
        separator: {
            height: 28,
            marginHorizontal: 0
        },
        value: {
            fontSize: isCompactStrip ? CompactValueFontSize : ValueFontSize,
            fontVariant: ['tabular-nums'],
            fontWeight: '800',
            letterSpacing: -0.2,
            lineHeight: isCompactStrip ? CompactValueLineHeight : ValueLineHeight
        }
    };
});
