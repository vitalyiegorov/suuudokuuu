import { View } from 'react-native';

import { useAppSelector } from '../../../../@generic/hooks/use-app-selector.hook';
import {
    gameElapsedTimeSelector,
    gameMaxMistakesSelector,
    gameMistakesSelector,
    gameScoreSelector
} from '../../../../game/store/game.selectors';
import { settingsKeySelector } from '../../../../settings/store/settings.selectors';
import { GameScreenMetrics } from '../game-screen-metrics/game-screen-metrics';

import { GameStatusBlockStyles as styles } from './game-status-block.styles';

export const GameStatusBlock = () => {
    const elapsedTime = useAppSelector(gameElapsedTimeSelector);
    const mistakes = useAppSelector(gameMistakesSelector);
    const maxMistakes = useAppSelector(gameMaxMistakesSelector);
    const score = useAppSelector(gameScoreSelector);
    const hasTimer = useAppSelector(settingsKeySelector('hasTimer'));

    const maxMistakesReached = mistakes >= maxMistakes;

    return (
        <View style={styles.statusBlock}>
            <GameScreenMetrics
                elapsedTime={elapsedTime}
                hasTimer={hasTimer}
                maxMistakes={maxMistakes}
                maxMistakesReached={maxMistakesReached}
                mistakes={mistakes}
                score={score}
            />
        </View>
    );
};
