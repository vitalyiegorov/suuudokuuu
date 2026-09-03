import { StyleSheet } from 'react-native-unistyles';

import {
    HintNarrationRoomyFontSizeConstant,
    HintNarrationRoomyLineHeightConstant,
    HintNarrationStandardFontSizeConstant,
    HintNarrationStandardLineHeightConstant,
    HintSurfaceRoomyGapConstant,
    HintSurfaceStandardGapConstant,
    HintTechniqueRoomyFontSizeConstant,
    HintTechniqueStandardFontSizeConstant,
    HintValueChipRoomySizeConstant,
    HintValueChipStandardSizeConstant
} from '../../constant/hint-surface.constant';

const standardTechniqueLetterSpacing = 0.6;
const roomyTechniqueLetterSpacing = 0.8;

export const HintStepNarrationStyles = StyleSheet.create(theme => ({
    container: (isRoomyLayout: boolean) => ({
        flex: 1,
        gap: isRoomyLayout ? HintSurfaceRoomyGapConstant : HintSurfaceStandardGapConstant,
        minHeight: 0
    }),
    header: (isRoomyLayout: boolean) => ({
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.md,
        height: isRoomyLayout ? HintValueChipRoomySizeConstant : HintValueChipStandardSizeConstant
    }),
    chip: (isRoomyLayout: boolean) => {
        const chipSize = isRoomyLayout ? HintValueChipRoomySizeConstant : HintValueChipStandardSizeConstant;

        return {
            alignItems: 'center',
            borderCurve: 'continuous',
            borderRadius: theme.radius.md,
            height: chipSize,
            justifyContent: 'center',
            width: chipSize
        };
    },
    chipText: (isRoomyLayout: boolean) => ({
        fontSize: isRoomyLayout ? theme.typography.size.xxl : theme.typography.size.xl,
        fontWeight: '900'
    }),
    technique: (isRoomyLayout: boolean) => ({
        flex: 1,
        fontSize: isRoomyLayout ? HintTechniqueRoomyFontSizeConstant : HintTechniqueStandardFontSizeConstant,
        fontWeight: '900',
        letterSpacing: isRoomyLayout ? roomyTechniqueLetterSpacing : standardTechniqueLetterSpacing,
        textAlign: 'left',
        textTransform: 'uppercase'
    }),
    narration: (isRoomyLayout: boolean) => {
        const lineHeight = isRoomyLayout ? HintNarrationRoomyLineHeightConstant : HintNarrationStandardLineHeightConstant;

        return {
            flex: 1,
            fontSize: isRoomyLayout ? HintNarrationRoomyFontSizeConstant : HintNarrationStandardFontSizeConstant,
            fontWeight: '600',
            lineHeight,
            minHeight: lineHeight,
            textAlign: 'left'
        };
    }
}));
