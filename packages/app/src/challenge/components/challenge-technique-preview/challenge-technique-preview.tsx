import { plural } from '@lingui/core/macro';
import { use } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { isEmptyArray } from '@rnw-community/shared';

import { ThemeContext } from '../../../theme/context/theme.context';
import { challengeTechniqueTierVisualConstant } from '../../constants/challenge-technique-tier-visual.constant';
import { ChallengeTechniqueTierEnum } from '../../enums/challenge-technique-tier.enum';
import { getTechniqueTierColor } from '../../utils/get-technique-tier-color.util';

import { ChallengeTechniquePreviewStyles as styles } from './challenge-technique-preview.styles';

import type { ChallengeTechniqueEventInterface } from '../../interfaces/challenge-technique-event.interface';
import type { ViewStyle } from 'react-native';

const TICK_STAGGER_MS = 18;
const TICK_DURATION_MS = 260;

interface Props {
    readonly events: ChallengeTechniqueEventInterface[];
}

export const ChallengeTechniquePreview = ({ events }: Props) => {
    const { theme } = use(ThemeContext);

    if (isEmptyArray(events)) {
        return null;
    }

    const sharpCount = events.filter(
        event => event.tier === ChallengeTechniqueTierEnum.Clever || event.tier === ChallengeTechniqueTierEnum.Advanced
    ).length;
    const captionText = plural(sharpCount, {
        one: '# sharp move on their timeline',
        other: '# sharp moves on their timeline'
    });

    const trackStyle = [styles.track, { backgroundColor: theme.colors.black }];
    const captionStyle = [styles.caption, { color: theme.colors.label.hint }];

    return (
        <View style={styles.container}>
            <View style={trackStyle}>
                {events.map((event, index) => {
                    const { height, width } = challengeTechniqueTierVisualConstant[event.tier];
                    const positionStyle: ViewStyle = {
                        backgroundColor: getTechniqueTierColor(event.tier, theme, 'inverted'),
                        height,
                        left: `${event.positionPercent}%`,
                        width
                    };
                    const tickStyle = [styles.tick, positionStyle];
                    const enterAnimation = FadeIn.delay(index * TICK_STAGGER_MS).duration(TICK_DURATION_MS);

                    return <Animated.View entering={enterAnimation} key={`preview-tick-${index}`} style={tickStyle} />;
                })}
            </View>
            <Text allowFontScaling={false} style={captionStyle}>
                {captionText}
            </Text>
        </View>
    );
};
