import { View } from 'react-native';

import { DifficultyComplexitySliderDifficulties } from '../../../game/components/difficulty-complexity-slider/constant/difficulty-complexity-slider.constant';
import { HistoryDifficultyMeterBar } from '../history-difficulty-meter-bar/history-difficulty-meter-bar';

import { HistoryDifficultyMeterStyles as styles } from './history-difficulty-meter.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulty: DifficultyEnum;
}

export const HistoryDifficultyMeter = ({ difficulty }: Props) => {
    const filledLevel = DifficultyComplexitySliderDifficulties.indexOf(difficulty);

    return (
        <View importantForAccessibility="no-hide-descendants" style={styles.meter}>
            {DifficultyComplexitySliderDifficulties.map((levelDifficulty, level) => (
                <HistoryDifficultyMeterBar filledLevel={filledLevel} key={levelDifficulty} level={level} />
            ))}
        </View>
    );
};
