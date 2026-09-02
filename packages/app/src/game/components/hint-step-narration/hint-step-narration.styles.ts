import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import {
    HintNarrationNarrowLineHeightConstant,
    HintNarrationWideLineHeightConstant,
    HintSurfaceNarrowGapConstant,
    HintSurfaceWideGapConstant,
    HintTechniqueNarrowFontSizeConstant,
    HintTechniqueWideFontSizeConstant,
    HintValueChipNarrowSizeConstant,
    HintValueChipWideSizeConstant
} from '../../constant/hint-surface.constant';

const narrowTechniqueLetterSpacing = 0.6;
const wideTechniqueLetterSpacing = 0.8;
const narrowNarrationFontSize = 16;
const wideNarrationFontSize = 18;

export const HintStepNarrationStyles = StyleSheet.create((theme, rt) => {
    const isWideLayout = appLayoutScreenIsWide(rt.screen);
    const chipSize = isWideLayout ? HintValueChipWideSizeConstant : HintValueChipNarrowSizeConstant;
    const lineHeight = isWideLayout ? HintNarrationWideLineHeightConstant : HintNarrationNarrowLineHeightConstant;

    return {
        container: {
            flex: 1,
            gap: isWideLayout ? HintSurfaceWideGapConstant : HintSurfaceNarrowGapConstant,
            minHeight: 0
        },
        header: {
            alignItems: 'center',
            flexDirection: 'row',
            gap: theme.spacing.md,
            height: chipSize
        },
        chip: {
            alignItems: 'center',
            borderCurve: 'continuous',
            borderRadius: theme.radius.md,
            height: chipSize,
            justifyContent: 'center',
            width: chipSize
        },
        chipText: {
            fontSize: isWideLayout ? theme.typography.size.xxl : theme.typography.size.xl,
            fontWeight: '900'
        },
        technique: {
            flex: 1,
            fontSize: isWideLayout ? HintTechniqueWideFontSizeConstant : HintTechniqueNarrowFontSizeConstant,
            fontWeight: '900',
            letterSpacing: isWideLayout ? wideTechniqueLetterSpacing : narrowTechniqueLetterSpacing,
            textAlign: 'left',
            textTransform: 'uppercase'
        },
        narration: {
            flex: 1,
            fontSize: isWideLayout ? wideNarrationFontSize : narrowNarrationFontSize,
            fontWeight: '600',
            lineHeight,
            minHeight: lineHeight,
            textAlign: 'left'
        }
    };
});
