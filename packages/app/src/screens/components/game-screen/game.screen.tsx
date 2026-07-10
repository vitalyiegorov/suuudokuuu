import { useLingui } from '@lingui/react/macro';
import { useAppLayout } from '@suuudokuuu/ui';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useRouter } from 'expo-router';
import { use, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Alert } from '../../../@generic/components/alert/alert';
import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { useVibration } from '../../../@generic/hooks/use-vibration.hook';
import { ChallengeProgressBar } from '../../../challenge/components/challenge-progress-bar/challenge-progress-bar';
import { Field, FieldRef } from '../../../game/components/field/field';
import { GameTimerController } from '../../../game/components/game-timer-controller/game-timer-controller';
import { GameContext } from '../../../game/context/game.context';
import { useBoardCellSize } from '../../../game/hooks/use-board-cell-size.hook';
import { useKeyboardControls } from '../../../game/hooks/use-keyboard-controls/use-keyboard-controls.hook';
import { useSharePuzzle } from '../../../game/hooks/use-share-puzzle/use-share-puzzle.hook';
import {
    gameFinishAction,
    gameMistakeAction,
    gamePauseAction,
    gameResetAction,
    gameSaveAction,
    gameToggleCellCandidateAction
} from '../../../game/store/game.actions';
import {
    gameChallengeTimeSelector,
    gameElapsedTimeSelector,
    gameInputModeSelector,
    gameIsChallengeModeSelector,
    gameMaxMistakesSelector,
    gameMistakesSelector,
    gameScoreSelector
} from '../../../game/store/game.selectors';
import { settingsKeySelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { gameScreenSetSharingAvailable } from '../../utils/game-screen-set-sharing-available.util';

import { GameScreenSelectors } from './game-screen.selectors';
import { GameScreenStyles as styles } from './game-screen.styles';
import { GameSidePanel } from './game-side-panel/game-side-panel';
import { useOpenGameSettings } from './hooks/use-open-game-settings.hook';
import { gameScreenExit } from './utils/game-screen-exit.util';

import type { AvailableValuesItemRef } from '../../../game/components/available-values-item/available-values-item';
import type { CellInterface, ScoredCellsInterface } from '@suuudokuuu/generator';
import type { LayoutChangeEvent } from 'react-native';

// eslint-disable-next-line max-lines-per-function -- Game orchestration component requires many handlers and refs
export const GameScreen = () => {
    const router = useRouter();
    const { t } = useLingui();

    const { sudoku } = use(GameContext);
    const { theme } = use(ThemeContext);

    const [hapticNotification, hapticImpact] = useVibration();

    const { sizeClass } = useAppLayout();
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const boardCellSize = useBoardCellSize(containerSize.width, containerSize.height);

    const dispatch = useAppDispatch();
    const score = useAppSelector(gameScoreSelector);
    const mistakes = useAppSelector(gameMistakesSelector);
    const maxMistakes = useAppSelector(gameMaxMistakesSelector);
    const hasTimer = useAppSelector(settingsKeySelector('hasTimer'));
    const keepActiveCell = useAppSelector(settingsKeySelector('keepActiveCell'));
    const inputMode = useAppSelector(gameInputModeSelector);
    const isChallengeMode = useAppSelector(gameIsChallengeModeSelector);
    const challengeTime = useAppSelector(gameChallengeTimeSelector);
    const elapsedTime = useAppSelector(gameElapsedTimeSelector);

    const availableValuesRefs = useRef<Record<number, AvailableValuesItemRef | null>>({});
    const fieldRef = useRef<FieldRef>(null);

    const [selectedCell, setSelectedCell] = useState<CellInterface>();
    const [hasSharing, setHasSharing] = useState(false);

    const maxMistakesReached = mistakes >= maxMistakes;

    useEffect(() => void gameScreenSetSharingAvailable(setHasSharing), []);

    const handleShare = useSharePuzzle();
    const handleOpenSettings = useOpenGameSettings();

    const handleConfirmedExit = () =>
        void gameScreenExit(
            () => dispatch(gameResetAction()),
            homeHref => void router.dismissTo(homeHref)
        );
    const handleExit = () => {
        Alert(t`Stop current run?`, t`All progress will be lost`, [
            { text: t`Cancel`, style: 'cancel' },
            { text: t`OK`, onPress: handleConfirmedExit }
        ]);
    };

    const handleSelectCell = (cell: CellInterface | undefined) => {
        setSelectedCell(cell);
        hapticImpact(ImpactFeedbackStyle.Light);
    };

    const handleDeselectCell = () => {
        // eslint-disable-next-line no-undefined
        setSelectedCell(undefined);
    };

    const handleContainerLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;

        setContainerSize({ width, height });
    };

    const handlePause = () => {
        dispatch(gamePauseAction());
        router.replace('/pause');
    };

    const handleLostGame = () => {
        hapticImpact(ImpactFeedbackStyle.Heavy);

        dispatch(gameFinishAction({ difficulty: sudoku.Difficulty, isWon: false, isChallenge: isChallengeMode }));

        router.replace(isChallengeMode ? '/challenge-lost' : '/loser');
    };

    const handleWonGame = () => {
        hapticImpact(ImpactFeedbackStyle.Heavy);

        const wonChallenge = isChallengeMode && elapsedTime < challengeTime;

        dispatch(gameFinishAction({ difficulty: sudoku.Difficulty, isWon: true, isChallenge: wonChallenge }));

        // HINT: We need to wait for the animation to finish, animation finish event would fix it?
        setTimeout(() => {
            if (isChallengeMode) {
                router.replace(wonChallenge ? '/challenge-won' : '/challenge-lost');
            } else {
                router.replace('/winner');
            }
        }, 10 * animationDurationConstant);
    };

    const handleCorrectValue = (correctCell: CellInterface, newScoredCells: ScoredCellsInterface) => {
        dispatch(gameSaveAction({ sudoku, scoredCells: newScoredCells, correctCell }));

        hapticNotification(Haptics.NotificationFeedbackType.Success);

        fieldRef.current?.triggerAnimation(newScoredCells);

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

    const keyboardControlsElement = useKeyboardControls(sudoku, selectedCell, handleSelectCell, handleSelectValue, handleExit);

    const hideAutoCandidates = maxMistakes === 0;
    const actionIconColor = theme.colors.label.main;

    const sidePanel = (
        <GameSidePanel
            actionIconColor={actionIconColor}
            availableValuesRefsHandler={handleAvailableRef}
            elapsedTime={elapsedTime}
            hasSharing={hasSharing}
            hasTimer={hasTimer}
            hideAutoCandidates={hideAutoCandidates}
            maxMistakes={maxMistakes}
            maxMistakesReached={maxMistakesReached}
            mistakes={mistakes}
            onExit={handleExit}
            onOpenSettings={handleOpenSettings}
            onPause={handlePause}
            onSelectValue={handleSelectValue}
            onShare={handleShare}
            score={score}
            selectedCell={selectedCell}
        />
    );

    return (
        <Pressable
            accessible={false}
            {...(!keepActiveCell && { onPress: handleDeselectCell })}
            onLayout={handleContainerLayout}
            style={styles.container(sizeClass)}
            testID={GameScreenSelectors.Root}
        >
            <GameTimerController />
            {keyboardControlsElement}
            {isChallengeMode && <ChallengeProgressBar />}
            <View style={styles.boardArea(sizeClass)}>
                <Field cellSize={boardCellSize} onSelect={handleSelectCell} ref={fieldRef} selectedCell={selectedCell} />
            </View>
            <View style={styles.panelArea(sizeClass)}>{sidePanel}</View>
        </Pressable>
    );
};
