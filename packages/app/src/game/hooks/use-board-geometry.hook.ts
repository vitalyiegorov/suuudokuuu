import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { useState } from 'react';

import { isPositiveNumber } from '@rnw-community/shared';

import { useSettings } from '../../settings/query/use-settings.query';
import { gameGetBoardGeometry } from '../utils/game-get-board-geometry.util';

import type { BoardAreaGeometryInterface } from '../interface/board-area-geometry.interface';
import type { LayoutChangeEvent } from 'react-native';

let lastMeasuredBoardArea = { width: 0, height: 0 };

export const useBoardGeometry = (reservedHeight: number): BoardAreaGeometryInterface => {
    const { cellMargin } = useSettings();

    const [boardArea, setBoardArea] = useState(lastMeasuredBoardArea);

    const onBoardAreaLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;

        if (!isPositiveNumber(width) || !isPositiveNumber(height)) {
            return;
        }

        lastMeasuredBoardArea = { width, height };

        setBoardArea(lastMeasuredBoardArea);
    };

    const boardGeometry = gameGetBoardGeometry({
        availableWidth: boardArea.width,
        availableHeight: boardArea.height,
        reservedHeight,
        fieldSize: defaultSudokuConfig.fieldSize,
        fieldGroupSize: defaultSudokuConfig.fieldGroupHeight,
        cellMargin
    });

    return { ...boardGeometry, onBoardAreaLayout };
};
