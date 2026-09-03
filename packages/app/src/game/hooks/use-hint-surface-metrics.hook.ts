import { useState } from 'react';

import { gameGetHintSurfaceMetrics } from '../utils/game-get-hint-surface-metrics.util';

import type { HintSurfaceLayoutInterface } from '../interface/hint-surface-layout.interface';
import type { LayoutChangeEvent } from 'react-native';

export const useHintSurfaceMetrics = (isWideLayout: boolean, screenWidth: number): HintSurfaceLayoutInterface => {
    const [toolsSlotHeight, setToolsSlotHeight] = useState(0);

    const onToolsSlotLayout = (event: LayoutChangeEvent) => {
        setToolsSlotHeight(event.nativeEvent.layout.height);
    };

    return {
        hintSurfaceMetrics: gameGetHintSurfaceMetrics({ isWideLayout, screenWidth, toolsSlotHeight }),
        onToolsSlotLayout
    };
};
