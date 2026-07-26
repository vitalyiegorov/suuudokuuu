import { View } from 'react-native';

import { GameScreenMetrics } from '../game-screen-metrics/game-screen-metrics';

import { GameStatusBlockStyles as styles } from './game-status-block.styles';

interface Props {
    readonly elapsedTime: number;
    readonly hasTimer: boolean;
    readonly maxMistakes: number;
    readonly maxMistakesReached: boolean;
    readonly mistakes: number;
    readonly score: number;
}

export const GameStatusBlock = (props: Props) => {
    const { elapsedTime, hasTimer, maxMistakes, maxMistakesReached, mistakes, score } = props;

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
