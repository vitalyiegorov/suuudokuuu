import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

const narrowChipSize = 38;
const wideChipSize = 48;
const narrowTechniqueFontSize = 11;
const narrowTechniqueLetterSpacing = 0.4;
const wideTechniqueLetterSpacing = 0.6;

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
            fontSize: isWideLayout ? theme.typography.size.xl : theme.typography.size.lg,
            fontWeight: '900'
        },
        technique: {
            fontSize: isWideLayout ? 13 : narrowTechniqueFontSize,
            fontWeight: '900',
            letterSpacing: isWideLayout ? wideTechniqueLetterSpacing : narrowTechniqueLetterSpacing,
            textAlign: 'left',
            textTransform: 'uppercase'
        },
        narration: {
            flex: 1,
            fontSize: isWideLayout ? theme.typography.size.md : 13,
            fontWeight: '600',
            textAlign: 'left',
            ...(isWideLayout && { lineHeight: 22 })
        }
    };
});
