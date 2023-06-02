import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cs, isNotEmptyString } from '@rnw-community/shared';

import {
    Alert,
    BlackButton,
    type DifficultyEnum,
    PageHeader,
    animationDurationConstant,
    hapticImpact,
    hapticNotification,
    useAppDispatch,
    useAppSelector
} from '../../../@generic';
import type { CellInterface, FieldInterface, ScoredCellsInterface } from '../../../@logic';
import { MaxMistakesConstant, Sudoku, defaultSudokuConfig, emptyScoredCells } from '../../../@logic';
import { gameFinishAction, gameResetAction, gameResumeAction, gameSaveAction, gameStartAction } from '../../store/game.actions';
import { gameElapsedTimeSelector, gameMistakesSelector, gameScoreSelector } from '../../store/game.selectors';
import { AvailableValues } from '../available-values/available-values';
import { Field } from '../field/field';
import { GameTimer } from '../game-timer/game-timer';

import { GameScreenStyles as styles } from './game-screen.styles';

// eslint-disable-next-line max-lines-per-function
export const GameScreen = () => {
    const router = useRouter();
    const { field: routeField, difficulty: routeDifficulty } = useLocalSearchParams<{ field?: string; difficulty?: DifficultyEnum }>();

    const dispatch = useAppDispatch();
    const savedScore = useAppSelector(gameScoreSelector);
    const savedMistakes = useAppSelector(gameMistakesSelector);
    // TODO: Due to time ticking we render component every second
    const savedTime = useAppSelector(gameElapsedTimeSelector);

    const sudokuRef = useRef<Sudoku>(new Sudoku(defaultSudokuConfig));

    const [field, setField] = useState<FieldInterface>([]);
    const [selectedCell, setSelectedCell] = useState<CellInterface>();
    const [scoredCells, setScoredCells] = useState<ScoredCellsInterface>(emptyScoredCells);
    const [mistakes, setMistakes] = useState(savedMistakes);
    const [score, setScore] = useState(savedScore);

    const maxMistakesReached = mistakes > MaxMistakesConstant;

    useEffect(() => {
        if (isNotEmptyString(routeField)) {
            sudokuRef.current = Sudoku.fromString(routeField, defaultSudokuConfig);
            dispatch(gameResumeAction());
        } else if (isNotEmptyString(routeDifficulty)) {
            sudokuRef.current.create(routeDifficulty);

            setScore(0);
            setMistakes(0);
            // eslint-disable-next-line no-undefined
            setSelectedCell(undefined);

            dispatch(gameStartAction({ sudokuString: sudokuRef.current.toString() }));
        }

        setField(sudokuRef.current.Field);
    }, [routeField, routeDifficulty, dispatch]);

    const handleExit = () => {
        Alert('Stop current run?', 'All progress will be lost', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'OK',
                onPress: () => {
                    // TODO: do we need to reset internal component state?
                    dispatch(gameResetAction());
                    router.push('/');
                }
            }
        ]);
    };

    const handleSelectCell = useCallback((cell: CellInterface | undefined) => {
        setSelectedCell(cell);
        // HINT: This is needed to clear animation on all cells
        setScoredCells(emptyScoredCells);
    }, []);
    const handleCorrectValue = useCallback(
        // eslint-disable-next-line max-statements
        ([correctCell, newScoredCells]: [CellInterface, ScoredCellsInterface]) => {
            const newScore = score + sudokuRef.current.getScore(newScoredCells, savedTime, mistakes);
            const sudokuString = sudokuRef.current.toString();

            setScoredCells(newScoredCells);
            setScore(newScore);

            if (newScoredCells.isWon) {
                Array(3).forEach(() => void hapticImpact(ImpactFeedbackStyle.Heavy));
                dispatch(
                    gameFinishAction({
                        difficulty: sudokuRef.current.Difficulty,
                        elapsedTime: savedTime,
                        score: newScore,
                        isWon: true
                    })
                );

                // TODO: We need to wait for the animation to finish, animation finish event would fix it?
                setTimeout(() => void router.push('winner'), 10 * animationDurationConstant);
            } else {
                hapticNotification(Haptics.NotificationFeedbackType.Success);

                if (sudokuRef.current.isValueAvailable(correctCell)) {
                    // HINT: We reselect cell if there are values left, otherwise loose focus
                    setSelectedCell(() => ({ ...correctCell }));
                } else {
                    // HINT: Otherwise we loose focus
                    // eslint-disable-next-line no-undefined
                    setSelectedCell(undefined);
                }
            }

            dispatch(gameSaveAction({ newScore, sudokuString, mistakes }));
        },
        [dispatch, mistakes, router, score, savedTime]
    );
    const handleWrongValue = useCallback(() => {
        const sudokuString = sudokuRef.current.toString();
        const newMistakes = mistakes + 1;

        if (newMistakes < MaxMistakesConstant) {
            hapticNotification(Haptics.NotificationFeedbackType.Error);
            setMistakes(newMistakes);
        } else {
            dispatch(
                gameFinishAction({
                    score,
                    difficulty: sudokuRef.current.Difficulty,
                    elapsedTime: savedTime,
                    isWon: false
                })
            );
            hapticImpact(ImpactFeedbackStyle.Heavy);
            router.push('loser');
        }

        dispatch(gameSaveAction({ sudokuString, newScore: score, mistakes: newMistakes }));
    }, [dispatch, mistakes, router, savedTime, score]);

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
                field={field}
                onSelect={handleSelectCell}
                scoredCells={scoredCells}
                selectedCell={selectedCell}
                sudoku={sudokuRef.current}
            />

            <GameTimer />

            <AvailableValues
                onCorrectValue={handleCorrectValue}
                onWrongValue={handleWrongValue}
                possibleValues={sudokuRef.current.PossibleValues}
                selectedCell={selectedCell}
                sudoku={sudokuRef.current}
            />
        </SafeAreaView>
    );
};
