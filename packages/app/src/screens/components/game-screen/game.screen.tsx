import { useLingui } from '@lingui/react/macro';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { LucideHandHelping, LucideLogOut, LucideShare2 } from 'lucide-react-native';
import { use, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { Alert } from '../../../@generic/components/alert/alert';
import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeButton } from '../../../@generic/components/theme-button/theme-button';
import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { ThemeContext } from '../../../@generic/context/theme.context';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { hapticImpact, hapticNotification } from '../../../@generic/utils/haptic/haptic.util';
import { AvailableValuesItem, type AvailableValuesItemRef } from '../../../game/components/available-values-item/available-values-item';
import { Field, type FieldRef } from '../../../game/components/field/field';
import { GameTimer } from '../../../game/components/game-timer/game-timer';
import { GameContext } from '../../../game/context/game.context';
import { useKeyboardControls } from '../../../game/hooks/use-keyboard-controls/use-keyboard-controls.hook';
import { useShare } from '../../../game/hooks/use-share.hook';
import { gameResetAction, gameToggleCandidatesAction } from '../../../game/store/game.actions';
import { gameHasCandidatesSelector, gameMistakesSelector, gameScoreSelector } from '../../../game/store/game.selectors';
import { gameFinishedThunk } from '../../../game/store/thunks/game-finish.thunk';
import { gameMistakeThunk } from '../../../game/store/thunks/game-mistake.thunk';
import { gameSaveThunk } from '../../../game/store/thunks/game-save.thunk';

import { GameScreenStyles as styles } from './game-screen.styles';

import type { CellInterface, ScoredCellsInterface } from '@suuudokuuu/generator';
import type { Dispatch, SetStateAction } from 'react';

const MaxMistakesConstant = 3;

const setSharingAvailable = (setHasSharing: Dispatch<SetStateAction<boolean>>): void => {
    Sharing.isAvailableAsync()
        .then(result => void setHasSharing(result))
        .catch(() => void setHasSharing(false));
};

