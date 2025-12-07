import { useLingui } from '@lingui/react/macro';
import { LucidePlay } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { getTimerText } from '../../../@generic/utils/get-timer-text.util';
import { ThemeContext } from '../../../theme/context/theme.context';

import { CompletedGameItemStyles as styles } from './completed-game-item.styles';

import type { CompletedGameInterface } from '../../interfaces/completed-game.interface';

interface Props {
    readonly game: CompletedGameInterface;
}

export const CompletedGameItem = ({ game }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const {isWon} = game;
    const borderColor = isWon ? theme.colors.cell.active : theme.colors.red;

    const containerStyles = [styles.container, { borderColor, borderWidth: 2 }];
    const statusTextStyles = [styles.statusText, { color: isWon ? theme.colors.cell.active : theme.colors.red }];

    return (
        <View style={containerStyles}>
            <View style={styles.infoContainer}>
                <View style={styles.row}>
                    <BlackText>
                        {t`Score`}: <Text style={styles.boldText}>{game.score}</Text>
                    </BlackText>
                    <BlackText>
                        {t`Time`}: <Text style={styles.boldText}>{getTimerText(game.elapsedTime)}</Text>
                    </BlackText>
                </View>
                <View style={styles.row}>
                    <BlackText>
                        {t`Mistakes`}: <Text style={styles.boldText}>{game.mistakes}/{game.maxMistakes}</Text>
                    </BlackText>
                    <BlackText style={statusTextStyles}>{isWon ? t`Won` : t`Lost`}</BlackText>
                </View>
            </View>
            <BlackButton
                href={`/replay/${game.difficulty}/${game.completedAt}`}
                style={styles.replayButton}
            >
                <LucidePlay color={theme.colors.label.inverted} size={16} />
            </BlackButton>
        </View>
    );
};
