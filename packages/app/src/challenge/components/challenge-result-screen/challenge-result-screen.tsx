import { useLingui } from '@lingui/react/macro';
import { Redirect } from 'expo-router';
import { use } from 'react';
import { Text, View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { ChromeScrollPage } from '../../../@generic/components/chrome-scroll-page/chrome-scroll-page';
import { UkraineSupportCard } from '../../../@generic/components/ukraine-support-card/ukraine-support-card';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { getLevelRatingText } from '../../../@generic/utils/get-level-rating-text.util';
import { getMistakesTypeText } from '../../../@generic/utils/get-mistakes-type-text.util';
import { GameState } from '../../../game/store/game.state';
import { stringToGameState } from '../../../game/utils/string-to-game-state.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeLossReason } from '../../enums/challenge-loss-reason.enum';
import { ChallengeResult } from '../../interfaces/challenge-result.interface';
import { getChallengeDurationParts } from '../../utils/get-challenge-duration-parts.util';
import { getChallengeRecordingSummary } from '../../utils/get-challenge-recording-summary.util';
import { getChallengeRivalRunSummary } from '../../utils/get-challenge-rival-run-summary.util';
import { ChallengeResultFooter } from '../challenge-result-footer/challenge-result-footer';
import { ChallengeResultMarginCard } from '../challenge-result-margin-card/challenge-result-margin-card';
import { ChallengeResultMedallion } from '../challenge-result-medallion/challenge-result-medallion';
import { ChallengeResultRivalTimeCard } from '../challenge-result-rival-time-card/challenge-result-rival-time-card';
import { ChallengeRunSummary } from '../challenge-run-summary/challenge-run-summary';

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
    const { elapsedTime, challengeTime, sudokuString, challengeState, mistakes, maxMistakes, timelineEvents } = gameState;

    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const elapsedTimeText = useTimerText(elapsedTime);
    const challengeTimeText = useTimerText(challengeTime);

    if (!isNotEmptyString(sudokuString) && elapsedTime === 0) {
        return <Redirect href="/" />;
    }

    const marginSeconds = Math.abs(challengeTime - elapsedTime);
    const durationParts = getChallengeDurationParts(marginSeconds);
    const playerSummary = getChallengeRecordingSummary(timelineEvents, elapsedTime);
    const rivalSummary = getChallengeRivalRunSummary(challengeState, challengeTime);
    const rivalGameState = stringToGameState(challengeState);
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

    const difficultyText = getDifficultyText(rivalGameState.difficulty);
    const levelText = getLevelRatingText(difficultyText, rivalGameState.rating, rivalGameState.isRatingCeiling);
    const mistakesText = getMistakesTypeText(maxMistakes);
    const badgeText = `${flavorText} · ${levelText} · ${mistakesText}`;

    const titleStyle = [styles.title, { color: theme.colors.text.primary }];
    const pillStyle = [styles.pill, { backgroundColor: theme.colors.ink }];
    const pillTextStyle = [styles.pillText, { color: theme.colors.inkText }];

    return (
        <ChromeScrollPage footer={<ChallengeResultFooter>{children}</ChallengeResultFooter>} testID={ChallengeResultScreenSelectors.Root}>
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
                    <ChallengeResultMarginCard
                        durationParts={durationParts}
                        lostByMistakes={lostByMistakes}
                        mistakes={mistakes}
                        opponentTimeText={challengeTimeText}
                        playerTimeText={elapsedTimeText}
                        result={result}
                    />
                )}

                <ChallengeRunSummary
                    label={t`Your run`}
                    summary={playerSummary}
                    testID={ChallengeResultScreenSelectors.PlayerRun}
                    totalTime={elapsedTime}
                />

                <ChallengeRunSummary
                    label={t`Rival's run`}
                    summary={rivalSummary}
                    testID={ChallengeResultScreenSelectors.RivalRun}
                    totalTime={challengeTime}
                />

                <UkraineSupportCard testID={ChallengeResultScreenSelectors.UkraineSupportCta} />
            </View>
        </ChromeScrollPage>
    );
};
