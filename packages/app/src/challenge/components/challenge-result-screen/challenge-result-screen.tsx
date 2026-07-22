import { useLingui } from '@lingui/react/macro';
import { Redirect } from 'expo-router';
import { use } from 'react';
import { Text, View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

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
import { ChallengeChromePage } from '../challenge-chrome-page/challenge-chrome-page';
import { ChallengeResultFooter } from '../challenge-result-footer/challenge-result-footer';
import { ChallengeResultMarginCard } from '../challenge-result-margin-card/challenge-result-margin-card';
import { ChallengeResultMedallion } from '../challenge-result-medallion/challenge-result-medallion';
import { ChallengeResultRaceCard } from '../challenge-result-race-card/challenge-result-race-card';
import { ChallengeResultRivalTimeCard } from '../challenge-result-rival-time-card/challenge-result-rival-time-card';
import { ChallengeTechniqueBreakdown } from '../challenge-technique-breakdown/challenge-technique-breakdown';

import { ChallengeResultScreenSelectors } from './challenge-result-screen.selectors';
import { ChallengeResultScreenStyles as styles } from './challenge-result-screen.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children?: ReactNode;
    readonly gameState: GameState;
    readonly result: ChallengeResult;
    readonly lossReason?: ChallengeLossReason;
}

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
    const lostByTime = result === ChallengeResult.Lost && lossReason === ChallengeLossReason.Time;

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

    return (
        <ChallengeChromePage
            footer={<ChallengeResultFooter>{children}</ChallengeResultFooter>}
            testID={ChallengeResultScreenSelectors.Root}
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

                {lostByTime ? (
                    <ChallengeResultRivalTimeCard rivalTimeText={challengeTimeText} />
                ) : (
                    <ChallengeResultRaceCard
                        lostByMistakes={lostByMistakes}
                        opponentSeconds={challengeTime}
                        opponentTimeText={challengeTimeText}
                        playerFinished={playerFinished}
                        playerProgress={playerProgress}
                        playerSeconds={elapsedTime}
                        playerTimeText={elapsedTimeText}
                    />
                )}

                {lostByTime ? null : (
                    <ChallengeResultMarginCard
                        durationParts={durationParts}
                        lostByMistakes={lostByMistakes}
                        mistakes={mistakes}
                        result={result}
                    />
                )}

                <ChallengeTechniqueBreakdown events={techniqueEvents} />

                <UkraineSupportCard testID={ChallengeResultScreenSelectors.UkraineSupportCta} />
            </View>
        </ChallengeChromePage>
    );
};
