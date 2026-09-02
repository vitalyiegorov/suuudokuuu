import { SpacingConstant } from '@suuudokuuu/ui/theme';

export const HintNarrationLineCountConstant = 3;
export const HintControlRowHeightConstant = 44;

export const HintSurfaceStandardPaddingConstant = SpacingConstant.md;
export const HintSurfaceStandardGapConstant = SpacingConstant.sm;
export const HintNarrationStandardFontSizeConstant = 16;
export const HintNarrationStandardLineHeightConstant = 22;
export const HintTechniqueStandardFontSizeConstant = 13;
export const HintValueChipStandardSizeConstant = 48;

export const HintSurfaceRoomyPaddingConstant = SpacingConstant.lg;
export const HintSurfaceRoomyGapConstant = SpacingConstant.md;
export const HintNarrationRoomyFontSizeConstant = 18;
export const HintNarrationRoomyLineHeightConstant = 26;
export const HintTechniqueRoomyFontSizeConstant = 15;
export const HintValueChipRoomySizeConstant = 56;

const surfaceRowGapCount = 2;

export const HintSurfaceStandardFixedHeightConstant =
    HintSurfaceStandardPaddingConstant * 2 +
    HintValueChipStandardSizeConstant +
    HintSurfaceStandardGapConstant * surfaceRowGapCount +
    HintControlRowHeightConstant;

export const HintSurfaceRoomyFixedHeightConstant =
    HintSurfaceRoomyPaddingConstant * 2 +
    HintValueChipRoomySizeConstant +
    HintSurfaceRoomyGapConstant * surfaceRowGapCount +
    HintControlRowHeightConstant;

export const HintSurfaceMinHeightConstant = HintSurfaceStandardFixedHeightConstant + HintNarrationStandardLineHeightConstant;

export const HintSurfaceStandardHeightConstant =
    HintSurfaceStandardFixedHeightConstant + HintNarrationLineCountConstant * HintNarrationStandardLineHeightConstant;

export const HintSurfaceRoomyHeightConstant =
    HintSurfaceRoomyFixedHeightConstant + HintNarrationLineCountConstant * HintNarrationRoomyLineHeightConstant;

export const HintSurfaceMaxHeightConstant = HintSurfaceRoomyHeightConstant + HintNarrationRoomyLineHeightConstant;
