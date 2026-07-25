import { LucidePause } from 'lucide-react-native';
import { View } from 'react-native';
import { Display } from 'react-native-unistyles';

import { BlackIconButton } from '../../../../@generic/components/black-icon-button/black-icon-button';
import { WideLayoutMediaQuery } from '../../../../@generic/constants/layout-media-query.constant';
import { GameScreenMetrics } from '../game-screen-metrics/game-screen-metrics';
import { GameScreenSelectors } from '../game-screen.selectors';

import { GameStatusBlockStyles as styles } from './game-status-block.styles';

interface Props {
    readonly actionIconColor: string;
    readonly elapsedTime: number;
    readonly hasTimer: boolean;
    readonly maxMistakes: number;
    readonly maxMistakesReached: boolean;
    readonly mistakes: number;
    readonly onPause: () => void;
    readonly score: number;
}

export const GameStatusBlock = (props: Props) => {
    const { actionIconColor, elapsedTime, hasTimer, maxMistakes, maxMistakesReached, mistakes, onPause, score } = props;

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
            <Display mq={WideLayoutMediaQuery}>
                <BlackIconButton onPress={onPause} testID={GameScreenSelectors.PauseButton} variant="secondary">
                    <LucidePause color={actionIconColor} />
                </BlackIconButton>
            </Display>
        </View>
    );
};
