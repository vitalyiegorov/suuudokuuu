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
import { gameMoveAction, gameResetAction } from '../../store/game.actions';
import { gameStartedAtSelector } from '../../store/game.selectors';
import { AvailableValues } from '../available-values/available-values';
import { Field } from '../field/field';
import { GameTimer } from '../game-timer/game-timer';

import { GameScreenStyles as styles } from './game-screen.styles';

/**
 * TODO: Can passing SudokuGame instance values as component props rendering problems? =)
 */
// eslint-disable-next-line max-lines-per-function
export const GameScreen = () => {
    const router = useRouter();
    const { field: routeField, difficulty: routeDifficulty } = useLocalSearchParams<{ field?: string; difficulty?: DifficultyEnum }>();

    const dispatch = useAppDispatch();
    const startedAt = useAppSelector(gameStartedAtSelector);

    const sudokuRef = useRef<Sudoku>(new Sudoku(defaultSudokuConfig));

    const [field, setField] = useState<FieldInterface>([]);
    const [selectedCell, setSelectedCell] = useState<CellInterface>();
    const [scoredCells, setScoredCells] = useState<ScoredCellsInterface>(emptyScoredCells);
    const [mistakes, setMistakes] = useState(0);
    const [score, setScore] = useState(0);

    const maxMistakesReached = mistakes >= MaxMistakesConstant;

    useEffect(() => {
        if (isNotEmptyString(routeField)) {
            sudokuRef.current = Sudoku.fromString(routeField, defaultSudokuConfig);
        } else if (isNotEmptyString(routeDifficulty)) {
            sudokuRef.current.create(routeDifficulty);
        }
        setField(sudokuRef.current.Field);
    }, [routeField, routeDifficulty]);

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
        ([correctCell, newScoredCells]: [CellInterface, ScoredCellsInterface]) => {
            hapticNotification(Haptics.NotificationFeedbackType.Success);
            setScoredCells(newScoredCells);
            setScore(prevScore => prevScore + sudokuRef.current.scoring.calculate(newScoredCells, mistakes, startedAt));

            dispatch(gameMoveAction(sudokuRef.current.toString()));

            if (newScoredCells.isWon) {
                // TODO: We need to wait for the animation to finish, animation finish event would fix it?
                setTimeout(() => void router.push('winner'), 10 * animationDurationConstant);
            } else if (sudokuRef.current.isValueAvailable(correctCell)) {
                // HINT: We reselect cell if there are values left, otherwise loose focus
                setSelectedCell(() => ({ ...correctCell }));
            } else {
                // HINT: Otherwise we loose focus
                // eslint-disable-next-line no-undefined
                setSelectedCell(undefined);
            }
        },
        [dispatch, mistakes, router, startedAt]
    );
    const handleWrongValue = useCallback(() => {
        if (mistakes < MaxMistakesConstant) {
            hapticNotification(Haptics.NotificationFeedbackType.Error);
            setMistakes(prevState => prevState + 1);
        } else {
            hapticImpact(ImpactFeedbackStyle.Heavy);
            router.push('loser');
        }
    }, [mistakes, router]);

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

            <GameTimer startedAt={startedAt} />

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
