import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cs, isDefined } from '@rnw-community/shared';

import {
    Alert,
    BlackButton,
    DifficultyEnum,
    PageHeader,
    animationDurationConstant,
    hapticImpact,
    hapticNotification,
    useAppDispatch,
    useAppSelector
} from '../../../@generic';
import type { CellInterface, FieldInterface, ScoredCellsInterface } from '../../../@logic';
import { MaxMistakesConstant, Sudoku, SudokuMoveEnum, defaultSudokuConfig, emptyScoredCells } from '../../../@logic';
import { type AvailableValuesType } from '../../../@logic/types/available-values.type';
import { gameResetAction, gameSaveAction, gameStartAction } from '../../store/game.actions';
import { gameMistakesSelector, gameScoreSelector } from '../../store/game.selectors';
import { gameFinishedThunk } from '../../store/thunks/game-finish.thunk';
import { AvailableValues } from '../available-values/available-values';
import { Field } from '../field/field';
import { GameTimer } from '../game-timer/game-timer';

import { GameScreenStyles as styles } from './game-screen.styles';

/**
 * We have inconsistency of state storage, field is coming from the url and score and mistakes from redux
 * we need to unify this approach
 */
/*
 * TODO: Add screen loading state
 * TODO: Add loading from string
 */
// eslint-disable-next-line max-lines-per-function
export const GameScreen = () => {
    const router = useRouter();
    const { field: routeField, difficulty: routeDifficulty } = useLocalSearchParams<{ field?: string; difficulty?: DifficultyEnum }>();

    const dispatch = useAppDispatch();
    // TODO: Improve state loading and merging with Sudoku?
    const savedScore = useAppSelector(gameScoreSelector);
    const savedMistakes = useAppSelector(gameMistakesSelector);

    const sudokuRef = useRef<Sudoku>(new Sudoku(defaultSudokuConfig));

    // TODO: This state will change only when we start the game? Do we need it or how to improve
    const [difficulty, setDifficulty] = useState<DifficultyEnum>(DifficultyEnum.Newbie);
    const [gameField, setGameField] = useState<FieldInterface>([]);
    const [fullField, setFullField] = useState<FieldInterface>([]);
    const [score, setScore] = useState(savedScore);
    const [mistakes, setMistakes] = useState(savedMistakes);
    const [selectedCell, setSelectedCell] = useState<CellInterface>();
    const [scoredCells, setScoredCells] = useState<ScoredCellsInterface>(emptyScoredCells);
    const [availableValues, setAvailableValues] = useState<AvailableValuesType>({});

    const handleLostGame = useCallback(() => {
        hapticImpact(ImpactFeedbackStyle.Heavy);

        // TODO: This needs improvement
        void dispatch(gameFinishedThunk({ difficulty, isWon: false }));

        router.replace('loser');
    }, [difficulty, dispatch, router]);

    const handleWonGame = useCallback(() => {
        hapticImpact(ImpactFeedbackStyle.Heavy);

        // TODO: This needs improvement
        void dispatch(gameFinishedThunk({ difficulty, isWon: true }));

        // TODO: We need to wait for the animation to finish, animation finish event would fix it?
        setTimeout(() => void router.replace('winner'), 10 * animationDurationConstant);
    }, [difficulty, dispatch, router]);

    useEffect(() => {
        // TODO: This needs improvement
        setDifficulty(routeDifficulty ?? DifficultyEnum.Newbie);

        // TODO: Do we need to save the game in the beginning?
        dispatch(gameStartAction({ sudokuString: sudokuRef.current.toString() }));

        // eslint-disable-next-line max-statements
        const subscription = sudokuRef.current.start$(routeDifficulty ?? DifficultyEnum.Newbie).subscribe(state => {
            setAvailableValues(state.availableValues);
            setScore(state.score);
            setGameField(state.gameField);
            setFullField(state.fullField);
            setScoredCells(state.scoredCells);
            setMistakes(state.mistakes);

            dispatch(
                gameSaveAction({
                    sudokuString: sudokuRef.current.toString(),
                    score: state.score,
                    mistakes: state.mistakes
                })
            );

            // TODO: This needs improvement - we can return event type from the logic: CorrectMove / Mistake / Won / Lost
            if (state.move === SudokuMoveEnum.Won) {
                handleWonGame();
            } else if (state.move === SudokuMoveEnum.Correct) {
                hapticNotification(Haptics.NotificationFeedbackType.Success);

                if (!sudokuRef.current.isValueAvailable(availableValues, state.cell)) {
                    // HINT: We leave cell selection if there are values left, otherwise loose focus
                    // eslint-disable-next-line no-undefined
                    setSelectedCell(undefined);
                }
            } else if (state.move === SudokuMoveEnum.Mistake) {
                hapticNotification(Haptics.NotificationFeedbackType.Error);
            } else if (state.move === SudokuMoveEnum.Lost) {
                handleLostGame();
            }
        });

        return () => void subscription.unsubscribe();
    }, [dispatch, routeDifficulty]);

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

    const handleSelectCell = useCallback((cell: CellInterface | undefined) => {
        setSelectedCell(cell);
        hapticImpact(ImpactFeedbackStyle.Light);
    }, []);
    const handleSelectValue = useCallback(
        (value: number) => {
            if (isDefined(selectedCell)) {
                sudokuRef.current.valueSelected$.next({ ...selectedCell, value });
            }
        },
        [selectedCell]
    );

    // TODO: MaxMistakes should come from sudoku?
    const maxMistakesReached = mistakes >= MaxMistakesConstant;
    const canSelectValue = sudokuRef.current.isBlankCell(selectedCell) && isDefined(selectedCell);
    const currentCorrectValue = sudokuRef.current.getCorrectValue(fullField, selectedCell);
    const mistakesCountTextStyles = [styles.mistakesCountText, cs(maxMistakesReached, styles.mistakesCountErrorText)];

    return (
        <SafeAreaView style={styles.container}>
            <PageHeader title="Be wise, be smart, be quick..." />

            <View style={styles.controls}>
                <View style={styles.controlsWrapper}>
                    <Text style={styles.headerText}>Mistakes</Text>
                    <Text style={styles.headerText}>
                        <Text style={mistakesCountTextStyles}>{mistakes}</Text> /{' '}
                        <Text style={styles.mistakesMaxText}>{MaxMistakesConstant}</Text>
                    </Text>
                </View>

                <View style={styles.controlsWrapper}>
                    <Text style={styles.headerText}>Score</Text>
                    <Text style={styles.scoreText}>{score}</Text>
                </View>
                <BlackButton onPress={handleExit} text="Exit" />
            </View>

            <Field
                field={gameField}
                onSelect={handleSelectCell}
                scoredCells={scoredCells}
                selectedCell={selectedCell}
                sudoku={sudokuRef.current}
            />

            <GameTimer />

            <AvailableValues
                availableValues={availableValues}
                currentCorrectValue={currentCorrectValue}
                {...(canSelectValue && { onSelectValue: handleSelectValue })}
            />
        </SafeAreaView>
    );
};
