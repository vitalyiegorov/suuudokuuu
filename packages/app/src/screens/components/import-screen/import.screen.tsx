import { useAtomValue } from '@effect/atom-react/Hooks';
import { useLingui } from '@lingui/react/macro';
import { GridRecognitionKindEnum } from '@suuudokuuu/grid-vision';
import { ImportedPuzzleAssessmentKindEnum } from '@suuudokuuu/puzzle-forge';
import { AppButton } from '@suuudokuuu/ui';
import * as Effect from 'effect/Effect';
import * as AsyncResult from 'effect/reactivity/AsyncResult';
import * as Clipboard from 'expo-clipboard';
import { NotificationFeedbackType } from 'expo-haptics';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useIsFocused } from 'expo-router';
import LucideTrash from 'lucide-react-native/icons/trash';
import { use, useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { emptyFn, isDefined } from '@rnw-community/shared';

import { Header } from '../../../@generic/components/header/header';
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
import { ThemeContext } from '../../../theme/context/theme.context';

import { useImportReview } from './hooks/use-import-review.hook';
import { ImportBoard } from './import-board/import-board';
import { ImportCellPad } from './import-cell-pad/import-cell-pad';
import { ImportScreenSelectors } from './import-screen.selectors';
import { ImportScreenStyles as styles } from './import-screen.styles';
import { ImportSources } from './import-sources/import-sources';
import { ImportStatus } from './import-status/import-status';
import { importScreenReadGrid } from './utils/import-screen-read-grid.util';
import { importScreenScanImage } from './utils/import-screen-scan-image.util';
import { importScreenSubscribeWebInput } from './utils/import-screen-subscribe-web-input.util';

import type * as Fiber from 'effect/Fiber';
import type { LayoutChangeEvent, PressableStateCallbackType, ScrollViewInstance } from 'react-native';

const ImportDetent = 0.9;
const ImportDetents = [ImportDetent];
interface Props {
    readonly initialText: string;
}

// oxlint-disable-next-line max-lines-per-function -- Layout/form component requires many lines
export const ImportScreen = ({ initialText }: Props) => {
    const { t } = useLingui();
    const isFocused = useIsFocused();
    const { theme } = use(ThemeContext);
    const { createFromImport, isCreatingGame } = use(GameContext);
    const { lastGameMaxMistakes } = useSettings();
    const confirmRunReplacement = useConfirmRunReplacement();
    const [hapticNotification] = useVibration();
    const { state, puzzleAtom, puzzleString, reset, loadText, loadGrid, input, toggleEntry, moveSelection, update, canToggle, isEntry } =
        useImportReview(initialText);
    const { entryString, isPasteMissed, isGridMissed, isRecognizing, isTyping, selectedCellIndex, uncertainCellIndexes } = state;
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

    const [boardTop, setBoardTop] = useState(0);
    const [boardHeight, setBoardHeight] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(0);
    const [footerHeight, setFooterHeight] = useState(0);
    const scrollRef = useRef<ScrollViewInstance>(null);
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
            Effect.andThen(Effect.sleep(LoaderPaintDelayMillisecondsConstant)),
            Effect.andThen(importScreenReadGrid(uri)),
            Effect.tap(result =>
                Effect.sync(() => {
                    if (result.kind === GridRecognitionKindEnum.GRID_NOT_FOUND) {
                        update({ isRecognizing: false, isGridMissed: true });
                        hapticNotification(NotificationFeedbackType.Warning);
                    } else {
                        loadGrid(result);
                        hapticNotification(NotificationFeedbackType.Success);
                    }
                })
            )
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
    const playButtonStyles = isPlayDisabled && styles.disabledButton;
    const getResetStyles = ({ pressed }: PressableStateCallbackType) => [styles.reset, pressed && styles.resetPressed];

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

    const hasBoard = hasDigits || isTyping || isRecognizing;
    const entryLabel = isEntry ? t`Make printed clue` : t`Make my entry`;
    const toggleLabel = canToggle ? entryLabel : null;

    const handleScrollLayout = (event: LayoutChangeEvent) => void setViewportHeight(event.nativeEvent.layout.height);
    const handleFooterLayout = (event: LayoutChangeEvent) => void setFooterHeight(event.nativeEvent.layout.height);
    const handleBoardLayout = (event: LayoutChangeEvent) => {
        setBoardTop(event.nativeEvent.layout.y);
        setBoardHeight(event.nativeEvent.layout.height);
    };
    const handleSelectCell = (cellIndex: number) => void update({ selectedCellIndex: cellIndex === selectedCellIndex ? null : cellIndex });
    useLayoutEffect(() => {
        if (isDefined(selectedCellIndex) && boardHeight > 0 && viewportHeight > 0) {
            const rowHeight = boardHeight / 9;
            const selectedRowTop = boardTop + Math.floor(selectedCellIndex / 9) * rowHeight;

            appRuntime.runFork(
                Effect.sync(() =>
                    scrollRef.current?.scrollTo({
                        y: Math.max(0, selectedRowTop - (viewportHeight - rowHeight) / 2),
                        animated: false
                    })
                )
            );
        }
    }, [selectedCellIndex, boardHeight, boardTop, viewportHeight]);
    const handleScan = () => void handleImageSource(importScreenScanImage);
    const handleType = () => void update({ isTyping: true });
    const getSourceStatus = () => {
        if (isRecognizing) {
            return t`Reading the puzzle…`;
        }
        if (isGridMissed) {
            return t`Couldn't find a sudoku grid. Try a closer, straighter photo.`;
        }

        return isPasteMissed ? t`No puzzle found on the clipboard` : null;
    };
    const sourceStatus = getSourceStatus();

    return (
        <SheetFrame accessibilityLabel={t`Import a puzzle`} detents={ImportDetents}>
            <View collapsable={false} style={styles.headerContainer}>
                <View style={styles.header}>
                    <Header style={styles.title} testID={ImportScreenSelectors.Title} text={t`Import a puzzle`} />
                    <View style={styles.resetSlot}>
                        {hasBoard ? (
                            <Pressable
                                accessibilityLabel={t`Clear`}
                                accessibilityRole="button"
                                onPress={handleReset}
                                style={getResetStyles}
                                testID={ImportScreenSelectors.ResetButton}
                            >
                                <LucideTrash color={theme.colors.text.hint} size={22} />
                            </Pressable>
                        ) : null}
                    </View>
                </View>
            </View>
            <ScrollView
                ref={scrollRef}
                onLayout={handleScrollLayout}
                contentContainerStyle={styles.content(footerHeight)}
                contentInsetAdjustmentBehavior="never"
                style={styles.scroll}
                testID={ImportScreenSelectors.Root}
            >
                {hasBoard ? (
                    <View onLayout={handleBoardLayout}>
                        <ImportBoard
                            entryString={entryString}
                            uncertainCellIndexes={uncertainCellIndexes}
                            conflictCellIndexes={conflictCellIndexes}
                            onSelectCell={handleSelectCell}
                            puzzleString={puzzleString}
                            selectedCellIndex={selectedCellIndex}
                        />
                    </View>
                ) : (
                    <ImportSources onScan={handleScan} onPhotos={handlePhotos} onPaste={handlePaste} onType={handleType} />
                )}

                {hasBoard || isPasteMissed || isGridMissed ? (
                    <ImportStatus
                        entryString={entryString}
                        uncertainCellCount={uncertainCellIndexes.length}
                        sourceStatus={sourceStatus}
                        assessed={boardAssessed}
                        isCheckFailed={isCheckFailed}
                        puzzleString={puzzleString}
                    />
                ) : null}
            </ScrollView>
            {isDefined(selectedCellIndex) ? (
                <View style={styles.padSlot}>
                    <ImportCellPad onInput={input} onToggleEntry={toggleEntry} toggleLabel={toggleLabel} />
                </View>
            ) : null}
            <View style={styles.footer} onLayout={handleFooterLayout}>
                {hasBoard ? (
                    <AppButton
                        disabled={isPlayDisabled}
                        isLoading={isCreatingGame}
                        onPress={handlePlay}
                        style={playButtonStyles}
                        testID={ImportScreenSelectors.PlayButton}
                        text={t`Play`}
                    />
                ) : null}
            </View>
        </SheetFrame>
    );
};
