import { plural } from '@lingui/core/macro';
import { Trans, useLingui } from '@lingui/react/macro';
import { LucideSwords, LucideX } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { AppLinkButton } from '../../../@generic/components/app-link-button/app-link-button';
import { ChromeScrollPage } from '../../../@generic/components/chrome-scroll-page/chrome-scroll-page';
import { GlassIconButton } from '../../../@generic/components/glass-icon-button/glass-icon-button';
import { ScreenActionBar } from '../../../@generic/components/screen-action-bar/screen-action-bar';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { getDifficultyMessage } from '../../../@generic/utils/get-difficulty-message.util';
import { getLevelRatingText } from '../../../@generic/utils/get-level-rating-text.util';
import { getMistakesTypeText } from '../../../@generic/utils/get-mistakes-type-text.util';
import { stringToGameState } from '../../../game/utils/string-to-game-state.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { MAX_TECHNIQUE_TILES } from '../../constants/challenge-run-stats.constant';
import { getChallengeRivalRunSummary } from '../../utils/get-challenge-rival-run-summary.util';
import { getChallengeTechniqueSummary } from '../../utils/get-challenge-technique-summary.util';
import { ChallengeRivalChip } from '../challenge-rival-chip/challenge-rival-chip';
import { ChallengeRunStats } from '../challenge-run-stats/challenge-run-stats';
import { ChallengeTechniquePreview } from '../challenge-technique-preview/challenge-technique-preview';

import { ChallengeAcceptScreenSelectors } from './challenge-accept-screen.selectors';
import { ChallengeAcceptScreenStyles as styles } from './challenge-accept-screen.styles';

const MEDALLION_ICON_SIZE = 40;

interface Props {
    readonly opponentTotalTime: number;
    readonly challengeState: string;
    readonly isLoading: boolean;
    readonly onAccept: () => void;
}

export const ChallengeAcceptScreen = ({ opponentTotalTime, challengeState, isLoading, onAccept }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const opponentTotalTimeText = useTimerText(opponentTotalTime);

    const rivalGameState = stringToGameState(challengeState);
    const rivalSummary = getChallengeRivalRunSummary(challengeState, opponentTotalTime);
    const { awayRanges, techniqueEvents } = rivalSummary;
    const difficultyText = t(getDifficultyMessage(rivalGameState.difficulty));
    const levelText = getLevelRatingText(difficultyText, rivalGameState.rating, rivalGameState.isRatingCeiling);
    const mistakesText = t(getMistakesTypeText(rivalGameState.maxMistakes));
    const chipText = `${t`Rival challenged you`} · ${levelText} · ${mistakesText}`;
    const arsenalCardCount = Math.min(getChallengeTechniqueSummary(techniqueEvents).length, MAX_TECHNIQUE_TILES);
    const arsenalTagText = t({ message: plural(arsenalCardCount, { one: '# technique', other: '# techniques' }) });

    const medallionStyle = [styles.medallion, { backgroundColor: theme.colors.ink }];
    const titleStyle = [styles.title, { color: theme.colors.text.primary }];
    const timeLabelStyle = [styles.timeLabel, { color: theme.colors.text.hint }];
    const timeValueStyle = [styles.timeValue, { color: theme.colors.text.primary }];
    const beatTextStyle = [styles.beatText, { color: theme.colors.text.primary }];
    const arsenalLabelStyle = [styles.arsenalLabel, { color: theme.colors.text.hint }];
    const arsenalTagStyle = [styles.arsenalTag, { color: theme.colors.text.hint }];

    const maybeLaterButton = (
        <GlassIconButton accessibilityLabel={t`Maybe later`} href="/" testID={ChallengeAcceptScreenSelectors.MaybeLaterButton}>
            <LucideX color={theme.colors.inkText} />
        </GlassIconButton>
    );

    const footer = (
        <ScreenActionBar right={maybeLaterButton}>
            <AppLinkButton
                isLoading={isLoading}
                onPress={onAccept}
                testID={ChallengeAcceptScreenSelectors.AcceptButton}
                text={t`Accept challenge`}
            />
        </ScreenActionBar>
    );

    return (
        <ChromeScrollPage footer={footer} testID={ChallengeAcceptScreenSelectors.Root}>
            <View style={styles.content}>
                <View style={medallionStyle}>
                    <LucideSwords color={theme.colors.inkText} size={MEDALLION_ICON_SIZE} strokeWidth={1.9} />
                </View>

                <Text allowFontScaling={false} style={titleStyle}>
                    {t`Accept challenge?`}
                </Text>

                <ChallengeRivalChip chipText={chipText} />

                <View style={styles.timeBlock}>
                    <Text allowFontScaling={false} style={timeLabelStyle}>
                        <Trans>Their time to beat</Trans>
                    </Text>
                    <Text allowFontScaling={false} style={timeValueStyle} testID={ChallengeAcceptScreenSelectors.OpponentTime}>
                        {opponentTotalTimeText}
                    </Text>
                    <Text allowFontScaling={false} style={beatTextStyle}>
                        <Trans>Can you beat them?</Trans>
                    </Text>
                </View>

                <View style={styles.timelineWrap} testID={ChallengeAcceptScreenSelectors.Timeline}>
                    <ChallengeTechniquePreview awayRanges={awayRanges} events={techniqueEvents} totalTime={opponentTotalTime} />
                </View>

                <View style={styles.arsenalHeader}>
                    <Text allowFontScaling={false} style={arsenalLabelStyle}>
                        {t`Rival's arsenal`}
                    </Text>
                    <Text allowFontScaling={false} style={arsenalTagStyle}>
                        {arsenalTagText}
                    </Text>
                </View>

                <ChallengeRunStats summary={rivalSummary} />
            </View>
        </ChromeScrollPage>
    );
};
