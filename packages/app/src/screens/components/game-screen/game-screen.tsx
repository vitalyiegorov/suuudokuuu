import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';

import { cs, isNotEmptyString } from '@rnw-community/shared';

import { Alert } from '../../../@generic/components/alert/alert';
import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { hapticImpact, hapticNotification } from '../../../@generic/utils/haptic/haptic.util';
import { AvailableValuesItem, type AvailableValuesItemRef } from '../../../game/components/available-values-item/available-values-item';
import { Field, type FieldRef } from '../../../game/components/field/field';
import { GameTimer } from '../../../game/components/game-timer/game-timer';
import { useKeyboardControls } from '../../../game/hooks/use-keyboard-controls/use-keyboard-controls.hook';
import { gameResetAction, gameResumeAction, gameStartAction } from '../../../game/store/game.actions';
import { gameMistakesSelector, gameScoreSelector } from '../../../game/store/game.selectors';
import { gameFinishedThunk } from '../../../game/store/thunks/game-finish.thunk';
import { gameMistakeThunk } from '../../../game/store/thunks/game-mistake.thunk';
import { gameSaveThunk } from '../../../game/store/thunks/game-save.thunk';

import { GameScreenStyles as styles } from './game-screen.styles';

import type { CellInterface, DifficultyEnum, FieldInterface, ScoredCellsInterface } from '@suuudokuuu/generator';

const MaxMistakesConstant = 3;

interface Props {
    readonly routeField: string | undefined;
    readonly routeDifficulty: DifficultyEnum | undefined;
}

/**
 * TODO: We have inconsistency of state storage, field is coming from the url and score and mistakes from redux
 * we need to unify this approach
 */
// eslint-disable-next-line max-lines-per-function
export const GameScreen = ({ routeField, routeDifficulty }: Props) => {
    const router = useRouter();

    const dispatch = useAppDispatch();
    const score = useAppSelector(gameScoreSelector);
    const mistakes = useAppSelector(gameMistakesSelector);
    const sudokuRef = useRef<Sudoku>(new Sudoku(defaultSudokuConfig));

    const [field, setField] = useState<FieldInterface>([]);
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

        void dispatch(gameFinishedThunk({ difficulty: sudokuRef.current.Difficulty, isWon: false }));

        router.replace('loser');
    };

    const handleWonGame = () => {
        hapticImpact(ImpactFeedbackStyle.Heavy);

        void dispatch(gameFinishedThunk({ difficulty: sudokuRef.current.Difficulty, isWon: true }));

        // TODO: We need to wait for the animation to finish, animation finish event would fix it?
        setTimeout(() => void router.replace('winner'), 10 * animationDurationConstant);
    };

    // eslint-disable-next-line max-statements
    const handleCorrectValue = (correctCell: CellInterface, newScoredCells: ScoredCellsInterface) => {
        fieldRef.current?.triggerCellAnimations(newScoredCells);
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
    };

    const handleWrongValue = () => {
        void dispatch(gameMistakeThunk(sudokuRef.current));

        if (mistakes + 1 >= MaxMistakesConstant) {
            handleLostGame();
        } else {
            hapticNotification(Haptics.NotificationFeedbackType.Error);
        }
    };

    const handleSelectValue = (value: number) => {
        const isBlankCellSelected = sudokuRef.current.isBlankCell(selectedCell);

        if (isBlankCellSelected) {
            availableValuesRefs.current[value]?.triggerAnimation();

            const newValueCell = { ...selectedCell, value };
            if (sudokuRef.current.isCorrectValue(newValueCell)) {
                handleCorrectValue(selectedCell, sudokuRef.current.setCellValue(newValueCell));
            } else {
                handleWrongValue();
            }
        }
    };

    const handleAvailableRef = (value: number) => (ref: AvailableValuesItemRef | null) => {
        availableValuesRefs.current[value] = ref;
    };

    useEffect(() => {
        if (isNotEmptyString(routeField)) {
            try {
                sudokuRef.current = Sudoku.fromString(routeField, defaultSudokuConfig);
                dispatch(gameResumeAction());
            } catch (_error) {
                Alert('Invalid game link', 'The game link is corrupted or invalid. Redirecting to home.', [
                    {
                        text: 'OK',
                        onPress: () => {
                            router.replace('/');
                        }
                    }
                ]);

                return;
            }
        } else if (isNotEmptyString(routeDifficulty)) {
            sudokuRef.current.create(routeDifficulty);

            // eslint-disable-next-line no-undefined
            setSelectedCell(undefined);

            dispatch(gameStartAction({ sudokuString: sudokuRef.current.toString() }));
        }

        setField(sudokuRef.current.Field);
    }, [routeField, routeDifficulty, dispatch, router]);
    useKeyboardControls(sudokuRef.current, selectedCell, handleSelectCell, handleSelectValue);

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

                <BlackButton onPress={handleExit} text="Exit" />
            </View>

            <Field
                field={field}
                onSelect={handleSelectCell}
                ref={fieldRef}
                selectedCell={selectedCell}
                /* eslint-disable-next-line react-compiler/react-compiler */
                sudoku={sudokuRef.current}
            />

            <GameTimer />

            <View style={styles.availableValuesWrapper}>
                {/* eslint-disable-next-line react-compiler/react-compiler */}
                {sudokuRef.current.PossibleValues.map(value => (
                    <AvailableValuesItem
                        canPress={sudokuRef.current.isBlankCell(selectedCell)}
                        correctValue={sudokuRef.current.getCorrectValue(selectedCell)}
                        isActive={false}
                        key={`possible-value-${value}`}
                        onSelect={handleSelectValue}
                        /* eslint-disable-next-line react-compiler/react-compiler */
                        progress={sudokuRef.current.getValueProgress(value)}
                        ref={handleAvailableRef(value)}
                        value={value}
                    />
                ))}
            </View>
        </View>
    );
};
