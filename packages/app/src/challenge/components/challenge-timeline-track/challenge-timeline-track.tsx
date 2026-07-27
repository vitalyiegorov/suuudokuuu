import { type ReactNode, use } from 'react';
import { View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';

import { ChallengeTimelineTrackStyles as styles } from './challenge-timeline-track.styles';

import type { ChallengeTapeMarkInterface } from '../../utils/get-challenge-tape-marks.util';
import type { ViewStyle } from 'react-native';

const MarkBaseHeight = 7;
const MarkHeightStep = 2;
const FillerHeight = 5;
const MarkPassedOpacity = 0.7;
const MarkUpcomingOpacity = 0.26;
const FillerPassedOpacity = 0.3;
const FillerUpcomingOpacity = 0.14;

interface Props {
    readonly children?: ReactNode;
    readonly marks: ChallengeTapeMarkInterface[];
    readonly progress: number;
}

export const ChallengeTimelineTrack = ({ children, marks, progress }: Props) => {
    const { theme } = use(ThemeContext);

    const baselineStyle = [styles.baseline, { backgroundColor: theme.colors.label.main }];

    return (
        <View style={styles.track}>
            <View pointerEvents="none" style={baselineStyle} />

            {marks.map((mark, index) => {
                const markPercent = (index + 0.5) / marks.length;
                const isPassed = progress >= markPercent;
                const isMark = mark.tier !== null;
                const markOpacity = isPassed ? MarkPassedOpacity : MarkUpcomingOpacity;
                const fillerOpacity = isPassed ? FillerPassedOpacity : FillerUpcomingOpacity;
                const markStyle: ViewStyle = {
                    backgroundColor: theme.colors.label.main,
                    height: isMark ? MarkBaseHeight + mark.complexity * MarkHeightStep : FillerHeight,
                    opacity: isMark ? markOpacity : fillerOpacity
                };
                const awayStyle = [styles.awayTick, { backgroundColor: theme.colors.label.main }];
                const tickStyle = mark.isAway ? awayStyle : [styles.tick, markStyle];
                const tickKey = `timeline-tick-${index}`;

                return <View key={tickKey} style={tickStyle} />;
            })}

            {children}
        </View>
    );
};
