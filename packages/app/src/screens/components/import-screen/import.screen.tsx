import { useAtomValue } from '@effect/atom-react/Hooks';
import { useLingui } from '@lingui/react/macro';
import { parsePuzzleText } from '@suuudokuuu/encoder';
import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { ImportedPuzzleAssessmentKindEnum } from '@suuudokuuu/puzzle-forge';
import { AppButton } from '@suuudokuuu/ui';
import * as Effect from 'effect/Effect';
import * as AsyncResult from 'effect/reactivity/AsyncResult';
import * as Atom from 'effect/reactivity/Atom';
import * as Clipboard from 'expo-clipboard';
import { NotificationFeedbackType } from 'expo-haptics';
import { useIsFocused } from 'expo-router';
import LucideClipboardPaste from 'lucide-react-native/icons/clipboard-paste';
import { use, useEffect, useEffectEvent, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

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

import { ImportBoard } from './import-board/import-board';
import { ImportCellPad } from './import-cell-pad/import-cell-pad';
import { ImportScreenSelectors } from './import-screen.selectors';
import { ImportScreenStyles as styles } from './import-screen.styles';
import { ImportStatus } from './import-status/import-status';
import { importScreenSubscribeKeyboard } from './utils/import-screen-subscribe-keyboard.util';
import { importScreenSubscribePaste } from './utils/import-screen-subscribe-paste.util';

import type { ImportedPuzzleAssessmentType } from '@suuudokuuu/puzzle-forge';
import type { PressableStateCallbackType } from 'react-native';

const ImportDetent = 0.9;
const ImportDetents = [ImportDetent];
const EmptyCellText = '.';
const lastCellIndex = GameEmptySudokuStringConstant.length - 1;
const digitPattern = /[1-9]/u;

const importAssessmentAtom = Atom.family((puzzleString: string) =>
    appAtomRuntime.atom(
        Effect.sleep(LoaderPaintDelayMillisecondsConstant).pipe(
            Effect.andThen(Effect.flatMap(PuzzleGenerationService, service => service.assess(puzzleString)))
        )
    )
);

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
    const [puzzleString, setPuzzleString] = useState(() => parsePuzzleText(initialText) ?? GameEmptySudokuStringConstant);
    const [entranceKey, setEntranceKey] = useState(0);
    const [selectedCellIndex, setSelectedCellIndex] = useState<number | null>(null);
    const [isPasteMissed, setIsPasteMissed] = useState(false);
    const assessmentResult = useAtomValue(importAssessmentAtom(puzzleString));
    const hasDigits = digitPattern.test(puzzleString);
    const currentAssessment = AsyncResult.isSuccess(assessmentResult) ? assessmentResult.value : null;
    const [settledAssessment, setSettledAssessment] = useState<ImportedPuzzleAssessmentType | null>(currentAssessment);
    const nextSettledAssessment = hasDigits ? (currentAssessment ?? settledAssessment) : null;

    if (nextSettledAssessment !== settledAssessment) {
        setSettledAssessment(nextSettledAssessment);
    }

    const handleLoadText = (text: string) => {
        const parsedPuzzleString = parsePuzzleText(text);

        setIsPasteMissed(!isDefined(parsedPuzzleString));
        setSelectedCellIndex(null);

        if (isDefined(parsedPuzzleString)) {
            setPuzzleString(parsedPuzzleString);
            setEntranceKey(key => key + 1);
        }
    };

    const handlePaste = () =>
        void appRuntime.runFork(
            Effect.tryPromise(() => Clipboard.getStringAsync()).pipe(
                Effect.flatMap(clipboardText => Effect.sync(() => void handleLoadText(clipboardText))),
                Effect.catchCause(logErrorCause)
            )
        );

    const handleReset = () => {
        setPuzzleString(GameEmptySudokuStringConstant);
        setSelectedCellIndex(null);
        setIsPasteMissed(false);
    };

    const handleSelectCell = (cellIndex: number) => void setSelectedCellIndex(cellIndex === selectedCellIndex ? null : cellIndex);

    const handleCellInput = (value: number) => {
        if (!isDefined(selectedCellIndex)) {
            return;
        }

        const isClear = value === defaultSudokuConfig.blankCellValue;
        const cellText = isClear ? EmptyCellText : String(value);

        setIsPasteMissed(false);
        setPuzzleString(`${puzzleString.slice(0, selectedCellIndex)}${cellText}${puzzleString.slice(selectedCellIndex + 1)}`);
        setSelectedCellIndex(isClear ? selectedCellIndex : Math.min(selectedCellIndex + 1, lastCellIndex));
    };

    const uniqueAssessment = currentAssessment?.kind === ImportedPuzzleAssessmentKindEnum.UNIQUE ? currentAssessment : null;
    const conflictCellIndexes = settledAssessment?.kind === ImportedPuzzleAssessmentKindEnum.CONFLICT ? settledAssessment.cellIndexes : [];
    const settledKind = settledAssessment?.kind;
    const isPlayDisabled = !isDefined(uniqueAssessment);
    const playButtonStyles = isPlayDisabled && styles.disabledButton;
    const resetTextStyles = [styles.resetText, { color: theme.colors.text.hint }];
    const getResetStyles = ({ pressed }: PressableStateCallbackType) => [styles.reset, pressed && styles.resetPressed];

    const handlePlay = () => {
        if (isDefined(uniqueAssessment)) {
            confirmRunReplacement(() => void createFromImport(puzzleString, uniqueAssessment, lastGameMaxMistakes));
        }
    };

    const onPastedText = useEffectEvent(handleLoadText);
    const onKeyboardInput = useEffectEvent(handleCellInput);
    const onAssessmentSettled = useEffectEvent(hapticNotification);

    useEffect(() => (isFocused ? importScreenSubscribePaste(onPastedText) : emptyFn), [isFocused]);

    useEffect(
        () => (isFocused ? importScreenSubscribeKeyboard(selectedCellIndex, setSelectedCellIndex, onKeyboardInput) : emptyFn),
        [isFocused, selectedCellIndex]
    );

    useEffect(() => {
        if (Platform.OS === 'web') {
            return;
        }

        if (settledKind === ImportedPuzzleAssessmentKindEnum.CONFLICT) {
            onAssessmentSettled(NotificationFeedbackType.Warning);
        } else if (settledKind === ImportedPuzzleAssessmentKindEnum.UNIQUE) {
            onAssessmentSettled(NotificationFeedbackType.Success);
        }
    }, [settledKind]);

    return (
        <SheetFrame detents={ImportDetents}>
            <View style={styles.content} testID={ImportScreenSelectors.Root}>
                <View style={styles.header}>
                    <Header style={styles.title} testID={ImportScreenSelectors.Title} text={t`Import a puzzle`} />
                    {hasDigits ? (
                        <Pressable
                            accessibilityRole="button"
                            hitSlop={12}
                            onPress={handleReset}
                            style={getResetStyles}
                            testID={ImportScreenSelectors.ResetButton}
                        >
                            <BlackText style={resetTextStyles}>{t`Clear`}</BlackText>
                        </Pressable>
                    ) : null}
                </View>

                <ImportBoard
                    conflictCellIndexes={conflictCellIndexes}
                    entranceKey={entranceKey}
                    onSelectCell={handleSelectCell}
                    puzzleString={puzzleString}
                    selectedCellIndex={selectedCellIndex}
                />

                <ImportCellPad isDisabled={!isDefined(selectedCellIndex)} onInput={handleCellInput} />

                <ImportStatus
                    assessment={settledAssessment}
                    isCheckFailed={AsyncResult.isFailure(assessmentResult)}
                    isPasteMissed={isPasteMissed}
                    puzzleString={puzzleString}
                />

                {hasDigits ? (
                    <AppButton
                        disabled={isPlayDisabled}
                        isLoading={isCreatingGame}
                        onPress={handlePlay}
                        style={playButtonStyles}
                        testID={ImportScreenSelectors.PlayButton}
                        text={t`Play`}
                    />
                ) : (
                    <AppButton
                        icon={LucideClipboardPaste}
                        onPress={handlePaste}
                        testID={ImportScreenSelectors.PasteButton}
                        text={t`Paste puzzle`}
                    />
                )}
            </View>
        </SheetFrame>
    );
};
