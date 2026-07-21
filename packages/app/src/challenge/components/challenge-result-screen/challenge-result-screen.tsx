import { useLingui } from '@lingui/react/macro';
import { ScreenChromeScrollView } from '@suuudokuuu/screen-chrome';
import { Redirect } from 'expo-router';
import { use } from 'react';
import { Text, View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { ChromePage } from '../../../@generic/components/chrome-page/chrome-page';
import { PlayAgainButton } from '../../../@generic/components/play-again-button/play-again-button';
import { UkraineSupportCard } from '../../../@generic/components/ukraine-support-card/ukraine-support-card';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { getMistakesTypeText } from '../../../@generic/utils/get-mistakes-type-text.util';
import { GameState } from '../../../game/store/game.state';
import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeLossReason } from '../../enums/challenge-loss-reason.enum';
import { ChallengeResult } from '../../interfaces/challenge-result.interface';
import { getChallengeDifficulty } from '../../utils/get-challenge-difficulty.util';
import { getChallengeDurationParts } from '../../utils/get-challenge-duration-parts.util';
import { getChallengeTechniqueEventsFromState } from '../../utils/get-challenge-technique-events-from-state.util';
import { ChallengeResultMarginCard } from '../challenge-result-margin-card/challenge-result-margin-card';
import { ChallengeResultMedallion } from '../challenge-result-medallion/challenge-result-medallion';
import { ChallengeResultRaceCard } from '../challenge-result-race-card/challenge-result-race-card';
import { ChallengeTechniqueBreakdown } from '../challenge-technique-breakdown/challenge-technique-breakdown';

import { ChallengeResultScreenSelectors } from './challenge-result-screen.selectors';
import { ChallengeResultScreenStyles as styles } from './challenge-result-screen.styles';
import {
    ChallengeResultScreenFooterFadeIntensity,
    ChallengeResultScreenFooterHeight,
    ChallengeResultScreenTopFadeHeight
} from './constant/challenge-result-screen-chrome.constant';

import type { ReactNode } from 'react';

interface Props {
    readonly children?: ReactNode;
    readonly gameState: GameState;
    readonly result: ChallengeResult;
    readonly lossReason?: ChallengeLossReason;
}

// eslint-disable-next-line max-lines-per-function -- Layout/form component requires many lines
export const ChallengeResultScreen = (props: Props) => {
    const { children, gameState, result, lossReason = ChallengeLossReason.Time } = props;
    const { elapsedTime, challengeTime, sudokuString, challengeState, solutionSteps, challengeSteps, mistakes, maxMistakes } = gameState;

    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const elapsedTimeText = useTimerText(elapsedTime);
    const challengeTimeText = useTimerText(challengeTime);

    if (!isNotEmptyString(sudokuString) && elapsedTime === 0) {
        return <Redirect href="/" />;
    }

    const marginSeconds = Math.abs(challengeTime - elapsedTime);
    const durationParts = getChallengeDurationParts(marginSeconds);
    const techniqueEvents = getChallengeTechniqueEventsFromState(challengeState);
    const playerProgress = challengeSteps.length === 0 ? 0 : solutionSteps.length / challengeSteps.length;
    const playerFinished = playerProgress >= 1;
    const lostByMistakes = result === ChallengeResult.Lost && lossReason === ChallengeLossReason.Mistakes;

    let title = t`Dead even`;
    let flavorText = t`Evenly matched`;
    if (result === ChallengeResult.Won) {
        title = t`Challenge won`;
        flavorText = t`You beat your rival`;
    }
    if (result === ChallengeResult.Lost) {
        title = t`Challenge lost`;
        flavorText = lostByMistakes ? t`Out of mistakes` : t`Your rival was faster`;
    }

    const difficultyText = getDifficultyText(getChallengeDifficulty(challengeState));
    const mistakesText = getMistakesTypeText(maxMistakes);
    const badgeText = `${flavorText} · ${difficultyText} · ${mistakesText}`;

    const titleStyle = [styles.title, { color: theme.colors.label.main }];
    const pillStyle = [styles.pill, { backgroundColor: theme.colors.black }];
    const pillTextStyle = [styles.pillText, { color: theme.colors.label.inverted }];

    const footer = (
        <View style={styles.actions}>
            <View style={styles.actionSlot}>{children}</View>
            <View style={styles.actionSlot}>
                <PlayAgainButton />
            </View>
        </View>
    );
    const footerEdgeFadeProps = { height: ChallengeResultScreenFooterHeight, intensity: ChallengeResultScreenFooterFadeIntensity };
    const topEdgeFadeProps = { height: ChallengeResultScreenTopFadeHeight };

    return (
        <ChromePage
            contentStyle={styles.chromeContent}
            footer={footer}
            footerEdgeFadeProps={footerEdgeFadeProps}
            footerStyle={styles.footer}
            testID={ChallengeResultScreenSelectors.Root}
            topEdgeFadeProps={topEdgeFadeProps}
        >
            <ScreenChromeScrollView
                contentContainerStyle={styles.scrollContent}
                contentInsetBottom={ChallengeResultScreenFooterHeight}
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
            >
                <View style={styles.content}>
                    <ChallengeResultMedallion result={result} />

                    <Text allowFontScaling={false} style={titleStyle}>
                        {title}
                    </Text>

                    <View style={pillStyle}>
                        <Text allowFontScaling={false} style={pillTextStyle} testID={ChallengeResultScreenSelectors.OutcomeValue}>
                            {badgeText}
                        </Text>
                    </View>

                    <ChallengeResultRaceCard
                        lostByMistakes={lostByMistakes}
                        opponentSeconds={challengeTime}
                        opponentTimeText={challengeTimeText}
                        playerFinished={playerFinished}
                        playerProgress={playerProgress}
                        playerSeconds={elapsedTime}
                        playerTimeText={elapsedTimeText}
                    />

                    <ChallengeResultMarginCard
                        durationParts={durationParts}
                        lostByMistakes={lostByMistakes}
                        mistakes={mistakes}
                        result={result}
                    />

                    <ChallengeTechniqueBreakdown events={techniqueEvents} />

                    <UkraineSupportCard testID={ChallengeResultScreenSelectors.UkraineSupportCta} />
                </View>
            </ScreenChromeScrollView>
        </ChromePage>
    );
};
