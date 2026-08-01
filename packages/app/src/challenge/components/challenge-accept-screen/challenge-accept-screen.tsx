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
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { getMistakesTypeText } from '../../../@generic/utils/get-mistakes-type-text.util';
import { stringToGameState } from '../../../game/utils/string-to-game-state.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { MAX_TECHNIQUE_TILES } from '../../constants/challenge-run-stats.constant';
import { getChallengeRivalRunSummary } from '../../utils/get-challenge-rival-run-summary.util';
import { getChallengeTechniqueSummary } from '../../utils/get-challenge-technique-summary.util';
import { ChallengeRunStats } from '../challenge-run-stats/challenge-run-stats';
import { ChallengeTechniquePreview } from '../challenge-technique-preview/challenge-technique-preview';

import { ChallengeAcceptScreenSelectors } from './challenge-accept-screen.selectors';
import { ChallengeAcceptScreenStyles as styles } from './challenge-accept-screen.styles';

const MEDALLION_ICON_SIZE = 40;
const RIVAL_INITIAL = 'R';

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
    const difficultyText = getDifficultyText(rivalGameState.difficulty);
    const mistakesText = getMistakesTypeText(rivalGameState.maxMistakes);
    const chipText = `${t`Rival challenged you`} · ${difficultyText} · ${mistakesText}`;
    const arsenalCardCount = Math.min(getChallengeTechniqueSummary(techniqueEvents).length, MAX_TECHNIQUE_TILES);
    const arsenalTagText = plural(arsenalCardCount, { one: '# technique', other: '# techniques' });

    const medallionStyle = [styles.medallion, { backgroundColor: theme.colors.ink }];
    const titleStyle = [styles.title, { color: theme.colors.text.primary }];
    const chipStyle = [styles.chip, { backgroundColor: theme.colors.ink }];
    const chipAvatarStyle = [styles.chipAvatar, { backgroundColor: theme.colors.overlayDark }];
    const chipAvatarTextStyle = [styles.chipAvatarText, { color: theme.colors.inkText }];
    const chipTextStyle = [styles.chipText, { color: theme.colors.inkText }];
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

                <View style={chipStyle}>
                    <View style={chipAvatarStyle}>
                        <Text allowFontScaling={false} style={chipAvatarTextStyle}>
                            {RIVAL_INITIAL}
                        </Text>
                    </View>
                    <Text allowFontScaling={false} numberOfLines={1} style={chipTextStyle}>
                        {chipText}
                    </Text>
                </View>

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
