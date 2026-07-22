import { useLingui } from '@lingui/react';
import { Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { isDefined } from '@rnw-community/shared';

import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import {
    ChallengeRaceAccent,
    ChallengeRaceAccentBorder,
    ChallengeRaceAccentMuted,
    ChallengeRaceAccentSurface,
    ChallengeRaceFillerDim
} from '../../constants/challenge-race-palette.constant';
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

    const passedEvents = events.filter(event => event.cumulativeTime < elapsedTime);
    const latestEvent = passedEvents.at(-1);

    if (!isDefined(latestEvent)) {
        return null;
    }

    const techniqueCount = passedEvents.filter(event => event.technique === latestEvent.technique).length;
    const techniqueLabel = _(techniqueLabelsConstant[latestEvent.technique]);

    const badgeStyle = [styles.badge, { backgroundColor: ChallengeRaceAccentSurface, borderColor: ChallengeRaceAccentBorder }];
    const labelStyle = [styles.label, { color: ChallengeRaceAccent }];
    const countStyle = [styles.count, { color: ChallengeRaceAccentMuted }];

    return (
        <Animated.View entering={FadeIn.duration(ENTER_DURATION_MS)} key={`${latestEvent.technique}-${techniqueCount}`} style={badgeStyle}>
            <TechniqueGlyph
                dimColor={ChallengeRaceFillerDim}
                gap={GLYPH_GAP}
                litColor={ChallengeRaceAccent}
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
