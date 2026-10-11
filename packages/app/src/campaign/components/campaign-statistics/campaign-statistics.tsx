import { Trans } from '@lingui/react/macro';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { useCompletedGames } from '../../../history/query/use-completed-games.query';
import { campaignStyles as styles } from '../../campaign.styles';

export const CampaignStatistics = () => {
    const games = useCompletedGames();
    const averageTime = useTimerText(
        games.length === 0 ? 0 : Math.round(games.reduce((total, game) => total + game.elapsedTime, 0) / games.length)
    );
    const averageMistakes = games.length === 0 ? '0' : (games.reduce((total, game) => total + game.mistakes, 0) / games.length).toFixed(1);

    return (
        <View style={styles.card}>
            <BlackText>
                <Trans>Recent completed games</Trans>
            </BlackText>
            <BlackText>
                <Trans>Average solve time: {averageTime}</Trans>
            </BlackText>
            <BlackText>
                <Trans>Mistakes per game: {averageMistakes}</Trans>
            </BlackText>
        </View>
    );
};
