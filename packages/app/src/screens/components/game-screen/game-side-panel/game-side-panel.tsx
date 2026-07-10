import { LucideLogOut, LucidePause, LucideSettings, LucideShare2 } from 'lucide-react-native';
import { use } from 'react';
import { View } from 'react-native';

import { BlackIconButton } from '../../../../@generic/components/black-icon-button/black-icon-button';
import { useAppSelector } from '../../../../@generic/hooks/use-app-selector.hook';
import { AutoCandidatesButton } from '../../../../game/components/auto-candidates-button/auto-candidates-button';
import { AvailableValuesItem } from '../../../../game/components/available-values-item/available-values-item';
import { CandidateInputItem } from '../../../../game/components/candidate-input-item/candidate-input-item';
import { InputModeButton } from '../../../../game/components/input-mode-button/input-mode-button';
import { GameNumpadDigitsConstant } from '../../../../game/constant/game-numpad-digits.constant';
import { GameContext } from '../../../../game/context/game.context';
import { gameInputModeSelector } from '../../../../game/store/game.selectors';
import { GameScreenMetrics } from '../game-screen-metrics/game-screen-metrics';
import { GameScreenSelectors } from '../game-screen.selectors';

import { GameSidePanelStyles as styles } from './game-side-panel.styles';

import type { AvailableValuesItemRef } from '../../../../game/components/available-values-item/available-values-item';
import type { CellInterface } from '@suuudokuuu/generator';

interface Props {
    readonly actionIconColor: string;
    readonly availableValuesRefsHandler: (value: number) => (ref: AvailableValuesItemRef | null) => void;
    readonly elapsedTime: number;
    readonly hasSharing: boolean;
    readonly hasTimer: boolean;
    readonly hideAutoCandidates: boolean;
    readonly maxMistakes: number;
    readonly maxMistakesReached: boolean;
    readonly mistakes: number;
    readonly onExit: () => void;
    readonly onOpenSettings: () => void;
    readonly onPause: () => void;
    readonly onSelectValue: (value: number) => void;
    readonly onShare: () => void;
    readonly score: number;
    readonly selectedCell: CellInterface | undefined;
}

export const GameSidePanel = (props: Props) => {
    const {
        actionIconColor,
        availableValuesRefsHandler,
        elapsedTime,
        hasSharing,
        hasTimer,
        hideAutoCandidates,
        maxMistakes,
        maxMistakesReached,
        mistakes,
        onExit,
        onOpenSettings,
        onPause,
        onSelectValue,
        onShare,
        score,
        selectedCell
    } = props;

    const { sudoku } = use(GameContext);
    const inputMode = useAppSelector(gameInputModeSelector);
    const canPress = sudoku.isBlankCell(selectedCell);

    return (
        <View style={styles.panel}>
            <View style={styles.statusBlock}>
                <GameScreenMetrics
                    elapsedTime={elapsedTime}
                    hasTimer={hasTimer}
                    maxMistakes={maxMistakes}
                    maxMistakesReached={maxMistakesReached}
                    mistakes={mistakes}
                    score={score}
                />
                <BlackIconButton onPress={onPause} testID={GameScreenSelectors.PauseButton} variant="secondary">
                    <LucidePause color={actionIconColor} />
                </BlackIconButton>
            </View>

            <View style={styles.numpad}>
                {GameNumpadDigitsConstant.map(value => {
                    const isExhausted = !sudoku.PossibleValues.includes(value);

                    return inputMode === 'candidate' ? (
                        <CandidateInputItem
                            canPress={canPress}
                            isExhausted={isExhausted}
                            key={`candidate-value-${value}`}
                            onSelect={onSelectValue}
                            selectedCell={selectedCell}
                            value={value}
                        />
                    ) : (
                        <AvailableValuesItem
                            canPress={canPress}
                            correctValue={sudoku.getCorrectValue(selectedCell)}
                            isExhausted={isExhausted}
                            key={`possible-value-${value}`}
                            onSelect={onSelectValue}
                            progress={sudoku.getValueProgress(value)}
                            ref={availableValuesRefsHandler(value)}
                            value={value}
                        />
                    );
                })}
            </View>

            <View style={styles.toolsRowSpacer} />

            <View style={styles.inputControls}>
                <InputModeButton />
                {hideAutoCandidates ? null : <AutoCandidatesButton />}
            </View>

            <View style={styles.actions}>
                {hasSharing ? (
                    <BlackIconButton onPress={onShare} testID={GameScreenSelectors.ShareButton} variant="secondary">
                        <LucideShare2 color={actionIconColor} />
                    </BlackIconButton>
                ) : null}
                <BlackIconButton onPress={onOpenSettings} testID={GameScreenSelectors.SettingsButton} variant="secondary">
                    <LucideSettings color={actionIconColor} />
                </BlackIconButton>
                <BlackIconButton onPress={onExit} testID={GameScreenSelectors.QuitButton} variant="secondary">
                    <LucideLogOut color={actionIconColor} />
                </BlackIconButton>
            </View>
        </View>
    );
};
