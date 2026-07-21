import { Trans, useLingui } from '@lingui/react/macro';
import { ScreenChromeScrollView } from '@suuudokuuu/screen-chrome';
import { LucideSwords } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { ChromePage } from '../../../@generic/components/chrome-page/chrome-page';
import { useTimerText } from '../../../@generic/hooks/use-timer-text.hook';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { getMistakesTypeText } from '../../../@generic/utils/get-mistakes-type-text.util';
import { stringToGameState } from '../../../game/utils/string-to-game-state.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { getChallengeDifficulty } from '../../utils/get-challenge-difficulty.util';
import { getChallengeTechniqueEventsFromState } from '../../utils/get-challenge-technique-events-from-state.util';
import { ChallengeTechniqueArsenal } from '../challenge-technique-arsenal/challenge-technique-arsenal';
import { ChallengeTechniquePreview } from '../challenge-technique-preview/challenge-technique-preview';

import { ChallengeAcceptScreenSelectors } from './challenge-accept-screen.selectors';
import { ChallengeAcceptScreenStyles as styles } from './challenge-accept-screen.styles';

const MEDALLION_ICON_SIZE = 40;
const BOTTOM_INSET = 24;
const TOP_FADE_HEIGHT = 56;
const RIVAL_INITIAL = 'R';

interface Props {
    readonly opponentTotalTime: number;
    readonly challengeState: string;
    readonly onAccept: () => void;
}

export const ChallengeAcceptScreen = ({ opponentTotalTime, challengeState, onAccept }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const opponentTotalTimeText = useTimerText(opponentTotalTime);

    const techniqueEvents = getChallengeTechniqueEventsFromState(challengeState);
    const difficultyText = getDifficultyText(getChallengeDifficulty(challengeState));
    const mistakesText = getMistakesTypeText(stringToGameState(challengeState).maxMistakes);
    const chipText = `${t`Rival challenged you`} · ${difficultyText} · ${mistakesText}`;

    const medallionStyle = [styles.medallion, { backgroundColor: theme.colors.black }];
    const titleStyle = [styles.title, { color: theme.colors.label.main }];
    const chipStyle = [styles.chip, { backgroundColor: theme.colors.black }];
    const chipAvatarStyle = [styles.chipAvatar, { backgroundColor: theme.colors.white05 }];
    const chipAvatarTextStyle = [styles.chipAvatarText, { color: theme.colors.label.inverted }];
    const chipTextStyle = [styles.chipText, { color: theme.colors.label.inverted }];
    const timeLabelStyle = [styles.timeLabel, { color: theme.colors.label.hint }];
    const timeValueStyle = [styles.timeValue, { color: theme.colors.label.main }];
    const beatTextStyle = [styles.beatText, { color: theme.colors.label.main }];
    const arsenalLabelStyle = [styles.arsenalLabel, { color: theme.colors.label.hint }];
    const arsenalTagStyle = [styles.arsenalTag, { color: theme.colors.label.hint }];

    const topEdgeFadeProps = { height: TOP_FADE_HEIGHT };

    return (
        <ChromePage contentStyle={styles.chromeContent} testID={ChallengeAcceptScreenSelectors.Root} topEdgeFadeProps={topEdgeFadeProps}>
            <ScreenChromeScrollView
                contentContainerStyle={styles.scrollContent}
                contentInsetBottom={BOTTOM_INSET}
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
            >
                <View style={styles.content}>
                    <View style={medallionStyle}>
                        <LucideSwords color={theme.colors.label.inverted} size={MEDALLION_ICON_SIZE} strokeWidth={1.9} />
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
                        <Text allowFontScaling={false} style={timeValueStyle}>
                            {opponentTotalTimeText}
                        </Text>
                        <Text allowFontScaling={false} style={beatTextStyle}>
                            <Trans>Can you beat them?</Trans>
                        </Text>
                    </View>

                    <View style={styles.timelineWrap}>
                        <ChallengeTechniquePreview events={techniqueEvents} />
                    </View>

                    <View style={styles.arsenalHeader}>
                        <Text allowFontScaling={false} style={arsenalLabelStyle}>
                            {t`Rival's arsenal`}
                        </Text>
                        <Text allowFontScaling={false} style={arsenalTagStyle}>
                            <Trans>every technique</Trans>
                        </Text>
                    </View>

                    <ChallengeTechniqueArsenal events={techniqueEvents} />

                    <View style={styles.actions}>
                        <BlackButton onPress={onAccept} testID={ChallengeAcceptScreenSelectors.AcceptButton} text={t`Accept challenge`} />
                        <BlackButton href="/" text={t`Maybe later`} variant="ghost" />
                    </View>
                </View>
            </ScreenChromeScrollView>
        </ChromePage>
    );
};
