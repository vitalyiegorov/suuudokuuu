import { SpacingConstant } from '@suuudokuuu/ui/theme';

import {
    HintNarrationLineCountConstant,
    HintNarrationRoomyLineHeightConstant,
    HintNarrationStandardLineHeightConstant,
    HintSurfaceMaxHeightConstant,
    HintSurfaceMinHeightConstant,
    HintSurfaceRoomyFixedHeightConstant,
    HintSurfaceRoomyHeightConstant,
    HintSurfaceStandardFixedHeightConstant
} from '../constant/hint-surface.constant';

import { gameGetNumpadHeight } from './game-get-numpad-height.util';

import type { HintSurfaceMetricsInterface } from '../interface/hint-surface-metrics.interface';

interface OptionsInterface {
    readonly isWideLayout: boolean;
    readonly screenWidth: number;
    readonly toolsSlotHeight: number;
}

export const gameGetHintSurfaceMetrics = ({
    isWideLayout,
    screenWidth,
    toolsSlotHeight
}: OptionsInterface): HintSurfaceMetricsInterface => {
    if (isWideLayout) {
        return { height: HintSurfaceRoomyHeightConstant, isRoomyLayout: true, narrationLineCount: HintNarrationLineCountConstant };
    }

    const regionHeight = toolsSlotHeight + SpacingConstant.sm + gameGetNumpadHeight(screenWidth);
    const height = Math.floor(Math.min(HintSurfaceMaxHeightConstant, Math.max(HintSurfaceMinHeightConstant, regionHeight)));
    const isRoomyLayout = height >= HintSurfaceRoomyHeightConstant;
    const fixedHeight = isRoomyLayout ? HintSurfaceRoomyFixedHeightConstant : HintSurfaceStandardFixedHeightConstant;
    const lineHeight = isRoomyLayout ? HintNarrationRoomyLineHeightConstant : HintNarrationStandardLineHeightConstant;
    const narrationLineCount = Math.min(HintNarrationLineCountConstant, Math.floor((height - fixedHeight) / lineHeight));

    return { height, isRoomyLayout, narrationLineCount };
};
