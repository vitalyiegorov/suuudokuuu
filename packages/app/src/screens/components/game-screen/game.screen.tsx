import { useLingui } from '@lingui/react/macro';
import { emptyScoredCells } from '@suuudokuuu/generator';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { LucideLogOut, LucideSettings, LucideShare2 } from 'lucide-react-native';
import { use, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { Alert } from '../../../@generic/components/alert/alert';
import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { useVibration } from '../../../@generic/hooks/use-vibration.hook';
import { AutoCandidatesButton } from '../../../game/components/auto-candidates-button/auto-candidates-button';
import { AvailableValuesItem, type AvailableValuesItemRef } from '../../../game/components/available-values-item/available-values-item';
import { CandidateInputItem } from '../../../game/components/candidate-input-item/candidate-input-item';
import { Field } from '../../../game/components/field/field';
import { GameTimer } from '../../../game/components/game-timer/game-timer';
import { InputModeButton } from '../../../game/components/input-mode-button/input-mode-button';
import { GameContext } from '../../../game/context/game.context';
import { useKeyboardControls } from '../../../game/hooks/use-keyboard-controls/use-keyboard-controls.hook';
import { useShare } from '../../../game/hooks/use-share.hook';
import {
    gameFinishAction,
    gameMistakeAction,
    gameResetAction,
    gameSaveAction,
    gameToggleCellCandidateAction
} from '../../../game/store/game.actions';
import {
    gameInputModeSelector,
    gameMaxMistakesSelector,
    gameMistakesSelector,
    gameScoreSelector
} from '../../../game/store/game.selectors';
import { settingsKeySelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';

import { GameScreenSelectors } from './game-screen.selectors';
import { GameScreenStyles as styles } from './game-screen.styles';

import type { CellInterface, ScoredCellsInterface } from '@suuudokuuu/generator';
import type { Dispatch, SetStateAction } from 'react';

const setSharingAvailable = (setHasSharing: Dispatch<SetStateAction<boolean>>): void => {
    Sharing.isAvailableAsync()
        .then(result => void setHasSharing(result))
        .catch(() => void setHasSharing(false));
};

// eslint-disable-next-line max-lines-per-function,max-statements
export const GameScreen = () => {
    const router = useRouter();
    const { t } = useLingui();

    const { sudoku } = use(GameContext);
    const { theme } = use(ThemeContext);

    const [hapticNotification, hapticImpact] = useVibration();

    const dispatch = useAppDispatch();
    const score = useAppSelector(gameScoreSelector);
    const mistakes = useAppSelector(gameMistakesSelector);
    const maxMistakes = useAppSelector(gameMaxMistakesSelector);
    const hasTimer = useAppSelector(settingsKeySelector('hasTimer'));
    const inputMode = useAppSelector(gameInputModeSelector);

    const [selectedCell, setSelectedCell] = useState<CellInterface>();
    const [hasSharing, setHasSharing] = useState(false);
    const [scoredCells, setScoredCells] = useState<ScoredCellsInterface>(emptyScoredCells);
    const availableValuesRefs = useRef<Record<number, AvailableValuesItemRef | null>>({});

    const maxMistakesReached = mistakes >= maxMistakes;

    // TODO: Is there a better way without using useEffect?
    useEffect(() => void setSharingAvailable(setHasSharing), []);

    const handleShare = useShare();

    const handleExit = () => {
        Alert(t`Stop current run?`, t`All progress will be lost`, [
            { text: t`Cancel`, style: 'cancel' },
            {
                text: 'OK',
                onPress: () => {
                    dispatch(gameResetAction());
                    router.replace('/');
                }
            }
        ]);
    };

    const handleSelectCell = (cell: CellInterface | undefined) => {
        setSelectedCell(cell);
        hapticImpact(ImpactFeedbackStyle.Light);
    };

    const handleLostGame = () => {
        hapticImpact(ImpactFeedbackStyle.Heavy);

        dispatch(gameFinishAction({ difficulty: sudoku.Difficulty, isWon: false }));

        router.replace('loser');
    };

    const handleWonGame = () => {
        hapticImpact(ImpactFeedbackStyle.Heavy);

        dispatch(gameFinishAction({ difficulty: sudoku.Difficulty, isWon: true }));

        // HINT: We need to wait for the animation to finish, animation finish event would fix it?
        setTimeout(() => void router.replace('winner'), 10 * animationDurationConstant);
    };

    const handleCorrectValue = (correctCell: CellInterface, newScoredCells: ScoredCellsInterface) => {
        dispatch(gameSaveAction({ sudoku, scoredCells: newScoredCells, correctCell }));

        hapticNotification(Haptics.NotificationFeedbackType.Success);

        setScoredCells(newScoredCells);
        setSelectedCell(() => ({ ...correctCell }));
    };

    const handleWrongValue = () => {
        dispatch(gameMistakeAction());

        if (mistakes + 1 >= maxMistakes) {
            handleLostGame();
        } else {
            hapticNotification(Haptics.NotificationFeedbackType.Error);
        }
    };

    const handleCandidateInput = (cell: CellInterface, value: number) => {
        dispatch(gameToggleCellCandidateAction({ ...cell, value }));
        hapticImpact(ImpactFeedbackStyle.Light);
    };

    const handleNormalInput = (cell: CellInterface, value: number) => {
        const newValueCell = { ...cell, value };
        if (sudoku.isCorrectValue(newValueCell)) {
            const newScoredCells = sudoku.setCellValue(newValueCell);

            handleCorrectValue(cell, newScoredCells);

            if (newScoredCells.isWon) {
                handleWonGame();
            }
        } else {
            handleWrongValue();
        }
    };

    const handleSelectValue = (value: number) => {
        const isBlankCellSelected = sudoku.isBlankCell(selectedCell);

        if (isBlankCellSelected) {
            availableValuesRefs.current[value]?.triggerAnimation();

            if (inputMode === 'candidate') {
                handleCandidateInput(selectedCell, value);
            } else {
                handleNormalInput(selectedCell, value);
            }
        }
    };

    const handleAvailableRef = (value: number) => (ref: AvailableValuesItemRef | null) => {
        availableValuesRefs.current[value] = ref;
    };

    useKeyboardControls(sudoku, selectedCell, handleSelectCell, handleSelectValue, handleExit);

    const mistakesCountTextStyles = [styles.mistakesCountText, { color: maxMistakesReached ? theme.colors.red : theme.colors.label.main }];
    const hideAutoCandidates = maxMistakes === 0;

    return (
        <View style={styles.container} testID={GameScreenSelectors.Root}>
            <View style={styles.fieldWrapper}>
                <View style={styles.controls}>
                    <View style={styles.controlsWrapper}>
                        <BlackText>{t`Mistakes`}</BlackText>

                        <BlackText>
                            <Text style={mistakesCountTextStyles} testID={GameScreenSelectors.MistakesCount}>
                                {mistakes}
                            </Text>

                            <Text style={styles.mistakesSeparator}>/</Text>

                            <BlackText style={styles.mistakesMaxText} testID={GameScreenSelectors.MaxMistakesAllowed}>
                                {maxMistakes}
                            </BlackText>
                        </BlackText>
                    </View>

                    {hasTimer ? (
                        <View style={styles.controlsWrapper}>
                            <BlackText>{t`Elapsed`}</BlackText>

                            <GameTimer />
                        </View>
                    ) : null}

                    <View style={styles.scoreWrapper}>
                        <View style={styles.controlsWrapper}>
                            <BlackText>{t`Score`}</BlackText>

                            <BlackText style={styles.scoreText} testID={GameScreenSelectors.Score}>
                                {score}
                            </BlackText>
                        </View>
                    </View>

                    <View style={styles.buttonsWrapper}>
                        {hasSharing ? (
                            <BlackButton onPress={handleShare} style={styles.button} testID={GameScreenSelectors.ShareButton}>
                                <LucideShare2 color={theme.colors.white} />
                            </BlackButton>
                        ) : null}

                        <BlackButton href="/settings" style={styles.button}>
                            <LucideSettings color={theme.colors.white} />
                        </BlackButton>

                        <BlackButton onPress={handleExit} style={styles.button} testID={GameScreenSelectors.QuitButton}>
                            <LucideLogOut color={theme.colors.white} />
                        </BlackButton>
                    </View>
                </View>

                <Field onSelect={handleSelectCell} scoredCells={scoredCells} selectedCell={selectedCell} />
            </View>

            <View style={styles.bottomContainer}>
                <View style={styles.additionalControlsWrapper}>
                    <InputModeButton />
                    {hideAutoCandidates ? null : <AutoCandidatesButton />}
                </View>
                <View style={styles.availableValuesWrapper}>
                    {sudoku.PossibleValues.map(value =>
                        inputMode === 'candidate' ? (
                            <CandidateInputItem
                                canPress={sudoku.isBlankCell(selectedCell)}
                                key={`candidate-value-${value}`}
                                onSelect={handleSelectValue}
                                selectedCell={selectedCell}
                                value={value}
                            />
                        ) : (
                            <AvailableValuesItem
                                canPress={sudoku.isBlankCell(selectedCell)}
                                correctValue={sudoku.getCorrectValue(selectedCell)}
                                key={`possible-value-${value}`}
                                onSelect={handleSelectValue}
                                progress={sudoku.getValueProgress(value)}
                                ref={handleAvailableRef(value)}
                                value={value}
                            />
                        )
                    )}
                </View>
            </View>
        </View>
    );
};
