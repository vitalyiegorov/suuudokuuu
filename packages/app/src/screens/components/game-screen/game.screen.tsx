import { useLingui } from '@lingui/react/macro';
import { useAppLayout } from '@suuudokuuu/ui';
import { SpacingConstant } from '@suuudokuuu/ui/theme';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { useRouter } from 'expo-router';
import { use, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { Alert } from '../../../@generic/components/alert/alert';
import { useVibration } from '../../../@generic/hooks/use-vibration.hook';
import { i18nIsRightToLeftLocale } from '../../../@generic/utils/i18n-is-right-to-left-locale.util';
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
import { useCurrentRun } from '../../../game/query/use-current-run.query';
import { useElapsedTime } from '../../../game/query/use-elapsed-time.query';
import { gameToggleCellCandidate } from '../../../game/utils/game-toggle-cell-candidate.util';
import { runCurrentRunCommand } from '../../../game/utils/run-current-run-command.util';
import { useSettings } from '../../../settings/query/use-settings.query';
import { ThemeContext } from '../../../theme/context/theme.context';
import { gameScreenSetSharingAvailable } from '../../utils/game-screen-set-sharing-available.util';

import { GameActions } from './game-actions/game-actions';
import { GameInputTools } from './game-input-tools/game-input-tools';
import { GameNumpad } from './game-numpad/game-numpad';
import { GameNumpadStyles as numpadStyles } from './game-numpad/game-numpad.styles';
import { GameScreenSelectors } from './game-screen.selectors';
import { GameScreenStyles as styles } from './game-screen.styles';
import { GameStatusBlock } from './game-status-block/game-status-block';
import { useGameEngineEvents } from './hooks/use-game-engine-events.hook';

import type { AvailableValuesItemRef } from '../../../game/components/available-values-item/available-values-item';
import type { CellInterface } from '@suuudokuuu/generator';
import type { LayoutChangeEvent } from 'react-native';

// oxlint-disable-next-line max-lines-per-function -- Game orchestration component requires many handlers and refs
export const GameScreen = () => {
    const router = useRouter();
    const { i18n, t } = useLingui();

    const { engine, snapshot } = use(GameContext);
    const { theme } = use(ThemeContext);

    const [, hapticImpact] = useVibration();

    const { sizeClass } = useAppLayout();
    const insets = useSafeAreaInsets();
    const isWideLayout = sizeClass === 'wide';
    const reservedBoardHeight = isWideLayout ? 0 : GameToolsSlotReservedHeightConstant;
    const { cellSize: boardCellSize, cellMargin: boardCellMargin, boardSize, onBoardAreaLayout } = useBoardGeometry(reservedBoardHeight);
    const { challengeState, isChallengeRun, maxMistakes, mistakes, score } = useCurrentRun();
    const { hasTimer, isLeftHanded, keepActiveCell } = useSettings();
    const hasRival = isNotEmptyString(challengeState);
    const elapsedTime = useElapsedTime();

    const availableValuesRefs = useRef<Record<number, AvailableValuesItemRef | null>>({});
    const fieldRef = useRef<FieldRef>(null);

    const [hasSharing, setHasSharing] = useState(false);
    const [toolsSlotHeight, setToolsSlotHeight] = useState(0);
    const [toolbarHeight, setToolbarHeight] = useState(0);
    const [panelAreaHeight, setPanelAreaHeight] = useState(0);

    const { selectedCell } = snapshot;
    const maxMistakesReached = mistakes >= maxMistakes;

    useEffect(() => void gameScreenSetSharingAvailable(setHasSharing), []);

    const handleShare = useShareGame();
    const handleOpenSettings = () => {
        void runCurrentRunCommand(currentRunService => currentRunService.pause(false));
        router.push('/game-settings');
    };

    const handleConfirmedExit = () => {
        void runCurrentRunCommand(currentRunService => currentRunService.reset);
        router.dismissTo('/');
    };
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
        void runCurrentRunCommand(currentRunService => currentRunService.pause());
        router.replace('/pause');
    };

    const handleSelectValue = (value: number) => {
        const targetCell = snapshot.selectedCell;

        if (!engine.Sudoku.isBlankCell(targetCell)) {
            return;
        }

        availableValuesRefs.current[value]?.triggerAnimation();

        if (snapshot.inputMode === 'candidate') {
            gameToggleCellCandidate(engine, { ...targetCell, value });
            hapticImpact(ImpactFeedbackStyle.Light);
        } else {
            engine.inputValue(value);
        }
    };

    const handleToolsSlotLayout = (event: LayoutChangeEvent) => {
        setToolsSlotHeight(event.nativeEvent.layout.height);
    };

    const handleToolbarLayout = (event: LayoutChangeEvent) => {
        setToolbarHeight(event.nativeEvent.layout.height);
    };

    const handlePanelAreaLayout = (event: LayoutChangeEvent) => {
        setPanelAreaHeight(event.nativeEvent.layout.height);
    };

    const handleAvailableRef = (value: number) => (ref: AvailableValuesItemRef | null) => {
        availableValuesRefs.current[value] = ref;
    };

    useGameEngineEvents(fieldRef);

    const keyboardControlsElement = useKeyboardControls(engine, selectedCell, handleSelectCell, handleSelectValue, handleExit);

    const hideAutoCandidates = maxMistakes === 0;
    const gameActionsIconColor = theme.colors.surface.raisedText;
    const isHintActive = isDefined(snapshot.stepScript);
    const areWideActionsVisible = isWideLayout && !isHintActive;
    const hintPanelAvailableHeight = Math.max(
        0,
        Math.max(0, toolsSlotHeight - toolbarHeight - SpacingConstant.sm) / 2 +
            panelAreaHeight -
            SpacingConstant.md * 2 -
            Math.max(0, insets.bottom - SpacingConstant.md)
    );

    const numpadElement = (
        <GameNumpad availableValuesRefsHandler={handleAvailableRef} onSelectValue={handleSelectValue} selectedCell={selectedCell} />
    );

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
    const isGameRowReversed = isLeftHanded !== i18nIsRightToLeftLocale(i18n.locale);

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

            <View style={styles.gameRow(isGameRowReversed)}>
                <View onLayout={onBoardAreaLayout} style={styles.boardArea}>
                    {isWideLayout ? null : <View style={styles.boardSpacer} />}

                    <Field cellMargin={boardCellMargin} cellSize={boardCellSize} onSelect={handleSelectCell} ref={fieldRef} />

                    {isWideLayout ? null : (
                        <View onLayout={handleToolsSlotLayout} style={styles.toolsSlot}>
                            <View onLayout={handleToolbarLayout}>
                                <GameInputTools hideAutoCandidates={hideAutoCandidates} isLeftHanded={isLeftHanded} />
                            </View>
                        </View>
                    )}
                </View>

                <View onLayout={handlePanelAreaLayout} style={styles.panelArea(boardSize, isHintActive)}>
                    {isWideLayout ? statusBlock : null}

                    {isWideLayout ? challengeHud : null}

                    <View style={styles.panelInputArea}>
                        {areWideActionsVisible ? (
                            <ScrollView contentContainerStyle={numpadStyles.scrollContent} style={numpadStyles.scroll}>
                                {numpadElement}
                            </ScrollView>
                        ) : null}
                        {isWideLayout ? null : numpadElement}

                        {isWideLayout ? <GameInputTools hideAutoCandidates={hideAutoCandidates} isLeftHanded={isLeftHanded} /> : null}
                    </View>

                    {areWideActionsVisible ? gameActionsWithPause : null}

                    {isWideLayout ? <HintPanel /> : null}
                </View>
            </View>

            {isWideLayout ? null : <HintPanel availableHeight={hintPanelAvailableHeight} />}
        </Pressable>
    );
};
