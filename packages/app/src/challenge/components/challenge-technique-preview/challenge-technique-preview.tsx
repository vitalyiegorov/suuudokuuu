import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { isEmptyArray } from '@rnw-community/shared';

import { ThemeContext } from '../../../theme/context/theme.context';
import { getChallengeTimelineMarks } from '../../utils/get-challenge-timeline-marks.util';
import { getTechniqueTierColor } from '../../utils/get-technique-tier-color.util';

import { ChallengeTechniquePreviewStyles as styles } from './challenge-technique-preview.styles';

import type { ChallengeTechniqueEventInterface } from '../../interfaces/challenge-technique-event.interface';
import type { ViewStyle } from 'react-native';

const TICK_COUNT = 60;
const MARK_BASE_HEIGHT = 10;
const MARK_HEIGHT_STEP = 4;
const FILLER_HEIGHT = 2.5;
const FILLER_OPACITY = 0.18;
const TICK_STAGGER_MS = 10;
const TICK_DURATION_MS = 240;

interface Props {
    readonly events: ChallengeTechniqueEventInterface[];
}

export const ChallengeTechniquePreview = ({ events }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    if (isEmptyArray(events)) {
        return null;
    }

    const marks = getChallengeTimelineMarks(events, TICK_COUNT);
    const keyMoveCount = marks.filter(mark => mark.complexity > 0).length;
    const keyMovesText = plural(keyMoveCount, { one: '# key move', other: '# key moves' });
    const captionText = `${t`Taller marks = sharper techniques`} · ${keyMovesText}`;

    const sharpestMark = marks.reduce((sharpest, mark) => (mark.complexity > sharpest.complexity ? mark : sharpest), marks[0]);
    const markerColor = sharpestMark.tier === null ? theme.colors.label.hint : getTechniqueTierColor(sharpestMark.tier, theme, 'default');

    const trackStyle = [styles.track, { backgroundColor: theme.colors.black }];
    const barStyle = [styles.bar, { backgroundColor: markerColor }];
    const captionStyle = [styles.caption, { color: theme.colors.label.hint }];

    return (
        <View style={styles.container}>
            <View style={trackStyle}>
                {marks.map((mark, index) => {
                    const markColor = mark.tier === null ? theme.colors.white05 : getTechniqueTierColor(mark.tier, theme, 'inverted');
                    const markStyle: ViewStyle = {
                        backgroundColor: markColor,
                        height: mark.tier === null ? FILLER_HEIGHT : MARK_BASE_HEIGHT + mark.complexity * MARK_HEIGHT_STEP,
                        opacity: mark.tier === null ? FILLER_OPACITY : 1
                    };
                    const tickStyle = [styles.tick, markStyle];
                    const enterAnimation = FadeIn.delay(index * TICK_STAGGER_MS).duration(TICK_DURATION_MS);

                    return <Animated.View entering={enterAnimation} key={`tick-${index}`} style={tickStyle} />;
                })}
            </View>
            <View style={styles.captionRow}>
                <View style={barStyle} />
                <Text allowFontScaling={false} style={captionStyle}>
                    {captionText}
                </Text>
            </View>
        </View>
    );
};
