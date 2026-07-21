import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
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
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    if (isEmptyArray(events)) {
        return null;
    }

    const sharpCount = events.filter(
        event => event.tier === ChallengeTechniqueTierEnum.Clever || event.tier === ChallengeTechniqueTierEnum.Advanced
    ).length;
    const keyMovesText = plural(sharpCount, { one: '# key move', other: '# key moves' });
    const captionText = `${t`Taller marks = sharper techniques`} · ${keyMovesText}`;

    const trackStyle = [styles.track, { backgroundColor: theme.colors.black }];
    const barStyle = [styles.bar, { backgroundColor: theme.colors.label.main }];
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
            <View style={styles.captionRow}>
                <View style={barStyle} />
                <Text allowFontScaling={false} style={captionStyle}>
                    {captionText}
                </Text>
            </View>
        </View>
    );
};
