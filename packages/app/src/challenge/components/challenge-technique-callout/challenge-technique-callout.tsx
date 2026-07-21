import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { use } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { ThemeContext } from '../../../theme/context/theme.context';
import { getLatestChallengeTechniqueEvent } from '../../utils/get-latest-challenge-technique-event.util';
import { getTechniqueTierColor } from '../../utils/get-technique-tier-color.util';

import { ChallengeTechniqueCalloutStyles as styles } from './challenge-technique-callout.styles';

import type { ChallengeTechniqueEventInterface } from '../../interfaces/challenge-technique-event.interface';

const SPRING_DAMPING = 15;
const SPRING_STIFFNESS = 170;
const SPRING_MASS = 0.5;
const EXIT_DURATION_MS = 160;

const enterAnimation = FadeInDown.springify().damping(SPRING_DAMPING).stiffness(SPRING_STIFFNESS).mass(SPRING_MASS);
const exitAnimation = FadeOut.duration(EXIT_DURATION_MS);

interface Props {
    readonly events: ChallengeTechniqueEventInterface[];
    readonly elapsedTime: number;
}

export const ChallengeTechniqueCallout = ({ events, elapsedTime }: Props) => {
    const { _ } = useLingui();
    const { theme } = use(ThemeContext);

    const latest = getLatestChallengeTechniqueEvent(events, elapsedTime);

    if (latest === null) {
        return null;
    }

    const techniqueLabel = _(techniqueLabelsConstant[latest.event.technique]);
    const tierColor = getTechniqueTierColor(latest.event.tier, theme, 'inverted');
    const chipStyle = [styles.chip, { backgroundColor: theme.colors.black }];
    const dotStyle = [styles.dot, { backgroundColor: tierColor }];
    const rivalStyle = [styles.rival, { color: theme.colors.white05 }];
    const techniqueStyle = [styles.technique, { color: theme.colors.label.inverted }];

    return (
        <Animated.View entering={enterAnimation} exiting={exitAnimation} key={latest.index} style={chipStyle}>
            <View style={dotStyle} />
            <Text allowFontScaling={false} style={rivalStyle}>
                <Trans>Rival</Trans>
            </Text>
            <Text allowFontScaling={false} style={techniqueStyle}>
                {techniqueLabel}
            </Text>
        </Animated.View>
    );
};
