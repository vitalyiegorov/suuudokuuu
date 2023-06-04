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
import { gameResetAction, gameResumeAction, gameStartAction } from '../../store/game.actions';
import { gameMistakesSelector, gameScoreSelector } from '../../store/game.selectors';
import { gameFinishedThunk } from '../../store/thunks/game-finish.thunk';
import { gameMistakeThunk } from '../../store/thunks/game-mistake.thunk';
import { gameSaveThunk } from '../../store/thunks/game-save.thunk';
import { AvailableValues } from '../available-values/available-values';
import { Field } from '../field/field';
import { GameTimer } from '../game-timer/game-timer';

import { GameScreenStyles as styles } from './game-screen.styles';

/**
 * We have inconsistency of state storage, field is coming from the url and score and mistakes from redux
 * we need to unify this approach
 */
// eslint-disable-next-line max-lines-per-function
export const GameScreen = () => {
    const router = useRouter();
    const { field: routeField, difficulty: routeDifficulty } = useLocalSearchParams<{ field?: string; difficulty?: DifficultyEnum }>();

    const dispatch = useAppDispatch();
    const score = useAppSelector(gameScoreSelector);
    const mistakes = useAppSelector(gameMistakesSelector);
    const sudokuRef = useRef<Sudoku>(new Sudoku(defaultSudokuConfig));

    const [field, setField] = useState<FieldInterface>([]);
    const [selectedCell, setSelectedCell] = useState<CellInterface>();
    const [scoredCells, setScoredCells] = useState<ScoredCellsInterface>(emptyScoredCells);

    const maxMistakesReached = mistakes >= MaxMistakesConstant;

    useEffect(() => {
        if (isNotEmptyString(routeField)) {
            sudokuRef.current = Sudoku.fromString(routeField, defaultSudokuConfig);
            dispatch(gameResumeAction());
        } else if (isNotEmptyString(routeDifficulty)) {
            sudokuRef.current.create(routeDifficulty);

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
                    router.replace('/');
                }
            }
        ]);
    };

    const handleSelectCell = useCallback((cell: CellInterface | undefined) => {
        setSelectedCell(cell);
        hapticImpact(ImpactFeedbackStyle.Light);
        // HINT: This is needed to clear animation on all cells
        setScoredCells(emptyScoredCells);
    }, []);

    const handleLostGame = useCallback(() => {
        hapticImpact(ImpactFeedbackStyle.Heavy);

        void dispatch(gameFinishedThunk({ difficulty: sudokuRef.current.Difficulty, isWon: false }));

        router.replace('loser');
    }, [dispatch, router]);

    const handleWonGame = useCallback(() => {
        hapticImpact(ImpactFeedbackStyle.Heavy);

        void dispatch(gameFinishedThunk({ difficulty: sudokuRef.current.Difficulty, isWon: true }));

        // TODO: We need to wait for the animation to finish, animation finish event would fix it?
        setTimeout(() => void router.replace('winner'), 10 * animationDurationConstant);
    }, [dispatch, router]);

    const handleCorrectValue = useCallback(
        // eslint-disable-next-line max-statements
        ([correctCell, newScoredCells]: [CellInterface, ScoredCellsInterface]) => {
            setScoredCells(newScoredCells);
            void dispatch(gameSaveThunk({ sudoku: sudokuRef.current, scoredCells: newScoredCells }));

            if (newScoredCells.isWon) {
                handleWonGame();
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
        },
        [dispatch, handleWonGame]
    );

    const handleWrongValue = useCallback(() => {
        void dispatch(gameMistakeThunk(sudokuRef.current));

        if (mistakes + 1 >= MaxMistakesConstant) {
            handleLostGame();
        } else {
            hapticNotification(Haptics.NotificationFeedbackType.Error);
        }
    }, [dispatch, handleLostGame, mistakes]);

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
