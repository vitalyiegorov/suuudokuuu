import { useLingui } from '@lingui/react/macro';
import { Text, View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { getDifficultyText } from '../../../../@generic/utils/get-difficulty-text.util';
import { getTimerText } from '../../../../@generic/utils/get-timer-text.util';

import { ReplayHeaderStyles as styles } from './replay-header.styles';

import type { CompletedGameInterface } from '../../../../history/interfaces/completed-game.interface';

interface Props {
    readonly game: CompletedGameInterface;
}

export const ReplayHeader = ({ game }: Props) => {
    const { t } = useLingui();

    const resultText = game.isWon ? t`Won` : t`Lost`;
    const resultTextStyles = [styles.resultText, game.isWon ? styles.wonText : styles.lostText];

    return (
        <View style={styles.container}>
            <View style={styles.titleRow}>
                <BlackText style={styles.difficultyText}>{getDifficultyText(game.difficulty)}</BlackText>
                <BlackText style={resultTextStyles}>{resultText}</BlackText>
            </View>
            <View style={styles.statsRow}>
                <BlackText>
                    {t`Score`}: <Text style={styles.boldText}>{game.score}</Text>
                </BlackText>
                <BlackText>
                    {t`Mistakes`}: <Text style={styles.boldText}>{game.mistakes}/{game.maxMistakes}</Text>
                </BlackText>
                <BlackText>
                    {t`Time`}: <Text style={styles.boldText}>{getTimerText(game.elapsedTime)}</Text>
                </BlackText>
            </View>
        </View>
    );
};
