import { useLingui } from '@lingui/react/macro';
import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { MaxFontSizeMultiplierConstant, SpacingConstant } from '@suuudokuuu/ui/theme';
import * as Effect from 'effect/Effect';
import * as Clipboard from 'expo-clipboard';
import { NotificationFeedbackType } from 'expo-haptics';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useIsFocused } from 'expo-router';
import { use, useEffect, useEffectEvent, useRef, useState } from 'react';
import { Platform, ScrollView, View, useWindowDimensions } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { emptyFn, isDefined } from '@rnw-community/shared';

import { SheetFrame } from '../../../@generic/components/sheet-frame/sheet-frame';
import { useVibration } from '../../../@generic/hooks/use-vibration.hook';
import { appRuntime } from '../../../@generic/runtime/app.runtime';
import { logErrorCause } from '../../../@generic/utils/log-error-cause.util';
import { GameContext } from '../../../game/context/game.context';
import { useConfirmRunReplacement } from '../../../game/hooks/use-confirm-run-replacement.hook';
import { gameGetBoardGeometry } from '../../../game/utils/game-get-board-geometry.util';
import { useSettings } from '../../../settings/query/use-settings.query';

import { ImportCompactFrameHeightConstant } from './constants/import-compact-frame-height.constant';
import { ImportCompactPressHeightConstant } from './constants/import-compact-press-height.constant';
import { ImportRegularPressHeightConstant } from './constants/import-regular-press-height.constant';
import { useImportAssessment } from './hooks/use-import-assessment.hook';
import { useImportReview } from './hooks/use-import-review.hook';
import { ImportBoard } from './import-board/import-board';
import { ImportControls } from './import-controls/import-controls';
import { ImportDock } from './import-dock/import-dock';
import { ImportHeader } from './import-header/import-header';
import { ImportLegend } from './import-legend/import-legend';
import { ImportScreenSelectors } from './import-screen.selectors';
import { ImportScreenStyles as styles } from './import-screen.styles';
import { ImportSources } from './import-sources/import-sources';
import { ImportStatus } from './import-status/import-status';
import { importScreenReadGrid } from './utils/import-screen-read-grid.util';
import { importScreenScanImage } from './utils/import-screen-scan-image.util';
import { importScreenSubscribeWebInput } from './utils/import-screen-subscribe-web-input.util';

import type * as Fiber from 'effect/Fiber';
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, ScrollViewInstance } from 'react-native';

const ImportWebDetent = 0.975;
const ImportDetent = Platform.OS === 'web' ? ImportWebDetent : 1;
const ImportSheetHandleHeight = Platform.OS === 'web' ? 13 : 0;
const ImportBoardSideMax = 480;
const ImportBoardCellSizeMin = 26;
const ImportBoardSideMin = defaultSudokuConfig.fieldSize * ImportBoardCellSizeMin;
const ImportBoardInset = 16;
const ImportRegularHeaderHeight = 48;
const ImportRegularDockHeight = ImportRegularPressHeightConstant * 4 + SpacingConstant.xs + SpacingConstant.md;
const ImportRegularChromeHeight =
    ImportSheetHandleHeight + ImportRegularHeaderHeight + ImportBoardInset * 2 + SpacingConstant.xxl + ImportRegularDockHeight;

const ImportBoardGeometryOptions = {
    reservedHeight: 0,
    fieldSize: defaultSudokuConfig.fieldSize,
    fieldGroupSize: defaultSudokuConfig.fieldGroupWidth
};
interface Props {
    readonly initialText: string;
}

