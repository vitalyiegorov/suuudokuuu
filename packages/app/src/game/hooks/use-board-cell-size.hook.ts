import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { useState } from 'react';

import { gameGetBoardCellSize } from '../utils/game-get-board-cell-size.util';

import type { BoardCellSizeInterface } from '../interface/board-cell-size.interface';
import type { LayoutChangeEvent } from 'react-native';

export const useBoardCellSize = (): BoardCellSizeInterface => {
    const [cellSize, setCellSize] = useState(0);

    const onBoardAreaLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;

        setCellSize(gameGetBoardCellSize({ availableWidth: width, availableHeight: height, fieldSize: defaultSudokuConfig.fieldSize }));
    };

    return { cellSize, onBoardAreaLayout };
};
