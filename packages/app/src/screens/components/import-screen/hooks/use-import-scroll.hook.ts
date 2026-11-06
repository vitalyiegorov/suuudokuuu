import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { SpacingConstant } from '@suuudokuuu/ui/theme';
import * as Effect from 'effect/Effect';
import { useLayoutEffect, useRef, useState } from 'react';

import { isDefined } from '@rnw-community/shared';

import { appRuntime } from '../../../../@generic/runtime/app.runtime';

import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, ScrollViewInstance } from 'react-native';

const boardMaxWidth = 480;

export const useImportScroll = (selectedCellIndex: number | null, hasBoard: boolean) => {
    const [viewportHeight, setViewportHeight] = useState(0);
    const [boardWidth, setBoardWidth] = useState(0);
    const [boardTop, setBoardTop] = useState(0);
    const [padBottom, setPadBottom] = useState(0);
    const [footerHeight, setFooterHeight] = useState(0);
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
    const handlePadLayout = (event: LayoutChangeEvent) => {
        const { y, height } = event.nativeEvent.layout;
        setPadBottom(y + height);
    };
    const handleFooterLayout = (event: LayoutChangeEvent) => void setFooterHeight(event.nativeEvent.layout.height);
    useLayoutEffect(() => {
        if (isDefined(selectedCellIndex)) {
            const rowTop =
                boardTop + (Math.floor(selectedCellIndex / defaultSudokuConfig.fieldSize) * boardWidth) / defaultSudokuConfig.fieldSize;
            const offset = Math.max(0, Math.min(rowTop, Math.max(scrollOffset.current, padBottom - viewportHeight)));
            appRuntime.runFork(Effect.sync(() => scrollRef.current?.scrollTo({ y: offset, animated: false })));
        }
    }, [selectedCellIndex, viewportHeight, boardTop, boardWidth, padBottom]);

    return {
        scrollRef,
        handleScroll,
        handleScrollLayout,
        handleBoardLayout,
        handlePadLayout,
        handleFooterLayout,
        bottomInset: (hasBoard ? footerHeight : 0) + SpacingConstant.md
    };
};
