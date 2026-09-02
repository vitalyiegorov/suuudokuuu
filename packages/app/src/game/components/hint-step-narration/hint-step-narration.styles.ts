import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

const narrowChipSize = 38;
const wideChipSize = 48;
const narrowChipFontSize = 20;
const wideChipFontSize = 24;
const narrowTechniqueFontSize = 11;
const wideTechniqueFontSize = 13;
const narrowTechniqueLetterSpacing = 0.4;
const wideTechniqueLetterSpacing = 0.6;
const narrowNarrationFontSize = 13;
const wideNarrationFontSize = 16;
const wideNarrationLineHeight = 22;

export const HintStepNarrationStyles = StyleSheet.create((theme, rt) => {
    const isWideLayout = appLayoutScreenIsWide(rt.screen);
    const chipSize = isWideLayout ? wideChipSize : narrowChipSize;

    return {
        container: {
            flex: 1,
            gap: isWideLayout ? theme.spacing.xs : theme.spacing.xs / 2
        },
        row: {
            alignItems: 'center',
            flexDirection: 'row',
            gap: theme.spacing.sm
        },
        chip: {
            alignItems: 'center',
            borderCurve: 'continuous',
            borderRadius: isWideLayout ? theme.radius.md : theme.radius.sm,
            height: chipSize,
            justifyContent: 'center',
            width: chipSize
        },
        chipText: {
            fontSize: isWideLayout ? wideChipFontSize : narrowChipFontSize,
            fontWeight: '900'
        },
        technique: {
            fontSize: isWideLayout ? wideTechniqueFontSize : narrowTechniqueFontSize,
            fontWeight: '900',
            letterSpacing: isWideLayout ? wideTechniqueLetterSpacing : narrowTechniqueLetterSpacing,
            textAlign: 'left',
            textTransform: 'uppercase'
        },
        narration: {
            flex: 1,
            fontSize: isWideLayout ? wideNarrationFontSize : narrowNarrationFontSize,
            fontWeight: '600',
            textAlign: 'left',
            ...(isWideLayout && { lineHeight: wideNarrationLineHeight })
        }
    };
});
