import { useLingui } from '@lingui/react';
import { use } from 'react';
import { Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { isDefined } from '@rnw-community/shared';

import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { ThemeContext } from '../../../theme/context/theme.context';
import { TechniqueGlyph } from '../technique-glyph/technique-glyph';

import { ChallengeRaceBadgeStyles as styles } from './challenge-race-badge.styles';

import type { ChallengeTechniqueEventInterface } from '../../interfaces/challenge-technique-event.interface';

const GLYPH_SIZE = 15;
const GLYPH_GAP = 1.5;
const ENTER_DURATION_MS = 220;

interface Props {
    readonly events: ChallengeTechniqueEventInterface[];
    readonly elapsedTime: number;
}

export const ChallengeRaceBadge = ({ events, elapsedTime }: Props) => {
    const { _ } = useLingui();
    const { theme } = use(ThemeContext);

    const passedEvents = events.filter(event => event.cumulativeTime < elapsedTime);
    const latestEvent = passedEvents.at(-1);

    if (!isDefined(latestEvent)) {
        return null;
    }

    const techniqueCount = passedEvents.filter(event => event.technique === latestEvent.technique).length;
    const techniqueLabel = _(techniqueLabelsConstant[latestEvent.technique]);

    const badgeStyle = [styles.badge, { backgroundColor: theme.colors.black05, borderColor: theme.colors.black05 }];
    const labelStyle = [styles.label, { color: theme.colors.label.main }];
    const countStyle = [styles.count, { color: theme.colors.label.main }];

    return (
        <Animated.View entering={FadeIn.duration(ENTER_DURATION_MS)} key={`${latestEvent.technique}-${techniqueCount}`} style={badgeStyle}>
            <TechniqueGlyph
                accentColor={theme.colors.red}
                dimColor={theme.colors.black05}
                gap={GLYPH_GAP}
                litColor={theme.colors.label.main}
                size={GLYPH_SIZE}
                technique={latestEvent.technique}
            />
            <Text allowFontScaling={false} style={labelStyle}>
                {techniqueLabel}
            </Text>
            <Text allowFontScaling={false} style={countStyle}>{`×${techniqueCount}`}</Text>
        </Animated.View>
    );
};
