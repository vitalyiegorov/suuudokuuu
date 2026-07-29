import { useLingui } from '@lingui/react/macro';
import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useRouter } from 'expo-router';
import { use, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Display, Hide } from 'react-native-unistyles';

import { isDefined } from '@rnw-community/shared';

import { Alert } from '../../../@generic/components/alert/alert';
import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { WideLayoutMediaQuery } from '../../../@generic/constants/layout-media-query.constant';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { useVibration } from '../../../@generic/hooks/use-vibration.hook';
import { ChallengeRaceHud } from '../../../challenge/components/challenge-race-hud/challenge-race-hud';
import { ChallengeRecordHud } from '../../../challenge/components/challenge-record-hud/challenge-record-hud';
import { ChallengeScreenshotRecorder } from '../../../challenge/components/challenge-screenshot-recorder/challenge-screenshot-recorder';
import { classifyTimelineMove } from '../../../challenge/utils/classify-timeline-move.util';
import { Field, FieldRef } from '../../../game/components/field/field';
import { GameTimerController } from '../../../game/components/game-timer-controller/game-timer-controller';
import { GameContext } from '../../../game/context/game.context';
import { useBoardCellSize } from '../../../game/hooks/use-board-cell-size.hook';
import { useKeyboardControls } from '../../../game/hooks/use-keyboard-controls/use-keyboard-controls.hook';
import { useShareGame } from '../../../game/hooks/use-share-game.hook';
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
    gameHasRivalSelector,
    gameInputModeSelector,
    gameIsChallengeRunSelector,
    gameMaxMistakesSelector,
    gameMistakesSelector,
    gameScoreSelector
} from '../../../game/store/game.selectors';
import { settingsKeySelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { gameScreenSetSharingAvailable } from '../../utils/game-screen-set-sharing-available.util';

import { GameActions } from './game-actions/game-actions';
import { GameInputTools } from './game-input-tools/game-input-tools';
import { GameNumpad } from './game-numpad/game-numpad';
import { GameScreenSelectors } from './game-screen.selectors';
import { GameScreenStyles as styles } from './game-screen.styles';
import { GameStatusBlock } from './game-status-block/game-status-block';
import { useOpenGameSettings } from './hooks/use-open-game-settings.hook';
import { gameScreenExit } from './utils/game-screen-exit.util';
import { gameScreenGetLostRoute, gameScreenGetWonRoute } from './utils/game-screen-get-result-route.util';

import type { AvailableValuesItemRef } from '../../../game/components/available-values-item/available-values-item';
import type { CellInterface, ScoredCellsInterface } from '@suuudokuuu/generator';
import type { SolutionTechniqueEnum } from '@suuudokuuu/solver';

// eslint-disable-next-line max-lines-per-function -- Game orchestration component requires many handlers and refs
export const GameScreen = () => {
    const router = useRouter();
    const { t } = useLingui();

    const { sudoku } = use(GameContext);
    const { theme } = use(ThemeContext);

    const [hapticNotification, hapticImpact] = useVibration();

    const { cellSize: boardCellSize, boardSize, onBoardAreaLayout } = useBoardCellSize();

    const dispatch = useAppDispatch();
    const score = useAppSelector(gameScoreSelector);
    const mistakes = useAppSelector(gameMistakesSelector);
    const maxMistakes = useAppSelector(gameMaxMistakesSelector);
    const hasTimer = useAppSelector(settingsKeySelector('hasTimer'));
    const keepActiveCell = useAppSelector(settingsKeySelector('keepActiveCell'));
    const isLeftHanded = useAppSelector(settingsKeySelector('isLeftHanded'));
    const inputMode = useAppSelector(gameInputModeSelector);
    const hasRival = useAppSelector(gameHasRivalSelector);
    const isChallengeRun = useAppSelector(gameIsChallengeRunSelector);
    const challengeTime = useAppSelector(gameChallengeTimeSelector);
    const elapsedTime = useAppSelector(gameElapsedTimeSelector);

    const availableValuesRefs = useRef<Record<number, AvailableValuesItemRef | null>>({});
    const fieldRef = useRef<FieldRef>(null);

    const [selectedCell, setSelectedCell] = useState<CellInterface>();
    const [hasSharing, setHasSharing] = useState(false);

    const maxMistakesReached = mistakes >= maxMistakes;

    useEffect(() => void gameScreenSetSharingAvailable(setHasSharing), []);

    const handleShare = useShareGame();
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

    const handlePause = () => {
        dispatch(gamePauseAction());
        router.replace('/pause');
    };

    const handleLostGame = () => {
        hapticImpact(ImpactFeedbackStyle.Heavy);

        dispatch(gameFinishAction({ difficulty: sudoku.Difficulty, isWon: false, isChallenge: hasRival }));

        router.replace(gameScreenGetLostRoute(hasRival));
    };

    const handleWonGame = () => {
        hapticImpact(ImpactFeedbackStyle.Heavy);

        const wonChallenge = hasRival && elapsedTime < challengeTime;

        dispatch(gameFinishAction({ difficulty: sudoku.Difficulty, isWon: true, isChallenge: wonChallenge }));

        // HINT: We need to wait for the animation to finish, animation finish event would fix it?
        setTimeout(() => void router.replace(gameScreenGetWonRoute(hasRival, wonChallenge)), 10 * animationDurationConstant);
    };

    const handleCorrectValue = (correctCell: CellInterface, newScoredCells: ScoredCellsInterface, technique: SolutionTechniqueEnum) => {
        dispatch(gameSaveAction({ sudoku, scoredCells: newScoredCells, correctCell, technique }));

        hapticNotification(Haptics.NotificationFeedbackType.Success);

        fieldRef.current?.triggerCellSuccess(correctCell);
        fieldRef.current?.triggerAnimation(newScoredCells);

        setSelectedCell(() => ({ ...correctCell }));
    };

    const handleWrongValue = (wrongCell: CellInterface) => {
        dispatch(gameMistakeAction(wrongCell));

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
            const technique = classifyTimelineMove(sudoku, newValueCell);
            const newScoredCells = sudoku.setCellValue(newValueCell);

            handleCorrectValue(newValueCell, newScoredCells, technique);

            if (newScoredCells.isWon) {
                handleWonGame();
            }
        } else {
            handleWrongValue(newValueCell);
        }
    };

    const handleSelectValue = (value: number) => {
        const isBlankCellSelected = sudoku.isBlankCell(selectedCell);

        if (isBlankCellSelected && isDefined(selectedCell)) {
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
    const gameActionsIconColor = theme.colors.surface.raisedText;

    const statusBlock = (
        <GameStatusBlock
            elapsedTime={elapsedTime}
            hasTimer={hasTimer}
            maxMistakes={maxMistakes}
            maxMistakesReached={maxMistakesReached}
            mistakes={mistakes}
            score={score}
        />
    );
    const shareAction = { ...(hasSharing && !isChallengeRun && { onShare: handleShare }) };
    const pauseAction = { ...(!isChallengeRun && { onPause: handlePause }) };
    const gameActions = (
        <GameActions actionIconColor={gameActionsIconColor} onExit={handleExit} onOpenSettings={handleOpenSettings} {...shareAction} />
    );
    const gameActionsWithPause = (
        <GameActions
            actionIconColor={gameActionsIconColor}
            onExit={handleExit}
            onOpenSettings={handleOpenSettings}
            {...pauseAction}
            {...shareAction}
        />
    );

    const challengeRunElements = isChallengeRun ? (
        <>
            <ChallengeScreenshotRecorder />
            {hasRival ? <ChallengeRaceHud /> : <ChallengeRecordHud />}
        </>
    ) : null;

    return (
        <Pressable
            accessible={false}
            {...(!keepActiveCell && { onPress: handleDeselectCell })}
            style={styles.container(isLeftHanded)}
            testID={GameScreenSelectors.Root}
        >
            <GameTimerController />
            {keyboardControlsElement}

            <Hide mq={WideLayoutMediaQuery}>
                <View style={styles.topBar}>
                    {statusBlock}
                    {gameActions}
                </View>
            </Hide>

            {challengeRunElements}

            <View onLayout={onBoardAreaLayout} style={styles.boardArea}>
                <Hide mq={WideLayoutMediaQuery}>
                    <View style={styles.boardSpacer} />
                </Hide>

                <Field cellSize={boardCellSize} onSelect={handleSelectCell} ref={fieldRef} selectedCell={selectedCell} />

                <Hide mq={WideLayoutMediaQuery}>
                    <View style={styles.toolsSlot}>
                        <GameInputTools hideAutoCandidates={hideAutoCandidates} />
                    </View>
                </Hide>
            </View>

            <View style={styles.panelArea(boardSize)}>
                <Display mq={WideLayoutMediaQuery}>{statusBlock}</Display>

                <View style={styles.panelInputArea}>
                    <GameNumpad
                        availableValuesRefsHandler={handleAvailableRef}
                        onSelectValue={handleSelectValue}
                        selectedCell={selectedCell}
                    />

                    <Display mq={WideLayoutMediaQuery}>
                        <GameInputTools hideAutoCandidates={hideAutoCandidates} />
                    </Display>
                </View>

                <Display mq={WideLayoutMediaQuery}>{gameActionsWithPause}</Display>
            </View>
        </Pressable>
    );
};
