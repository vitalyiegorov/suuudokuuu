import { SpacingConstant } from '@suuudokuuu/ui/theme';

import {
    HintNarrationLineCountConstant,
    HintNarrationNarrowLineHeightConstant,
    HintSurfaceNarrowFixedHeightConstant,
    HintSurfaceNarrowHeightConstant,
    HintSurfaceNarrowMinHeightConstant,
    HintSurfaceWideHeightConstant
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
        return { height: HintSurfaceWideHeightConstant, narrationLineCount: HintNarrationLineCountConstant };
    }

    const availableHeight = toolsSlotHeight + SpacingConstant.sm + gameGetNumpadHeight(screenWidth);
    const height = Math.floor(Math.min(HintSurfaceNarrowHeightConstant, Math.max(HintSurfaceNarrowMinHeightConstant, availableHeight)));
    const narrationLineCount = Math.floor((height - HintSurfaceNarrowFixedHeightConstant) / HintNarrationNarrowLineHeightConstant);

    return { height, narrationLineCount };
};
