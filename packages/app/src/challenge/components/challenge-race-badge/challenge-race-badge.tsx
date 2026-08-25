import { useLingui } from '@lingui/react';
import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { use } from 'react';
import { Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { isDefined } from '@rnw-community/shared';

import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { useReduceMotion } from '../../../@generic/hooks/use-reduce-motion.hook';
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

    const isMotionReduced = useReduceMotion();

    const passedEvents = events.filter(event => event.cumulativeTime < elapsedTime);
    const latestEvent = passedEvents.at(-1);

    if (!isDefined(latestEvent)) {
        return null;
    }

    const techniqueCount = passedEvents.filter(event => event.technique === latestEvent.technique).length;
    const techniqueLabel = _(techniqueLabelsConstant[latestEvent.technique]);

    const badgeStyle = [styles.badge, { borderColor: theme.colors.surface.border }];
    const labelStyle = [styles.label, { color: theme.colors.text.primary }];
    const countStyle = [styles.count, { color: theme.colors.text.primary }];
    const enteringProps = isMotionReduced ? {} : { entering: FadeIn.duration(ENTER_DURATION_MS) };

    return (
        <Animated.View key={`${latestEvent.technique}-${techniqueCount}`} style={badgeStyle} {...enteringProps}>
            <TechniqueGlyph
                accentColor={theme.colors.danger}
                dimColor={theme.colors.text.hint}
                gap={GLYPH_GAP}
                litColor={theme.colors.text.primary}
                size={GLYPH_SIZE}
                technique={latestEvent.technique}
            />
            <Text maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} style={labelStyle}>
                {techniqueLabel}
            </Text>
            <Text maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} style={countStyle}>{`×${techniqueCount}`}</Text>
        </Animated.View>
    );
};
