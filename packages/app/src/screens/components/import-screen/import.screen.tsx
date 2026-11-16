import { useAtomValue } from '@effect/atom-react/Hooks';
import { useLingui } from '@lingui/react/macro';
import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { ImportedPuzzleAssessmentKindEnum } from '@suuudokuuu/puzzle-forge';
import { AppButton } from '@suuudokuuu/ui';
import { SpacingConstant } from '@suuudokuuu/ui/theme';
import * as Effect from 'effect/Effect';
import * as AsyncResult from 'effect/reactivity/AsyncResult';
import * as Clipboard from 'expo-clipboard';
import { NotificationFeedbackType } from 'expo-haptics';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useIsFocused } from 'expo-router';
import { use, useEffect, useEffectEvent, useRef, useState } from 'react';
import { Platform, ScrollView, View, useWindowDimensions } from 'react-native';

import { emptyFn, isDefined } from '@rnw-community/shared';

import { SheetFrame } from '../../../@generic/components/sheet-frame/sheet-frame';
import { useVibration } from '../../../@generic/hooks/use-vibration.hook';
import { appAtomRuntime, appRuntime } from '../../../@generic/runtime/app.runtime';
import { logErrorCause } from '../../../@generic/utils/log-error-cause.util';
import { GameEmptySudokuStringConstant } from '../../../game/constant/empty-sudoku-string.constant';
import { LoaderPaintDelayMillisecondsConstant } from '../../../game/constant/loader-paint-delay.constant';
import { GameContext } from '../../../game/context/game.context';
import { useConfirmRunReplacement } from '../../../game/hooks/use-confirm-run-replacement.hook';
import { PuzzleGenerationService } from '../../../game/service/puzzle-generation.service';
import { gameGetBoardGeometry } from '../../../game/utils/game-get-board-geometry.util';
import { useSettings } from '../../../settings/query/use-settings.query';

import { ImportCompactFrameHeightConstant } from './constants/import-compact-frame-height.constant';
import { useImportReview } from './hooks/use-import-review.hook';
import { ImportBoard } from './import-board/import-board';
import { ImportControls } from './import-controls/import-controls';
import { ImportHeader } from './import-header/import-header';
import { ImportScreenSelectors } from './import-screen.selectors';
import { ImportScreenStyles as styles } from './import-screen.styles';
import { ImportSources } from './import-sources/import-sources';
import { ImportStatus } from './import-status/import-status';
import { importScreenReadGrid } from './utils/import-screen-read-grid.util';
import { importScreenScanImage } from './utils/import-screen-scan-image.util';
import { importScreenSubscribeWebInput } from './utils/import-screen-subscribe-web-input.util';

import type * as Fiber from 'effect/Fiber';
import type { LayoutChangeEvent, LayoutRectangle, NativeScrollEvent, NativeSyntheticEvent, ScrollViewInstance } from 'react-native';

