import { useAtomValue } from '@effect/atom-react/Hooks';
import { useLingui } from '@lingui/react/macro';
import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { ImportedPuzzleAssessmentKindEnum } from '@suuudokuuu/puzzle-forge';
import { AppButton } from '@suuudokuuu/ui';
import { MaxFontSizeMultiplierConstant, SpacingConstant } from '@suuudokuuu/ui/theme';
import * as Effect from 'effect/Effect';
import * as AsyncResult from 'effect/reactivity/AsyncResult';
import * as Clipboard from 'expo-clipboard';
import { NotificationFeedbackType } from 'expo-haptics';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useIsFocused } from 'expo-router';
import { use, useEffect, useEffectEvent, useRef, useState } from 'react';
import { Platform, ScrollView, View, useWindowDimensions } from 'react-native';

import { emptyFn, isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { SheetFrame } from '../../../@generic/components/sheet-frame/sheet-frame';
import { useVibration } from '../../../@generic/hooks/use-vibration.hook';
import { appAtomRuntime, appRuntime } from '../../../@generic/runtime/app.runtime';
import { logErrorCause } from '../../../@generic/utils/log-error-cause.util';
import { GameEmptySudokuStringConstant } from '../../../game/constant/empty-sudoku-string.constant';
import { LoaderPaintDelayMillisecondsConstant } from '../../../game/constant/loader-paint-delay.constant';
import { GameContext } from '../../../game/context/game.context';
import { useConfirmRunReplacement } from '../../../game/hooks/use-confirm-run-replacement.hook';
import { PuzzleGenerationService } from '../../../game/service/puzzle-generation.service';
import { useSettings } from '../../../settings/query/use-settings.query';

import { useImportReview } from './hooks/use-import-review.hook';
import { ImportBoard } from './import-board/import-board';
import { ImportCellPad } from './import-cell-pad/import-cell-pad';
import { ImportEntryKind } from './import-entry-kind/import-entry-kind';
import { ImportHeader } from './import-header/import-header';
import { ImportReviewGuidance } from './import-review-guidance/import-review-guidance';
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
const ImportBoardCellSizeMin = 28;
const ImportBoardSideMin = defaultSudokuConfig.fieldSize * ImportBoardCellSizeMin;
const ImportStatusSlotHeight = 64;
const ImportChromeHeightEstimate = 300;
interface Props {
    readonly initialText: string;
}

// oxlint-disable-next-line max-lines-per-function -- Layout/form component requires many lines
export const ImportScreen = ({ initialText }: Props) => {
    const { t } = useLingui();
    const isFocused = useIsFocused();
    const window = useWindowDimensions();
    const { createFromImport, isCreatingGame } = use(GameContext);
    const { lastGameMaxMistakes } = useSettings();
    const confirmRunReplacement = useConfirmRunReplacement();
    const [hapticNotification] = useVibration();
    const { state, puzzleAtom, puzzleString, reset, loadText, loadGrid, input, toggleEntry, moveSelection, update } =
        useImportReview(initialText);
    const { entryString, isPasteMissed, isGridMissed, isRecognizing, isTyping, scannedCellIndexes, selectedCellIndex } = state;
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
    const statusSlotHeight = ImportStatusSlotHeight * Math.min(window.fontScale, MaxFontSizeMultiplierConstant);
    const boardSide = Math.floor(
        Math.max(
            ImportBoardSideMin,
            Math.min(area.width - SpacingConstant.lg * 2, ImportBoardSideMax, area.height - statusSlotHeight - SpacingConstant.sm * 3)
        )
    );
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
    const contentStyles = [styles.content, hasBoard ? styles.boardContent : styles.sourcesContent];
    const statusSlotStyles = [styles.statusSlot, { height: statusSlotHeight }];
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
        const rowHeight = boardSide / defaultSudokuConfig.fieldSize;
        const rowTop = Math.floor(cellIndex / defaultSudokuConfig.fieldSize) * rowHeight;
        const offset = Math.max(0, Math.ceil(rowTop + rowHeight - area.height), Math.min(rowTop, scrollOffset.current));

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

    return (
        <SheetFrame accessibilityLabel={t`Import a puzzle`} detents={ImportDetents}>
            <ImportHeader isResetVisible={hasBoard} onReset={handleReset} />
            <ScrollView
                ref={scrollRef}
                alwaysBounceVertical={false}
                onLayout={handleAreaLayout}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={contentStyles}
                contentInsetAdjustmentBehavior="never"
                style={styles.scroll}
                testID={ImportScreenSelectors.Root}
            >
                {hasBoard ? (
                    <ImportBoard
                        side={boardSide}
                        review={state}
                        conflictCellIndexes={conflictCellIndexes}
                        onSelectCell={handleSelectCell}
                        puzzleString={puzzleString}
                    />
                ) : (
                    <ImportSources onScan={handleScan} onPhotos={handlePhotos} onPaste={handlePaste} onType={handleType} />
                )}

                {hasBoard || isPasteMissed || isGridMissed ? (
                    <View style={statusSlotStyles}>
                        <ImportStatus assessed={boardAssessed} isCheckFailed={isCheckFailed} puzzleString={puzzleString} review={state} />
                        <ImportReviewGuidance assessment={uniqueAssessment} clueString={puzzleString} review={state} />
                    </View>
                ) : null}
            </ScrollView>
            {hasBoard ? (
                <View style={styles.dock}>
                    <ImportCellPad isDisabled={!isDefined(selectedCellIndex)} onInput={input} />
                    {isRecognizing || isNotEmptyArray(scannedCellIndexes) ? (
                        <ImportEntryKind onToggle={toggleEntry} puzzleString={puzzleString} review={state} />
                    ) : null}
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
            ) : null}
        </SheetFrame>
    );
};
