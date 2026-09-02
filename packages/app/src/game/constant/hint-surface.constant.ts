import { SpacingConstant } from '@suuudokuuu/ui/theme';

export const HintNarrationLineCountConstant = 3;
export const HintNarrationNarrowLineHeightConstant = 22;
export const HintNarrationWideLineHeightConstant = 26;
export const HintValueChipNarrowSizeConstant = 48;
export const HintValueChipWideSizeConstant = 56;
export const HintControlRowHeightConstant = 44;
export const HintTechniqueNarrowFontSizeConstant = 13;
export const HintTechniqueWideFontSizeConstant = 15;

export const HintSurfaceNarrowPaddingConstant = SpacingConstant.md;
export const HintSurfaceNarrowGapConstant = SpacingConstant.sm;
export const HintSurfaceWidePaddingConstant = SpacingConstant.lg;
export const HintSurfaceWideGapConstant = SpacingConstant.md;

const surfaceRowGapCount = 2;

export const HintSurfaceNarrowFixedHeightConstant =
    HintSurfaceNarrowPaddingConstant * 2 +
    HintValueChipNarrowSizeConstant +
    HintSurfaceNarrowGapConstant * surfaceRowGapCount +
    HintControlRowHeightConstant;

export const HintSurfaceNarrowHeightConstant =
    HintSurfaceNarrowFixedHeightConstant + HintNarrationLineCountConstant * HintNarrationNarrowLineHeightConstant;

export const HintSurfaceNarrowMinHeightConstant = HintSurfaceNarrowFixedHeightConstant + HintNarrationNarrowLineHeightConstant;

export const HintSurfaceWideHeightConstant =
    HintSurfaceWidePaddingConstant * 2 +
    HintValueChipWideSizeConstant +
    HintSurfaceWideGapConstant * surfaceRowGapCount +
    HintNarrationLineCountConstant * HintNarrationWideLineHeightConstant +
    HintControlRowHeightConstant;
