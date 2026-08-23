import { useLingui } from '@lingui/react/macro';
import { useAppLayout } from '@suuudokuuu/ui';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useRouter } from 'expo-router';
import { use, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Alert } from '../../../@generic/components/alert/alert';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { useVibration } from '../../../@generic/hooks/use-vibration.hook';
import { ChallengeRaceHud } from '../../../challenge/components/challenge-race-hud/challenge-race-hud';
import { ChallengeRecordHud } from '../../../challenge/components/challenge-record-hud/challenge-record-hud';
import { ChallengeScreenshotRecorder } from '../../../challenge/components/challenge-screenshot-recorder/challenge-screenshot-recorder';
import { Field, FieldRef } from '../../../game/components/field/field';
import { GameTimerController } from '../../../game/components/game-timer-controller/game-timer-controller';
import { HintPanel } from '../../../game/components/hint-panel/hint-panel';
import { GameToolsSlotReservedHeightConstant } from '../../../game/constant/board-cell-size.constant';
import { GameContext } from '../../../game/context/game.context';
import { useBoardGeometry } from '../../../game/hooks/use-board-geometry.hook';
import { useKeyboardControls } from '../../../game/hooks/use-keyboard-controls/use-keyboard-controls.hook';
import { useShareGame } from '../../../game/hooks/use-share-game.hook';
import { gamePauseAction, gameResetAction, gameToggleCellCandidateAction } from '../../../game/store/game.actions';
import {
    gameElapsedTimeSelector,
    gameHasRivalSelector,
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
import { useGameEngineEvents } from './hooks/use-game-engine-events.hook';
import { useOpenGameSettings } from './hooks/use-open-game-settings.hook';
import { gameScreenExit } from './utils/game-screen-exit.util';

import type { AvailableValuesItemRef } from '../../../game/components/available-values-item/available-values-item';
import type { CellInterface } from '@suuudokuuu/generator';

// eslint-disable-next-line max-lines-per-function -- Game orchestration component requires many handlers and refs
export const GameScreen = () => {
    const router = useRouter();
    const { t } = useLingui();

    const { engine, snapshot } = use(GameContext);
    const { theme } = use(ThemeContext);

    const [, hapticImpact] = useVibration();

    const { sizeClass } = useAppLayout();
    const isWideLayout = sizeClass === 'wide';
    const reservedBoardHeight = isWideLayout ? 0 : GameToolsSlotReservedHeightConstant;
    const { cellSize: boardCellSize, cellMargin: boardCellMargin, boardSize, onBoardAreaLayout } = useBoardGeometry(reservedBoardHeight);
    const dispatch = useAppDispatch();
    const score = useAppSelector(gameScoreSelector);
    const mistakes = useAppSelector(gameMistakesSelector);
    const maxMistakes = useAppSelector(gameMaxMistakesSelector);
    const hasTimer = useAppSelector(settingsKeySelector('hasTimer'));
    const keepActiveCell = useAppSelector(settingsKeySelector('keepActiveCell'));
    const isLeftHanded = useAppSelector(settingsKeySelector('isLeftHanded'));
    const hasRival = useAppSelector(gameHasRivalSelector);
    const isChallengeRun = useAppSelector(gameIsChallengeRunSelector);
    const elapsedTime = useAppSelector(gameElapsedTimeSelector);

    const availableValuesRefs = useRef<Record<number, AvailableValuesItemRef | null>>({});
    const fieldRef = useRef<FieldRef>(null);

    const [hasSharing, setHasSharing] = useState(false);

    const { selectedCell } = snapshot;
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
        engine.selectCell(cell);
        hapticImpact(ImpactFeedbackStyle.Light);
    };

    const handleDeselectCell = () => {
        engine.selectCell();
    };

    const handlePause = () => {
        dispatch(gamePauseAction());
        router.replace('/pause');
    };

    const handleSelectValue = (value: number) => {
        const targetCell = snapshot.selectedCell;

        if (!engine.Sudoku.isBlankCell(targetCell)) {
            return;
        }

        availableValuesRefs.current[value]?.triggerAnimation();

        if (snapshot.inputMode === 'candidate') {
            engine.toggleCandidate(targetCell, value);
            dispatch(gameToggleCellCandidateAction({ ...targetCell, value }));
            hapticImpact(ImpactFeedbackStyle.Light);
        } else {
            engine.inputValue(value);
        }
    };

    const handleAvailableRef = (value: number) => (ref: AvailableValuesItemRef | null) => {
        availableValuesRefs.current[value] = ref;
    };

    useGameEngineEvents(fieldRef);

    const keyboardControlsElement = useKeyboardControls(engine, selectedCell, handleSelectCell, handleSelectValue, handleExit);

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
    const challengeHudContent = hasRival ? <ChallengeRaceHud /> : <ChallengeRecordHud />;
    const challengeRecorder = isChallengeRun ? <ChallengeScreenshotRecorder /> : null;
    const challengeHud = isChallengeRun ? challengeHudContent : null;

    return (
        <Pressable
            accessible={false}
            {...(!keepActiveCell && { onPress: handleDeselectCell })}
            style={styles.container}
            tabIndex={-1}
            testID={GameScreenSelectors.Root}
        >
            <GameTimerController />
            {keyboardControlsElement}

            {challengeRecorder}
            {isWideLayout ? null : (
                <View style={styles.topBar}>
                    {statusBlock}
                    {gameActions}
                </View>
            )}

            {isWideLayout ? null : challengeHud}

            <View style={styles.gameRow(isLeftHanded)}>
                <View onLayout={onBoardAreaLayout} style={styles.boardArea}>
                    {isWideLayout ? null : <View style={styles.boardSpacer} />}

                    <Field cellMargin={boardCellMargin} cellSize={boardCellSize} onSelect={handleSelectCell} ref={fieldRef} />

                    {isWideLayout ? null : (
                        <View style={styles.toolsSlot}>
                            <GameInputTools hideAutoCandidates={hideAutoCandidates} />
                        </View>
                    )}
                </View>

                <View style={styles.panelArea(boardSize)}>
                    {isWideLayout ? statusBlock : null}

                    {isWideLayout ? challengeHud : null}

                    <View style={styles.panelInputArea}>
                        <GameNumpad
                            availableValuesRefsHandler={handleAvailableRef}
                            onSelectValue={handleSelectValue}
                            selectedCell={selectedCell}
                        />

                        {isWideLayout ? <GameInputTools hideAutoCandidates={hideAutoCandidates} /> : null}
                    </View>

                    {isWideLayout ? gameActionsWithPause : null}
                </View>
            </View>

            <HintPanel />
        </Pressable>
    );
};
