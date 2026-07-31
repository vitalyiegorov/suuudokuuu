import { useAppMetricStripColor } from '@suuudokuuu/ui';
import { use } from 'react';
import { Text } from 'react-native';

import { ThemeContext } from '../../../../theme/context/theme.context';
import { GameScreenMetricsStyles as styles } from '../game-screen-metrics/game-screen-metrics.styles';
import { GameScreenSelectors } from '../game-screen.selectors';

interface Props {
    readonly maxMistakes: number;
    readonly maxMistakesReached: boolean;
    readonly mistakes: number;
}

export const GameScreenMistakesValue = ({ maxMistakes, maxMistakesReached, mistakes }: Props) => {
    const { theme } = use(ThemeContext);
    const { textColor } = useAppMetricStripColor();
    const mistakesColor = maxMistakesReached ? theme.colors.danger : textColor;
    const mistakesTextStyles = [styles.value, { color: mistakesColor, textAlign: 'center' as const }];

    return (
        <Text allowFontScaling={false} numberOfLines={1} style={mistakesTextStyles}>
            <Text testID={GameScreenSelectors.MistakesCount}>{mistakes}</Text>
            <Text>/</Text>
            <Text testID={GameScreenSelectors.MaxMistakesAllowed}>{maxMistakes}</Text>
        </Text>
    );
};
