import { useLingui } from '@lingui/react/macro';
import { ScreenChromeScrollView } from '@suuudokuuu/screen-chrome';
import { Redirect } from 'expo-router';
import { LucideFlag, LucideHeartCrack, LucideTrophy } from 'lucide-react-native';
import { use } from 'react';
import { View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { ChromePage } from '../../../@generic/components/chrome-page/chrome-page';
import { PlayAgainButton } from '../../../@generic/components/play-again-button/play-again-button';
import { UkraineSupportCard } from '../../../@generic/components/ukraine-support-card/ukraine-support-card';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { GameState } from '../../../game/store/game.state';
import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeResult } from '../../interfaces/challenge-result.interface';
import { getChallengeDurationParts } from '../../utils/get-challenge-duration-parts.util';
import { getChallengeResult } from '../../utils/get-challenge-result.util';
import { ChallengeResultHero } from '../challenge-result-hero/challenge-result-hero';
import { ChallengeResultRaceCard } from '../challenge-result-race-card/challenge-result-race-card';

import { ChallengeResultScreenSelectors } from './challenge-result-screen.selectors';
import { ChallengeResultScreenStyles as styles } from './challenge-result-screen.styles';
import { ChallengeResultScreenFooterHeight, ChallengeResultScreenHeaderHeight } from './constant/challenge-result-screen-chrome.constant';

import type { ReactNode } from 'react';

interface Props {
    readonly children?: ReactNode;
    readonly gameState: GameState;
}

export const ChallengeResultScreen = (props: Props) => {
    const { children, gameState } = props;
    const { score, elapsedTime, challengeTime, sudokuString } = gameState;

    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const elapsedTimeText = useTimerText(elapsedTime);
    const challengeTimeText = useTimerText(challengeTime);
    const scoreText = String(score);

    if (!isNotEmptyString(sudokuString) && elapsedTime === 0) {
        return <Redirect href="/" />;
    }

    const result = getChallengeResult(elapsedTime, challengeTime);
    const marginSeconds = Math.abs(challengeTime - elapsedTime);
    const durationParts = getChallengeDurationParts(marginSeconds);
    const isWon = result === ChallengeResult.Won;
    const isLost = result === ChallengeResult.Lost;
    let headerText = t`Dead even`;
    let Icon = LucideFlag;
    let iconColor = theme.colors.label.inverted;

    if (isWon) {
        headerText = t`Challenge won`;
        Icon = LucideTrophy;
    }

    if (isLost) {
        headerText = t`Challenge lost`;
        Icon = LucideHeartCrack;
        iconColor = theme.colors.red;
    }

    const header = <ChallengeResultHero headerText={headerText} icon={Icon} iconColor={iconColor} scoreText={scoreText} />;
    const footer = (
        <View style={styles.actions}>
            {children}
            <PlayAgainButton />
        </View>
    );
    const topEdgeFadeProps = { height: ChallengeResultScreenHeaderHeight };
    const footerEdgeFadeProps = { height: ChallengeResultScreenFooterHeight, intensity: 70 };

    return (
        <ChromePage
            contentStyle={styles.chromeContent}
            footer={footer}
            footerEdgeFadeProps={footerEdgeFadeProps}
            footerStyle={styles.footerChrome}
            header={header}
            headerStyle={styles.headerChrome}
            testID={ChallengeResultScreenSelectors.Root}
            topEdgeFadeProps={topEdgeFadeProps}
        >
            <ScreenChromeScrollView
                alwaysBounceVertical
                bounces
                contentContainerStyle={styles.scrollContent}
                contentInsetBottom={ChallengeResultScreenFooterHeight}
                contentInsetTop={ChallengeResultScreenHeaderHeight}
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
            >
                <View style={styles.content}>
                    <ChallengeResultRaceCard
                        durationParts={durationParts}
                        opponentTimeText={challengeTimeText}
                        playerTimeText={elapsedTimeText}
                        result={result}
                    />

                    <UkraineSupportCard testID={ChallengeResultScreenSelectors.UkraineSupportCta} />
                </View>
            </ScreenChromeScrollView>
        </ChromePage>
    );
};