const ImportWebDetent = 0.95;
const ImportDetent = Platform.OS === 'web' ? ImportWebDetent : 1;
const ImportDetents = [ImportDetent];
const ImportBoardSideMax = 480;
const ImportBoardCellSizeMin = 26;
const ImportBoardSideMin = defaultSudokuConfig.fieldSize * ImportBoardCellSizeMin;
const ImportBoardInset = 16;
const ImportChromeHeightEstimate = 350;

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
    const { createFromImport, isCreatingGame } = use(GameContext);
    const { cellMargin, lastGameMaxMistakes } = useSettings();
    const confirmRunReplacement = useConfirmRunReplacement();
    const [hapticNotification] = useVibration();
    const { state, puzzleAtom, puzzleString, reset, loadText, loadGrid, input, toggleEntry, moveSelection, update } =
        useImportReview(initialText);
    const { entryString, isPasteMissed, isGridMissed, isRecognizing, isTyping, selectedCellIndex } = state;
    const [area, setArea] = useState<LayoutRectangle>(() => ({
        x: 0,
        y: 0,
        width: window.width,
        height: window.height * ImportDetent - ImportChromeHeightEstimate
    }));
    const scrollRef = useRef<ScrollViewInstance>(null);
    const scrollOffset = useRef(0);
    const [assessmentAtom] = useState(() =>
        appAtomRuntime.atom(get => {
            const assessedPuzzleString = get(puzzleAtom);

            return Effect.sleep(LoaderPaintDelayMillisecondsConstant).pipe(
                Effect.andThen(Effect.flatMap(PuzzleGenerationService, service => service.assess(assessedPuzzleString))),
                Effect.map(assessment => ({ assessment, puzzleString: assessedPuzzleString }))
            );
        })
    );
    const assessmentResult = useAtomValue(assessmentAtom);
    const hasDigits = puzzleString !== GameEmptySudokuStringConstant;
    const assessed = AsyncResult.isSuccess(assessmentResult) ? assessmentResult.value : null;
    const isAssessedCurrent = isDefined(assessed) && assessed.puzzleString === puzzleString;

    const hasBoard = hasDigits || isTyping || isRecognizing;
    const boardInset = window.height < ImportCompactFrameHeightConstant ? SpacingConstant.xs : ImportBoardInset;
    const frameSide = Math.min(area.width - SpacingConstant.lg * 2, ImportBoardSideMax);
    const boardSide = Math.floor(Math.max(ImportBoardSideMin, Math.min(frameSide, area.height - boardInset)));
    const frameGeometry = { ...ImportBoardGeometryOptions, cellMargin, availableWidth: frameSide, availableHeight: frameSide };
    const frameWidth = gameGetBoardGeometry(frameGeometry).boardSize;
    const boardGeometry = gameGetBoardGeometry({ ...frameGeometry, availableWidth: boardSide, availableHeight: boardSide });
    const handleAreaLayout = (event: LayoutChangeEvent) => {
        if (hasBoard) {
            setArea(event.nativeEvent.layout);
        }
    };
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
    const handlePasteImage = (uri: string) => void handleImageSource(Effect.succeed(uri));

    const settledAssessed = assessmentResult.waiting ? null : assessed;
    const isCheckFailed = AsyncResult.isFailure(assessmentResult) && !assessmentResult.waiting;
    const boardAssessed = hasDigits && assessed?.puzzleString !== GameEmptySudokuStringConstant ? assessed : null;
    const uniqueAssessment =
        isAssessedCurrent && assessed.assessment.kind === ImportedPuzzleAssessmentKindEnum.UNIQUE ? assessed.assessment : null;
    const conflictCellIndexes =
        boardAssessed?.assessment.kind === ImportedPuzzleAssessmentKindEnum.CONFLICT
            ? boardAssessed.assessment.cellIndexes.filter(cellIndex => puzzleString[cellIndex] === boardAssessed.puzzleString[cellIndex])
            : [];
    const isPlayDisabled = !isDefined(uniqueAssessment) || isRecognizing;
    const scrollStyles = hasBoard ? [styles.boardScroll, { flexBasis: boardInset + frameWidth }] : styles.scroll;
    const contentStyles = [styles.content, hasBoard ? { paddingTop: boardInset } : [styles.sourcesContent, { width: frameWidth }]];
    const statusSlotStyles = [styles.statusSlot, { width: frameWidth }];
    const dockStyles = [styles.dock, { width: boardGeometry.boardSize }];
    const playButtonStyles = [styles.playButton, isPlayDisabled && styles.disabledButton];

    const handlePlay = () => {
        if (isDefined(uniqueAssessment)) {
            confirmRunReplacement(() => void createFromImport(puzzleString, uniqueAssessment, lastGameMaxMistakes, entryString));
        }
    };

    const onMoveSelection = useEffectEvent(moveSelection);
    const onPastedText = useEffectEvent(handleLoadText);
    const onKeyboardInput = useEffectEvent(input);
    const onPastedImage = useEffectEvent(handlePasteImage);
    const onAssessmentSettled = useEffectEvent(hapticNotification);
    const onSelectedCell = useEffectEvent((cellIndex: number) => {
        const rowHeight = boardGeometry.boardSize / defaultSudokuConfig.fieldSize;
        const rowTop = Math.floor(cellIndex / defaultSudokuConfig.fieldSize) * rowHeight;
        const offset = Math.max(0, Math.ceil(boardInset + rowTop + rowHeight - area.height), Math.min(rowTop, scrollOffset.current));

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
        const settledKind = settledAssessed?.assessment.kind;

        if (settledKind === ImportedPuzzleAssessmentKindEnum.CONFLICT) {
            onAssessmentSettled(NotificationFeedbackType.Warning);
        } else if (settledKind === ImportedPuzzleAssessmentKindEnum.UNIQUE) {
            onAssessmentSettled(NotificationFeedbackType.Success);
        }
    }, [settledAssessed]);

    useEffect(() => {
        if (isDefined(selectedCellIndex)) {
            onSelectedCell(selectedCellIndex);
        }
    }, [selectedCellIndex]);

    const handleSelectCell = (cellIndex: number) => void update({ selectedCellIndex: cellIndex === selectedCellIndex ? null : cellIndex });
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
        <SheetFrame accessibilityLabel={t`Import a puzzle`} detents={ImportDetents}>
            <ImportHeader isResetVisible={hasBoard} onReset={handleReset} width={frameWidth} />
            <ScrollView
                ref={scrollRef}
                alwaysBounceVertical={false}
                onLayout={handleAreaLayout}
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
                        onSelectCell={handleSelectCell}
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
                    <View style={statusSlotStyles}>{status}</View>
                    <View style={styles.spare} />
                    <View style={dockStyles}>
                        <ImportControls onInput={input} onToggle={toggleEntry} puzzleString={puzzleString} review={state} />
                        <AppButton
                            disabled={isPlayDisabled}
                            isLoading={isCreatingGame}
                            onPress={handlePlay}
                            style={playButtonStyles}
                            testID={ImportScreenSelectors.PlayButton}
                            textStyle={styles.buttonText}
                            text={t`Play`}
                        />
                    </View>
                </>
            ) : null}
        </SheetFrame>
    );
};
