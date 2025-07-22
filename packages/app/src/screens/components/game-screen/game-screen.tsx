import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useRouter } from 'expo-router';
import { use, useCallback, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';

import { cs } from '@rnw-community/shared';

import { Alert } from '../../../@generic/components/alert/alert';
import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { hapticImpact, hapticNotification } from '../../../@generic/utils/haptic/haptic.util';
import { AvailableValuesItem, type AvailableValuesItemRef } from '../../../game/components/available-values-item/available-values-item';
import { Field, type FieldRef } from '../../../game/components/field/field';
import { GameTimer } from '../../../game/components/game-timer/game-timer';
import { GameContext } from '../../../game/context/game.context';
import { useKeyboardControls } from '../../../game/hooks/use-keyboard-controls/use-keyboard-controls.hook';
import { gameResetAction } from '../../../game/store/game.actions';
import { gameMistakesSelector, gameScoreSelector } from '../../../game/store/game.selectors';
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

    const [selectedCell, setSelectedCell] = useState<CellInterface>();
    const [animatedScoredCells, setAnimatedScoredCells] = useState<ScoredCellsInterface>();
    const availableValuesRefs = useRef<Record<number, AvailableValuesItemRef | null>>({});
    const fieldRef = useRef<FieldRef>(null);
    
    // Single shared animation value for all cells
    const cellAnimation = useSharedValue(0);

    const maxMistakesReached = mistakes >= MaxMistakesConstant;

    const handleExit = useCallback(() => {
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
    }, [dispatch, router]);

    const handleSelectCell = useCallback((cell: CellInterface | undefined) => {
        setSelectedCell(cell);
        hapticImpact(ImpactFeedbackStyle.Light);
    }, []);

    const handleLostGame = useCallback(() => {
        hapticImpact(ImpactFeedbackStyle.Heavy);

        void dispatch(gameFinishedThunk({ difficulty: sudoku.Difficulty, isWon: false }));

        router.replace('loser');
    }, [dispatch, router, sudoku.Difficulty]);

const ANIMATION_DELAY_MULTIPLIER = 5;

    const handleWonGame = useCallback(() => {
        hapticImpact(ImpactFeedbackStyle.Heavy);

        void dispatch(gameFinishedThunk({ difficulty: sudoku.Difficulty, isWon: true }));

        // TODO: We need to wait for the animation to finish, animation finish event would fix it?
        setTimeout(() => void router.replace('winner'), ANIMATION_DELAY_MULTIPLIER * animationDurationConstant);
    }, [dispatch, router, sudoku.Difficulty]);

    // eslint-disable-next-line max-statements
    const handleCorrectValue = (correctCell: CellInterface, newScoredCells: ScoredCellsInterface) => {
        // Set the scored cells that should animate
        setAnimatedScoredCells(newScoredCells);
        
        // Trigger single animation for all cells
        cellAnimation.value = withTiming(1, { duration: 2 * animationDurationConstant }, finished => {
            if (finished === true) {
                cellAnimation.value = 0;
                setAnimatedScoredCells(undefined);
            }
        });
        
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

    const handleAvailableRef = useCallback((value: number) => (ref: AvailableValuesItemRef | null) => {
        availableValuesRefs.current[value] = ref;
    }, []);

    useKeyboardControls(sudoku, selectedCell, handleSelectCell, handleSelectValue);

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
                animatedScoredCells={animatedScoredCells} 
                cellAnimation={cellAnimation} 
                onSelect={handleSelectCell}
                ref={fieldRef}
                selectedCell={selectedCell}
            />

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
