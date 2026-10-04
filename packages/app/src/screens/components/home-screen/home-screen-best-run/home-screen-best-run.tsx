import { Trans, useLingui } from '@lingui/react/macro';
import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { useTimerText } from '../../../../@generic/hooks/use-timer-text.hook';
import { HomeScreenBestRunMetric } from '../home-screen-best-run-metric/home-screen-best-run-metric';
import { HomeScreenSelectors } from '../home-screen.selectors';
import { HomeScreenStyles as styles } from '../home-screen.styles';

interface Props {
    readonly bestScore: number;
    readonly bestTime: number;
}

export const HomeScreenBestRun = ({ bestScore, bestTime }: Props) => {
    const { t } = useLingui();
    const bestTimeText = useTimerText(bestTime);

    return (
        <Link asChild href="/scoring">
            <Pressable accessibilityRole="button" style={styles.bestRunLink}>
                <View style={styles.bestRun}>
                    <View style={styles.bestRunCopy}>
                        <BlackText style={styles.bestRunLabel}>
                            <Trans>Your best run</Trans>
                        </BlackText>
                        <BlackText numberOfLines={1} style={styles.bestRunTitle}>
                            <Trans>Keep the streak</Trans>
                        </BlackText>
                    </View>

                    <View style={styles.bestRunMetrics}>
                        <HomeScreenBestRunMetric label={t`Score`} testID={HomeScreenSelectors.BestScore} value={String(bestScore)} />
                        <HomeScreenBestRunMetric label={t`Time`} value={bestTimeText} />
                    </View>
                </View>
            </Pressable>
        </Link>
    );
};