// eslint-disable-next-line max-lines-per-function,max-statements
export const GameScreen = () => {
    const router = useRouter();
    const { sudoku } = use(GameContext);
    const { theme } = use(ThemeContext);
    const { t } = useLingui();

    const dispatch = useAppDispatch();
    const score = useAppSelector(gameScoreSelector);
    const mistakes = useAppSelector(gameMistakesSelector);
    const hasCandidates = useAppSelector(gameHasCandidatesSelector);

    const [selectedCell, setSelectedCell] = useState<CellInterface>();
    const [hasSharing, setHasSharing] = useState(false);
    const availableValuesRefs = useRef<Record<number, AvailableValuesItemRef | null>>({});
    const fieldRef = useRef<FieldRef>(null);

    const maxMistakesReached = mistakes >= MaxMistakesConstant;

    // TODO: Is there a better way without using useEffect?
    useEffect(() => void setSharingAvailable(setHasSharing), []);

    const handleShare = useShare();

    const handleExit = () => {
        Alert(t`Stop current run?`, t`All progress will be lost`, [
            { text: t`Cancel`, style: 'cancel' },
            {
                text: 'OK',
                onPress: () => {
                    // TODO: do we need to reset internal component state?
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

        void dispatch(gameFinishedThunk({ difficulty: sudoku.Difficulty, isWon: false }));

        router.replace('loser');
    };

    const handleWonGame = () => {
        hapticImpact(ImpactFeedbackStyle.Heavy);

        void dispatch(gameFinishedThunk({ difficulty: sudoku.Difficulty, isWon: true }));

        // TODO: We need to wait for the animation to finish, animation finish event would fix it?
        setTimeout(() => void router.replace('winner'), 10 * animationDurationConstant);
    };

    const handleCorrectValue = (correctCell: CellInterface, newScoredCells: ScoredCellsInterface) => {
        fieldRef.current?.triggerCellAnimations(newScoredCells);
        void dispatch(gameSaveThunk({ sudoku, scoredCells: newScoredCells }));

        hapticNotification(Haptics.NotificationFeedbackType.Success);
        setSelectedCell(() => ({ ...correctCell }));
    };

    const handleWrongValue = () => {
        void dispatch(gameMistakeThunk(sudoku));

        if (mistakes + 1 >= MaxMistakesConstant) {
            handleLostGame();
        } else {
            hapticNotification(Haptics.NotificationFeedbackType.Error);
        }
    };

    const handleSelectValue = (value: number) => {
        const isBlankCellSelected = sudoku.isBlankCell(selectedCell);

        if (isBlankCellSelected) {
            availableValuesRefs.current[value]?.triggerAnimation();

            const newValueCell = { ...selectedCell, value };
            if (sudoku.isCorrectValue(newValueCell)) {
                const newScoredCells = sudoku.setCellValue(newValueCell);

                if (newScoredCells.isWon) {
                    handleWonGame();
                } else {
                    handleCorrectValue(selectedCell, newScoredCells);
                }
            } else {
                handleWrongValue();
            }
        }
    };

    const handleAvailableRef = (value: number) => (ref: AvailableValuesItemRef | null) => {
        availableValuesRefs.current[value] = ref;
    };

    const handleCandidates = () => {
        dispatch(gameToggleCandidatesAction());
    };

    useKeyboardControls(sudoku, selectedCell, handleSelectCell, handleSelectValue, handleExit);

    const mistakesCountTextStyles = [styles.mistakesCountText, { color: maxMistakesReached ? theme.colors.red : theme.colors.black }];

    return (
        <View style={styles.container}>
            <View style={styles.controls}>
                <View style={styles.controlsWrapper}>
                    <BlackText>{t`Mistakes`}</BlackText>

                    <BlackText>
                        <Text style={mistakesCountTextStyles}>{mistakes}</Text>

                        <Text style={styles.mistakesSeparator}>/</Text>

                        <BlackText style={styles.mistakesMaxText}>{MaxMistakesConstant}</BlackText>
                    </BlackText>
                </View>

                <View style={styles.controlsWrapper}>
                    <BlackText>{t`Elapsed`}</BlackText>

                    <GameTimer />
                </View>

                <View style={styles.scoreWrapper}>
                    <View style={styles.controlsWrapper}>
                        <BlackText>{t`Score`}</BlackText>

                        <BlackText style={styles.scoreText}>{score}</BlackText>
                    </View>
                </View>

                <View style={styles.buttonsWrapper}>
                    <BlackButton isActive={hasCandidates} onPress={handleCandidates} style={styles.button}>
                        <LucideHandHelping color={hasCandidates ? theme.colors.black : theme.colors.white} />
                    </BlackButton>

                    <ThemeButton style={styles.button} />

                    {hasSharing ? (
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        <BlackButton onPress={handleShare} style={styles.button}>
                            <LucideShare2 color={theme.colors.white} />
                        </BlackButton>
                    ) : null}

                    <BlackButton onPress={handleExit} style={styles.button}>
                        <LucideLogOut color={theme.colors.white} />
                    </BlackButton>
                </View>
            </View>

            <View style={styles.fieldWrapper}>
                <Field onSelect={handleSelectCell} ref={fieldRef} selectedCell={selectedCell} />
            </View>

            <View style={styles.availableValuesWrapper}>
                {sudoku.PossibleValues.map(value => (
                    <AvailableValuesItem
                        canPress={sudoku.isBlankCell(selectedCell)}
                        correctValue={sudoku.getCorrectValue(selectedCell)}
                        isActive={false}
                        key={`possible-value-${value}`}
                        onSelect={handleSelectValue}
                        progress={sudoku.getValueProgress(value)}
                        ref={handleAvailableRef(value)}
                        value={value}
                    />
                ))}
            </View>
        </View>
    );
};
