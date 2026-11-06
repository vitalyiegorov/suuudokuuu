import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { SpacingConstant } from '@suuudokuuu/ui/theme';
import { useLayoutEffect, useRef, useState } from 'react';

import { isDefined } from '@rnw-community/shared';

import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, ScrollViewInstance } from 'react-native';

const boardMaxWidth = 480;

export const useImportScroll = (selectedCellIndex: number | null) => {
    const [viewportHeight, setViewportHeight] = useState(0);
    const [boardWidth, setBoardWidth] = useState(0);
    const [boardTop, setBoardTop] = useState(0);
    const [padHeight, setPadHeight] = useState(0);
    const [statusHeight, setStatusHeight] = useState(0);
    const boardSide = isDefined(selectedCellIndex)
        ? Math.max(0, Math.min(boardWidth, viewportHeight - statusHeight - padHeight - SpacingConstant.sm * 2 - SpacingConstant.md * 2))
        : boardWidth;
    const scrollOffset = useRef(0);
    const scrollRef = useRef<ScrollViewInstance>(null);
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollOffset.current = event.nativeEvent.contentOffset.y;
    };
    const handleScrollLayout = (event: LayoutChangeEvent) => {
        setViewportHeight(event.nativeEvent.layout.height);
        setBoardWidth(Math.min(boardMaxWidth, event.nativeEvent.layout.width - SpacingConstant.lg * 2));
    };
    const handleBoardLayout = (event: LayoutChangeEvent) => void setBoardTop(event.nativeEvent.layout.y);
    const handlePadLayout = (event: LayoutChangeEvent) => void setPadHeight(event.nativeEvent.layout.height);
    const handleStatusLayout = (event: LayoutChangeEvent) => void setStatusHeight(event.nativeEvent.layout.height);
    useLayoutEffect(() => {
        if (isDefined(selectedCellIndex)) {
            const rowTop =
                boardTop + (Math.floor(selectedCellIndex / defaultSudokuConfig.fieldSize) * boardSide) / defaultSudokuConfig.fieldSize;
            const offset = Math.ceil(
                Math.max(0, rowTop + boardSide / defaultSudokuConfig.fieldSize - viewportHeight, Math.min(rowTop, scrollOffset.current))
            );
            scrollRef.current?.scrollTo({ y: offset, animated: false });
        }
    }, [selectedCellIndex, viewportHeight, boardTop, boardSide]);

    return {
        boardSide,
        handleStatusLayout,
        scrollRef,
        handleScroll,
        handleScrollLayout,
        handleBoardLayout,
        handlePadLayout
    };
};
