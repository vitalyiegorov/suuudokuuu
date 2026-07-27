import { View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { getChallengeTapeMarks } from '../../utils/get-challenge-tape-marks.util';

import { ChallengeRecordTapeStyles as styles } from './challenge-record-tape.styles';

import type { GameTimelineEventInterface } from '../../../game/interface/game-timeline-event.interface';

const TickCount = 44;
const MarkBaseHeight = 6;
const MarkHeightStep = 2;
const FillerHeight = 4;
const MarkOpacity = 0.75;
const FillerOpacity = 0.22;

interface Props {
    readonly elapsedTime: number;
    readonly timelineEvents: GameTimelineEventInterface[];
}

export const ChallengeRecordTape = ({ elapsedTime, timelineEvents }: Props) => {
    const { theme } = useUnistyles();

    const marks = getChallengeTapeMarks(timelineEvents, elapsedTime, TickCount);
    const baselineStyles = [styles.baseline, { backgroundColor: theme.colors.label.main }];

    return (
        <View style={styles.track}>
            <View pointerEvents="none" style={baselineStyles}>
                <View />
            </View>

            {marks.map((mark, index) => {
                const isPlacement = mark.tier !== null;
                const markHeight = isPlacement ? MarkBaseHeight + mark.complexity * MarkHeightStep : FillerHeight;
                const tickStyles = [
                    mark.isAway ? styles.awaySlot : styles.tick,
                    {
                        backgroundColor: theme.colors.label.main,
                        ...(!mark.isAway && { height: markHeight, opacity: isPlacement ? MarkOpacity : FillerOpacity })
                    }
                ];

                return <View key={`record-tick-${index}`} style={tickStyles} />;
            })}
        </View>
    );
};
