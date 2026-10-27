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
import { router, useLocalSearchParams } from 'expo-router';
import LucideClipboardPaste from 'lucide-react-native/icons/clipboard-paste';
import { use, useEffect, useState } from 'react';
import { ScrollView, TextInput, View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { Header } from '../../../@generic/components/header/header';
import { SheetFrame } from '../../../@generic/components/sheet-frame/sheet-frame';
import { HomeHrefConstant } from '../../../@generic/constants/home-href.constant';
import { appAtomRuntime, appRuntime } from '../../../@generic/runtime/app.runtime';
import { logErrorCause } from '../../../@generic/utils/log-error-cause.util';
import { GameEmptySudokuStringConstant } from '../../../game/constant/empty-sudoku-string.constant';
import { LoaderPaintDelayMillisecondsConstant } from '../../../game/constant/loader-paint-delay.constant';
import { GameContext } from '../../../game/context/game.context';
import { PuzzleGenerationService } from '../../../game/service/puzzle-generation.service';
import { useSettings } from '../../../settings/query/use-settings.query';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ImportBoard } from './import-board/import-board';
import { ImportCellPad } from './import-cell-pad/import-cell-pad';
import { ImportScreenSelectors } from './import-screen.selectors';
import { ImportScreenStyles as styles } from './import-screen.styles';
import { ImportStatus } from './import-status/import-status';
import { importScreenSubscribePaste } from './utils/import-screen-subscribe-paste.util';

const ImportDetents = [1];
const EmptyCellText = '.';

const importAssessmentAtom = Atom.family((puzzleString: string) =>
    appAtomRuntime.atom(
        Effect.sleep(LoaderPaintDelayMillisecondsConstant).pipe(
            Effect.andThen(Effect.flatMap(PuzzleGenerationService, service => service.assess(puzzleString)))
        )
    )
);

// oxlint-disable-next-line max-lines-per-function -- Layout/form component requires many lines
export const ImportScreen = () => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const { createFromImport, isCreatingGame } = use(GameContext);
    const { puzzle = '' } = useLocalSearchParams<{ puzzle?: string }>();
    const { lastGameMaxMistakes } = useSettings();
    const [text, setText] = useState(puzzle);
    const [selectedCellIndex, setSelectedCellIndex] = useState<number | null>(null);
    const parsedPuzzleString = parsePuzzleText(text);
    const puzzleString = parsedPuzzleString ?? GameEmptySudokuStringConstant;
    const assessmentResult = useAtomValue(importAssessmentAtom(puzzleString));

    const handleClose = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace(HomeHrefConstant);
        }
    };

    const handlePaste = () =>
        void appRuntime.runFork(
            Effect.tryPromise(() => Clipboard.getStringAsync()).pipe(
                Effect.flatMap(clipboardText => Effect.sync(() => void setText(clipboardText))),
                Effect.catchCause(logErrorCause)
            )
        );

    const handleSelectCell = (cellIndex: number) => void setSelectedCellIndex(cellIndex === selectedCellIndex ? null : cellIndex);

    const handleCellInput = (value: number) => {
        if (!isDefined(selectedCellIndex)) {
            return;
        }

        const cellText = value === defaultSudokuConfig.blankCellValue ? EmptyCellText : String(value);

        setText(`${puzzleString.slice(0, selectedCellIndex)}${cellText}${puzzleString.slice(selectedCellIndex + 1)}`);
    };

    const assessment = AsyncResult.isSuccess(assessmentResult) ? assessmentResult.value : null;
    const uniqueAssessment = assessment?.kind === ImportedPuzzleAssessmentKindEnum.UNIQUE ? assessment : null;
    const conflictCellIndexes = assessment?.kind === ImportedPuzzleAssessmentKindEnum.CONFLICT ? assessment.cellIndexes : [];
    const clueCount = Array.from(puzzleString).filter(cell => cell !== EmptyCellText).length;
    const inputStyles = [
        styles.input,
        { backgroundColor: theme.colors.surface.raised, borderColor: theme.colors.surface.border, color: theme.colors.text.primary }
    ];
    const hintStyles = [styles.hint, { color: theme.colors.text.hint }];
    const isPlayDisabled = !isDefined(uniqueAssessment);
    const playButtonStyles = isPlayDisabled && styles.disabledButton;

    const handlePlay = () => {
        if (isDefined(uniqueAssessment)) {
            createFromImport(puzzleString, uniqueAssessment, lastGameMaxMistakes);
        }
    };

    useEffect(() => importScreenSubscribePaste(setText), []);

    return (
        <SheetFrame detents={ImportDetents}>
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                testID={ImportScreenSelectors.Root}
            >
                <Header style={styles.title} text={t`Import a puzzle`} />

                <ImportBoard
                    conflictCellIndexes={conflictCellIndexes}
                    onSelectCell={handleSelectCell}
                    puzzleString={puzzleString}
                    selectedCellIndex={selectedCellIndex}
                />

                {isDefined(selectedCellIndex) ? <ImportCellPad onInput={handleCellInput} /> : null}

                {isDefined(parsedPuzzleString) ? (
                    <ImportStatus assessmentResult={assessmentResult} clueCount={clueCount} />
                ) : (
                    <BlackText style={hintStyles} testID={ImportScreenSelectors.Status}>
                        {t`Paste a puzzle or open a link`}
                    </BlackText>
                )}

                <TextInput
                    accessibilityLabel={t`Puzzle text`}
                    autoCapitalize="none"
                    autoCorrect={false}
                    multiline
                    onChangeText={setText}
                    placeholder={t`81 digits, a grid, or a puzzle link`}
                    placeholderTextColor={theme.colors.text.hint}
                    style={inputStyles}
                    testID={ImportScreenSelectors.Input}
                    value={text}
                />

                <AppButton
                    icon={LucideClipboardPaste}
                    onPress={handlePaste}
                    testID={ImportScreenSelectors.PasteButton}
                    text={t`Paste`}
                    variant="secondary"
                />

                <View style={styles.actions}>
                    <AppButton
                        disabled={isPlayDisabled}
                        isLoading={isCreatingGame}
                        onPress={handlePlay}
                        style={playButtonStyles}
                        testID={ImportScreenSelectors.PlayButton}
                        text={t`Play`}
                    />
                    <AppButton onPress={handleClose} testID={ImportScreenSelectors.CancelButton} text={t`Cancel`} variant="ghost" />
                </View>
            </ScrollView>
        </SheetFrame>
    );
};
