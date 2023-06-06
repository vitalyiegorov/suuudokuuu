import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cs, isDefined, isNotEmptyString } from '@rnw-community/shared';

import {
    Alert,
    BlackButton,
    DifficultyEnum,
    PageHeader,
    animationDurationConstant,
    hapticImpact,
    hapticNotification,
    useAppDispatch
} from '../../../@generic';
import type { CellInterface, FieldInterface, ScoredCellsInterface } from '../../../@logic';
import { Sudoku, SudokuMoveEnum, defaultSudokuConfig, emptyScoredCells } from '../../../@logic';
import { type AvailableValuesType } from '../../../@logic/types/available-values.type';
import { gameResetAction, gameSaveAction } from '../../store/game.actions';
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
 */
// eslint-disable-next-line max-lines-per-function
export const GameScreen = () => {
    const router = useRouter();
    const { field: routeField, difficulty: routeDifficulty } = useLocalSearchParams<{ field?: string; difficulty?: DifficultyEnum }>();

    const dispatch = useAppDispatch();

    const sudokuRef = useRef<Sudoku>(new Sudoku(defaultSudokuConfig));

    const [gameField, setGameField] = useState<FieldInterface>([]);
    const [fullField, setFullField] = useState<FieldInterface>([]);
    const [score, setScore] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [maxMistakes, setMaxMistakes] = useState(0);
    const [selectedCell, setSelectedCell] = useState<CellInterface>();
    const [scoredCells, setScoredCells] = useState<ScoredCellsInterface>(emptyScoredCells);
    const [availableValues, setAvailableValues] = useState<AvailableValuesType>({});

    useEffect(() => {
        const sudokuState = isNotEmptyString(routeField)
            ? Sudoku.fromString(routeField)
            : sudokuRef.current.newGame(routeDifficulty ?? DifficultyEnum.Newbie);

        console.log(routeField);

        // eslint-disable-next-line max-statements
        const subscription = sudokuRef.current.start$(sudokuState).subscribe(state => {
            setAvailableValues(state.availableValues);
            setScore(state.score);
            setGameField(state.gameField);
            setFullField(state.fullField);
            setScoredCells(state.scoredCells);
            setMistakes(state.mistakes);
            setMaxMistakes(state.maxMistakes);

            dispatch(gameSaveAction(Sudoku.toString(state)));

            if (state.move === SudokuMoveEnum.Correct) {
                hapticNotification(Haptics.NotificationFeedbackType.Success);

                if (!state.hasMoreValues) {
                    // HINT: We leave cell selection if there are values left, otherwise loose focus
                    // eslint-disable-next-line no-undefined
                    setSelectedCell(undefined);
                }
            } else if (state.move === SudokuMoveEnum.Mistake) {
                hapticNotification(Haptics.NotificationFeedbackType.Error);
            } else if (state.move === SudokuMoveEnum.Won) {
                hapticImpact(ImpactFeedbackStyle.Heavy);

                // TODO: This needs improvement
                void dispatch(gameFinishedThunk({ difficulty: state.difficulty, isWon: true }));

                // TODO: We need to wait for the animation to finish, animation finish event would fix it?
                setTimeout(() => void router.replace('winner'), 10 * animationDurationConstant);
            } else if (state.move === SudokuMoveEnum.Lost) {
                hapticImpact(ImpactFeedbackStyle.Heavy);

                // TODO: This needs improvement
                void dispatch(gameFinishedThunk({ difficulty: state.difficulty, isWon: false }));

                router.replace('loser');
            }
        });

        return () => void subscription.unsubscribe();
        // TODO: Cannot pass router as dependency, it will cause infinite loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, routeDifficulty, routeField]);

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

    const maxMistakesReached = mistakes >= maxMistakes;
    const canSelectValue = sudokuRef.current.isBlankCell(selectedCell);
    const currentCorrectValue = sudokuRef.current.getCorrectValue(fullField, selectedCell);
    const mistakesCountTextStyles = [styles.mistakesCountText, cs(maxMistakesReached, styles.mistakesCountErrorText)];

    return (
        <SafeAreaView style={styles.container}>
            <PageHeader title="Be wise, be smart, be quick..." />

            <View style={styles.controls}>
                <View style={styles.controlsWrapper}>
                    <Text style={styles.headerText}>Mistakes</Text>
                    <Text style={styles.headerText}>
                        <Text style={mistakesCountTextStyles}>{mistakes}</Text> / <Text style={styles.mistakesMaxText}>{maxMistakes}</Text>
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