// oxlint-disable-next-line max-lines-per-function -- Layout/form component requires many lines
export const ImportScreen = ({ initialText }: Props) => {
    const { t } = useLingui();
    const isFocused = useIsFocused();
    const window = useWindowDimensions();
    const { rt } = useUnistyles();
    const { createFromImport } = use(GameContext);
    const { cellMargin, lastGameMaxMistakes } = useSettings();
    const confirmRunReplacement = useConfirmRunReplacement();
    const [hapticNotification] = useVibration();
    const { state, puzzleAtom, puzzleString, reset, loadText, loadGrid, input, toggleEntry, moveSelection, update, selectCell } =
        useImportReview(initialText);
    const { entryString, isPasteMissed, isGridMissed, isRecognizing, isTyping, selectedCellIndex } = state;
    const scrollRef = useRef<ScrollViewInstance>(null);
    const scrollOffset = useRef(0);
    const [measuredSheetHeight, setMeasuredSheetHeight] = useState<number>();
    const { hasDigits, boardAssessed, uniqueAssessment, isCheckFailed, conflictCellIndexes } = useImportAssessment(
        puzzleAtom,
        puzzleString
    );

    const hasBoard = hasDigits || isTyping || isRecognizing;
    const isCompact = window.height < ImportCompactFrameHeightConstant;
    const fontScale = Math.min(window.fontScale, MaxFontSizeMultiplierConstant);
    const statusHeight =
        (SpacingConstant.xl + SpacingConstant.xs + SpacingConstant.lg * (fontScale > 1 ? 2 : 1)) * fontScale + SpacingConstant.xs;
    const boardInset = isCompact ? SpacingConstant.xs : ImportBoardInset;
    const statusInset = isCompact ? SpacingConstant.xs : ImportBoardInset;
    const frameSide = Math.min(window.width - SpacingConstant.lg * 2, ImportBoardSideMax);
    const frameGeometry = { ...ImportBoardGeometryOptions, cellMargin, availableWidth: frameSide, availableHeight: frameSide };
    const columnWidth = gameGetBoardGeometry(frameGeometry).boardSize;
    const contentHeight = ImportRegularChromeHeight + columnWidth + statusHeight + rt.insets.bottom;
    const maximumSheetHeight = Platform.OS === 'web' ? window.height : window.height - rt.insets.top;
    const calculatedSheetHeight = Math.min(contentHeight, maximumSheetHeight * ImportDetent);
    const sheetHeight = Math.min(calculatedSheetHeight, measuredSheetHeight ?? calculatedSheetHeight);
    const dockHeight = isCompact ? ImportCompactPressHeightConstant * 4 + SpacingConstant.xs + SpacingConstant.sm : ImportRegularDockHeight;
    const areaHeight = Math.min(
        boardInset + columnWidth,
        sheetHeight -
            ImportSheetHandleHeight -
            (isCompact ? ImportCompactPressHeightConstant : ImportRegularHeaderHeight) -
            statusInset -
            statusHeight -
            dockHeight -
            rt.insets.bottom
    );
    const boardSide = Math.floor(
        Math.max(ImportBoardSideMin, Math.min(frameSide, areaHeight - (isCompact ? SpacingConstant.sm : boardInset)))
    );
    const boardGeometry = gameGetBoardGeometry({ ...frameGeometry, availableWidth: boardSide, availableHeight: boardSide });
    const frameWidth = columnWidth - boardGeometry.boardSize < SpacingConstant.sm * 2 ? boardGeometry.boardSize : columnWidth;
    const detents = [calculatedSheetHeight / maximumSheetHeight];
    const handleScrollLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
        setMeasuredSheetHeight(layout.y + layout.height + (hasBoard ? statusInset + statusHeight + dockHeight + rt.insets.bottom : 0));
    };
    const scrollLayoutProps = Platform.OS !== 'web' && { onLayout: handleScrollLayout };
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollOffset.current = event.nativeEvent.contentOffset.y;
    };
    const imageFiber = useRef<Fiber.Fiber<void> | null>(null);
    const interruptImage = () => {
        if (isDefined(imageFiber.current)) {
            imageFiber.current.interruptUnsafe();
        }
    };
    const handleReset = () => {
        interruptImage();
        reset();
    };
    const handleLoadText = (text: string) => {
        interruptImage();
        loadText(text);
    };
    const handlePaste = () =>
        void appRuntime.runFork(
            Effect.tryPromise(() => Clipboard.getStringAsync()).pipe(Effect.map(handleLoadText), Effect.catchCause(logErrorCause))
        );
    const readImage = (uri: string) =>
        Effect.sync(() => void update({ isRecognizing: true, isGridMissed: false, isPasteMissed: false, selectedCellIndex: null })).pipe(
            Effect.andThen(importScreenReadGrid(uri)),
            Effect.tap(scan =>
                Effect.sync(() => {
                    if (isDefined(scan)) {
                        loadGrid(scan);
                        hapticNotification(NotificationFeedbackType.Success);
                    } else {
                        update({ isRecognizing: false, isGridMissed: true });
                        hapticNotification(NotificationFeedbackType.Warning);
                    }
                })
            ),
            Effect.asVoid
        );
    const handleImageSource = (source: Effect.Effect<string | null>) => {
        interruptImage();
        imageFiber.current = appRuntime.runFork(
            source.pipe(
                Effect.flatMap(uri => (isDefined(uri) ? readImage(uri) : Effect.void)),
                Effect.catchCause(cause =>
                    Effect.sync(() => void update({ isRecognizing: false, isGridMissed: true })).pipe(Effect.andThen(logErrorCause(cause)))
                )
            )
        );
    };
    const handlePhotos = () =>
        void handleImageSource(
            Effect.tryPromise(() => launchImageLibraryAsync({ mediaTypes: ['images'] })).pipe(
                Effect.map(result => (result.canceled ? null : result.assets[0].uri)),
                Effect.orDie
            )
        );
    const isPlayDisabled = !isDefined(uniqueAssessment) || isRecognizing;
    const scrollStyles = hasBoard ? [styles.boardScroll, { flexBasis: boardInset + columnWidth }] : styles.scroll;
    const contentStyles = [styles.content, hasBoard ? { paddingTop: boardInset } : [styles.sourcesContent, { width: frameWidth }]];
    const statusSlotStyles = [styles.statusSlot, { width: frameWidth, height: statusInset + statusHeight, paddingTop: statusInset }];

    const handlePlay = () => {
        if (isDefined(uniqueAssessment)) {
            confirmRunReplacement(() => void createFromImport(puzzleString, uniqueAssessment, lastGameMaxMistakes, entryString));
        }
    };

    const onMoveSelection = useEffectEvent(moveSelection);
    const onPastedText = useEffectEvent(handleLoadText);
    const onKeyboardInput = useEffectEvent(input);
    const onPastedImage = useEffectEvent((uri: string) => void handleImageSource(Effect.succeed(uri)));
    const onSelectedCell = useEffectEvent((cellIndex: number) => {
        const rowHeight = boardGeometry.boardSize / defaultSudokuConfig.fieldSize;
        const rowTop = Math.floor(cellIndex / defaultSudokuConfig.fieldSize) * rowHeight;
        const offset = Math.max(0, Math.ceil(boardInset + rowTop + rowHeight - areaHeight), Math.min(rowTop, scrollOffset.current));

        if (offset !== scrollOffset.current) {
            scrollRef.current?.scrollTo({ y: offset, animated: false });
        }
    });

    useEffect(
        () => () => {
            if (isDefined(imageFiber.current)) {
                imageFiber.current.interruptUnsafe();
            }
        },
        []
    );

    useEffect(
        () => (isFocused ? importScreenSubscribeWebInput(onPastedText, onMoveSelection, onKeyboardInput, onPastedImage) : emptyFn),
        [isFocused]
    );

    useEffect(() => {
        if (isDefined(selectedCellIndex)) {
            onSelectedCell(selectedCellIndex);
        }
    }, [selectedCellIndex]);

    const handleScan = () => void handleImageSource(importScreenScanImage);
    const handleType = () => void update({ isTyping: true });
    const status = (
        <ImportStatus
            assessed={boardAssessed}
            isCheckFailed={isCheckFailed}
            puzzleString={puzzleString}
            review={state}
            uniqueAssessment={uniqueAssessment}
        />
    );

    return (
        <SheetFrame accessibilityLabel={t`Import a puzzle`} detents={detents}>
            <ImportHeader isResetVisible={hasBoard} onReset={handleReset} width={frameWidth} />
            <ScrollView
                ref={scrollRef}
                {...scrollLayoutProps}
                alwaysBounceVertical={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={contentStyles}
                contentInsetAdjustmentBehavior="never"
                style={scrollStyles}
                testID={ImportScreenSelectors.Root}
            >
                {hasBoard ? (
                    <ImportBoard
                        geometry={boardGeometry}
                        review={state}
                        conflictCellIndexes={conflictCellIndexes}
                        onSelectCell={selectCell}
                        puzzleString={puzzleString}
                    />
                ) : (
                    <ImportSources onScan={handleScan} onPhotos={handlePhotos} onPaste={handlePaste} onType={handleType}>
                        {isPasteMissed || isGridMissed ? <View style={styles.sourceStatus}>{status}</View> : null}
                    </ImportSources>
                )}
            </ScrollView>
            {hasBoard ? (
                <>
                    <View style={statusSlotStyles}>
                        {status}
                        <ImportLegend puzzleString={puzzleString} review={state} />
                    </View>
                    <ImportDock isPlayDisabled={isPlayDisabled} onPlay={handlePlay} width={frameWidth}>
                        <ImportControls onInput={input} onToggle={toggleEntry} puzzleString={puzzleString} review={state} />
                    </ImportDock>
                </>
            ) : null}
        </SheetFrame>
    );
};
