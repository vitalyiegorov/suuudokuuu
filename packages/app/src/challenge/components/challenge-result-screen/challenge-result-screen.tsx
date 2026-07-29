import { useLingui } from '@lingui/react/macro';
import { Redirect } from 'expo-router';
import { use } from 'react';
import { Text, View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { ChromeScrollPage } from '../../../@generic/components/chrome-scroll-page/chrome-scroll-page';
import { UkraineSupportCard } from '../../../@generic/components/ukraine-support-card/ukraine-support-card';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { getMistakesTypeText } from '../../../@generic/utils/get-mistakes-type-text.util';
import { GameState } from '../../../game/store/game.state';
import { stringToGameState } from '../../../game/utils/string-to-game-state.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeLossReason } from '../../enums/challenge-loss-reason.enum';
import { ChallengeResult } from '../../interfaces/challenge-result.interface';
import { getChallengeAwayRanges } from '../../utils/get-challenge-away-ranges.util';
import { getChallengeDurationParts } from '../../utils/get-challenge-duration-parts.util';
import { getChallengeTechniqueEventsFromState } from '../../utils/get-challenge-technique-events-from-state.util';
import { getTapeTechniqueEvents } from '../../utils/get-tape-technique-events.util';
import { ChallengeIntegrityBadge } from '../challenge-integrity-badge/challenge-integrity-badge';
import { ChallengeResultFooter } from '../challenge-result-footer/challenge-result-footer';
import { ChallengeResultMarginCard } from '../challenge-result-margin-card/challenge-result-margin-card';
import { ChallengeResultMedallion } from '../challenge-result-medallion/challenge-result-medallion';
import { ChallengeResultRivalTimeCard } from '../challenge-result-rival-time-card/challenge-result-rival-time-card';
import { ChallengeRunTape } from '../challenge-run-tape/challenge-run-tape';
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
    const techniqueEvents = getChallengeTechniqueEventsFromState(challengeState);
    const rivalGameState = stringToGameState(challengeState);
    const rivalAwayRanges = getChallengeAwayRanges(rivalGameState.challengeTimelineEvents, challengeTime);
    const playerTechniqueEvents = getTapeTechniqueEvents(timelineEvents);
    const playerAwayRanges = getChallengeAwayRanges(timelineEvents, elapsedTime);
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
    const mistakesText = getMistakesTypeText(maxMistakes);
    const badgeText = `${flavorText} · ${difficultyText} · ${mistakesText}`;

    const titleStyle = [styles.title, { color: theme.colors.label.main }];
    const pillStyle = [styles.pill, { backgroundColor: theme.colors.black }];
    const pillTextStyle = [styles.pillText, { color: theme.colors.label.inverted }];

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

                <ChallengeRunTape awayRanges={playerAwayRanges} events={playerTechniqueEvents} label={t`Your run`} totalTime={elapsedTime}>
                    <ChallengeIntegrityBadge ranges={playerAwayRanges} />
                </ChallengeRunTape>

                <ChallengeRunTape awayRanges={rivalAwayRanges} events={techniqueEvents} label={t`Rival's run`} totalTime={challengeTime}>
                    <ChallengeIntegrityBadge ranges={rivalAwayRanges} />
                </ChallengeRunTape>

                <ChallengeTechniqueBreakdown events={techniqueEvents} label={t`Rival's playbook`} />

                <UkraineSupportCard testID={ChallengeResultScreenSelectors.UkraineSupportCta} />
            </View>
        </ChromeScrollPage>
    );
};
