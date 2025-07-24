import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useRouter } from 'expo-router';
import { LucideHandHelping, LucideLogOut } from 'lucide-react-native';
import { use, useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { cs } from '@rnw-community/shared';

import { Alert } from '../../../@generic/components/alert/alert';
import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { Colors } from '../../../@generic/styles/theme';
import { hapticImpact, hapticNotification } from '../../../@generic/utils/haptic/haptic.util';
import { AvailableValuesItem, type AvailableValuesItemRef } from '../../../game/components/available-values-item/available-values-item';
import { Field, type FieldRef } from '../../../game/components/field/field';
import { GameTimer } from '../../../game/components/game-timer/game-timer';
import { GameContext } from '../../../game/context/game.context';
import { useKeyboardControls } from '../../../game/hooks/use-keyboard-controls/use-keyboard-controls.hook';
import { gameResetAction, gameToggleCandidatesAction } from '../../../game/store/game.actions';
import { gameHasCandidatesSelector, gameMistakesSelector, gameScoreSelector } from '../../../game/store/game.selectors';
import { gameFinishedThunk } from '../../../game/store/thunks/game-finish.thunk';
import { gameMistakeThunk } from '../../../game/store/thunks/game-mistake.thunk';
import { gameSaveThunk } from '../../../game/store/thunks/game-save.thunk';

import { GameScreenStyles as styles } from './game-screen.styles';

import type { CellInterface, ScoredCellsInterface } from '@suuudokuuu/generator';

const MaxMistakesConstant = 3;

// eslint-disable-next-line max-lines-per-function
export const GameScreen = () => {
    const router = useRouter();
    const { sudoku } = use(GameContext);

    const dispatch = useAppDispatch();
    const score = useAppSelector(gameScoreSelector);
    const mistakes = useAppSelector(gameMistakesSelector);
    const hasCandidates = useAppSelector(gameHasCandidatesSelector);

    const [selectedCell, setSelectedCell] = useState<CellInterface>();
    const availableValuesRefs = useRef<Record<number, AvailableValuesItemRef | null>>({});
    const fieldRef = useRef<FieldRef>(null);

    const maxMistakesReached = mistakes >= MaxMistakesConstant;

    const handleExit = () => {
        Alert('Stop current run?', 'All progress will be lost', [
            { text: 'Cancel', style: 'cancel' },
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

    // eslint-disable-next-line max-statements
    const handleCorrectValue = (correctCell: CellInterface, newScoredCells: ScoredCellsInterface) => {
        fieldRef.current?.triggerCellAnimations(newScoredCells);
        void dispatch(gameSaveThunk({ sudoku, scoredCells: newScoredCells }));

        if (newScoredCells.isWon) {
            handleWonGame();
        } else {
            hapticNotification(Haptics.NotificationFeedbackType.Success);

            if (sudoku.isValueAvailable(correctCell)) {
                // HINT: We reselect cell if there are values left, otherwise loose focus
                setSelectedCell(() => ({ ...correctCell }));
            } else {
                // HINT: Otherwise we loose focus
                // eslint-disable-next-line no-undefined
                setSelectedCell(undefined);
            }
        }
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
                handleCorrectValue(selectedCell, sudoku.setCellValue(newValueCell));
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

    const mistakesCountTextStyles = [styles.mistakesCountText, cs(maxMistakesReached, styles.mistakesCountErrorText)];

    return (
        <View style={styles.container}>
            <View style={styles.controls}>
                <View style={styles.controlsWrapper}>
                    <Text style={styles.headerText}>Mistakes</Text>

                    <Text style={styles.headerText}>
                        <Text style={mistakesCountTextStyles}>{mistakes}</Text>

                        <Text style={styles.mistakesSeparator}>/</Text>

                        <Text style={styles.mistakesMaxText}>{MaxMistakesConstant}</Text>
                    </Text>
                </View>

                <View style={styles.controlsWrapper}>
                    <Text style={styles.headerText}>Score</Text>

                    <Text style={styles.scoreText}>{score}</Text>
                </View>

                <View style={styles.buttonsWrapper}>
                    <BlackButton isActive={hasCandidates} onPress={handleCandidates} style={styles.button}>
                        <LucideHandHelping color={hasCandidates ? 'red' : Colors.white} />
                    </BlackButton>

                    <BlackButton onPress={handleExit} style={styles.button}>
                        <LucideLogOut color={Colors.white} />
                    </BlackButton>
                </View>
            </View>

            <Field onSelect={handleSelectCell} ref={fieldRef} selectedCell={selectedCell} />

            <GameTimer />

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
