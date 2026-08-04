import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { useState } from 'react';

import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { settingsCellMarginSelector } from '../../settings/store/settings.selectors';
import { gameGetBoardGeometry } from '../utils/game-get-board-geometry.util';

import type { BoardAreaGeometryInterface } from '../interface/board-area-geometry.interface';
import type { LayoutChangeEvent } from 'react-native';

const initialBoardArea = { width: 0, height: 0 };

export const useBoardGeometry = (reservedHeight: number): BoardAreaGeometryInterface => {
    const cellMargin = useAppSelector(settingsCellMarginSelector);

    const [boardArea, setBoardArea] = useState(initialBoardArea);

    const onBoardAreaLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;

        setBoardArea({ width, height });
    };

    const { cellSize, boardSize } = gameGetBoardGeometry({
        availableWidth: boardArea.width,
        availableHeight: boardArea.height,
        reservedHeight,
        fieldSize: defaultSudokuConfig.fieldSize,
        fieldGroupSize: defaultSudokuConfig.fieldGroupHeight,
        cellMargin
    });

    return { cellSize, boardSize, onBoardAreaLayout };
};
