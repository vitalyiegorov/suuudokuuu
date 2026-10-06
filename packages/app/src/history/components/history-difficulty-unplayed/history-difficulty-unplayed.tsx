import { useLingui } from '@lingui/react/macro';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { getDifficultyMessage } from '../../../@generic/utils/get-difficulty-message.util';
import { HistoryMissingValueText } from '../../constants/history-missing-value-text.constant';
import { HistoryDifficultyMeter } from '../history-difficulty-meter/history-difficulty-meter';
import { HistoryDifficultyStyles as styles } from '../history-difficulty/history-difficulty.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulty: DifficultyEnum;
}

export const HistoryDifficultyUnplayed = ({ difficulty }: Props) => {
    const { t } = useLingui();
    const rowStyles = [styles.row, styles.unplayedRow];

    return (
        <View style={rowStyles}>
            <HistoryDifficultyMeter difficulty={difficulty} />

            <View style={styles.titleGroup}>
                <BlackText numberOfLines={1} style={styles.title}>
                    {t(getDifficultyMessage(difficulty))}
                </BlackText>
            </View>

            <View style={styles.missingTrack} />

            <BlackText style={styles.winRate}>{HistoryMissingValueText}</BlackText>

            <View style={styles.chevronSlot} />
        </View>
    );
};
