import { useLingui } from '@lingui/react/macro';
import { View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { gameElapsedTimeSelector, gameTimelineEventsSelector } from '../../../game/store/game.selectors';
import { getChallengeTapeMarks } from '../../utils/get-challenge-tape-marks.util';
import { getTapeAxisTime } from '../../utils/get-tape-axis-time.util';
import { getTapeTechniqueEvents } from '../../utils/get-tape-technique-events.util';
import { ChallengeRaceBadge } from '../challenge-race-badge/challenge-race-badge';
import { ChallengeTimelineTrack } from '../challenge-timeline-track/challenge-timeline-track';

import { ChallengeRecordHudSelectors } from './challenge-record-hud.selectors';
import { ChallengeRecordHudStyles as styles } from './challenge-record-hud.styles';

const TickCount = 44;
const FullProgress = 1;
const BadgeLookaheadSeconds = 1;
const BlinkPeriodSeconds = 2;
const DimDotOpacity = 0.2;

export const ChallengeRecordHud = () => {
    const { t } = useLingui();
    const { theme } = useUnistyles();
    const elapsedTime = useAppSelector(gameElapsedTimeSelector);
    const timelineEvents = useAppSelector(gameTimelineEventsSelector);

    const isDotLit = elapsedTime % BlinkPeriodSeconds === 0;
    const dotOpacity = isDotLit ? 1 : DimDotOpacity;
    const dotStyles = [styles.recordDot, { backgroundColor: theme.colors.danger, opacity: dotOpacity }];
    const badgeStyles = [styles.badge, { color: theme.colors.text.primary }];
    const axisTime = getTapeAxisTime(elapsedTime, TickCount);
    const marks = getChallengeTapeMarks(timelineEvents, axisTime, TickCount);
    const techniqueEvents = getTapeTechniqueEvents(timelineEvents);
    const badgeElapsedTime = elapsedTime + BadgeLookaheadSeconds;

    return (
        <View style={styles.container} testID={ChallengeRecordHudSelectors.Root}>
            <View style={styles.header}>
                <View style={dotStyles} />

                <BlackText style={badgeStyles}>{t`Recording`}</BlackText>

                <View style={styles.badgeSlot}>
                    <ChallengeRaceBadge elapsedTime={badgeElapsedTime} events={techniqueEvents} />
                </View>
            </View>

            <ChallengeTimelineTrack marks={marks} progress={FullProgress} />
        </View>
    );
};
