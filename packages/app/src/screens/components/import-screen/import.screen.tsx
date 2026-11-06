import { useAtomValue } from '@effect/atom-react/Hooks';
import { Trans, useLingui } from '@lingui/react/macro';
import { GridRecognitionKindEnum } from '@suuudokuuu/grid-vision';
import { ImportedPuzzleAssessmentKindEnum } from '@suuudokuuu/puzzle-forge';
import { AppButton } from '@suuudokuuu/ui';
import * as Effect from 'effect/Effect';
import * as AsyncResult from 'effect/reactivity/AsyncResult';
import * as Clipboard from 'expo-clipboard';
import { NotificationFeedbackType } from 'expo-haptics';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { useIsFocused } from 'expo-router';
import { use, useEffect, useEffectEvent, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { emptyFn, isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
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
import type { PressableStateCallbackType } from 'react-native';

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
    const { entranceKey, entryString, isPasteMissed, isGridMissed, isRecognizing, isTyping, selectedCellIndex, uncertainCellIndexes } =
        state;
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
    const resetTextStyles = [styles.resetText, { color: theme.colors.text.hint }];
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
    const entryLabel = isEntry ? t`Mark as printed` : t`Mark as handwritten`;
    const toggleLabel = canToggle ? entryLabel : null;

    const handleSelectCell = (cellIndex: number) => void update({ selectedCellIndex: cellIndex === selectedCellIndex ? null : cellIndex });
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
                    {hasBoard ? (
                        <Pressable
                            accessibilityRole="button"
                            hitSlop={12}
                            onPress={handleReset}
                            style={getResetStyles}
                            testID={ImportScreenSelectors.ResetButton}
                        >
                            <BlackText style={resetTextStyles}>
                                <Trans>Clear</Trans>
                            </BlackText>
                        </Pressable>
                    ) : null}
                </View>
            </View>
            <ScrollView
                contentContainerStyle={styles.content}
                contentInsetAdjustmentBehavior="never"
                style={styles.scroll}
                testID={ImportScreenSelectors.Root}
            >
                {hasBoard ? (
                    <ImportBoard
                        entryString={entryString}
                        uncertainCellIndexes={uncertainCellIndexes}
                        conflictCellIndexes={conflictCellIndexes}
                        key={entranceKey}
                        onSelectCell={handleSelectCell}
                        puzzleString={puzzleString}
                        selectedCellIndex={selectedCellIndex}
                    />
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

                <View style={styles.padSlot}>
                    {isDefined(selectedCellIndex) ? (
                        <ImportCellPad onInput={input} onToggleEntry={toggleEntry} toggleLabel={toggleLabel} />
                    ) : null}
                </View>
            </ScrollView>
            <View style={styles.footer}>
                {hasDigits ? (
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
