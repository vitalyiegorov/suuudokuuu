import { DAILY_DIFFICULTY_LADDER } from '@suuudokuuu/puzzle-forge';
import { View } from 'react-native';

import { applyColorAlpha } from '../../../@generic/utils/apply-color-alpha.util';

import { DailyDifficultyBarsStyles as styles } from './daily-difficulty-bars.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';

const BarBaseHeight = 5;
const BarHeightStep = 2;
const BarHeights = DAILY_DIFFICULTY_LADDER.map((_unusedDifficulty, index) => BarBaseHeight + index * BarHeightStep);
const InactiveBarAlpha = 0.25;

interface Props {
    readonly color: string;
    readonly difficulty: DifficultyEnum;
}

export const DailyDifficultyBars = ({ color, difficulty }: Props) => {
    const level = DAILY_DIFFICULTY_LADDER.indexOf(difficulty) + 1;
    const inactiveColor = applyColorAlpha(color, InactiveBarAlpha);
    const barStyles = BarHeights.map((height, index) => [styles.bar, { backgroundColor: index < level ? color : inactiveColor, height }]);

    return (
        <View accessible={false} importantForAccessibility="no-hide-descendants" style={styles.bars}>
            {barStyles.map((barStyle, index) => (
                <View key={BarHeights[index]} style={barStyle} />
            ))}
        </View>
    );
};
