import { View } from 'react-native';

import { HistoryDifficultyMeterBarStyles as styles } from './history-difficulty-meter-bar.styles';

const BaseHeight = 4;
const HeightStep = 2;

interface Props {
    readonly level: number;
    readonly filledLevel: number;
}

export const HistoryDifficultyMeterBar = ({ level, filledLevel }: Props) => {
    const barStyles = [styles.bar, { height: BaseHeight + level * HeightStep }, level <= filledLevel && styles.filledBar];

    return <View style={barStyles} />;
};
