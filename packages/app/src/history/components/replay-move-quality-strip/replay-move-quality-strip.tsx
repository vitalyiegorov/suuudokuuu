import { use } from 'react';
import { View } from 'react-native';

import { isEmptyArray } from '@rnw-community/shared';

import { getTechniqueTierColor } from '../../../challenge/utils/get-technique-tier-color.util';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ReplayMoveQualityStripSelectors } from './replay-move-quality-strip.selectors';
import { ReplayMoveQualityStripStyles as styles } from './replay-move-quality-strip.styles';

import type { ChallengeTechniqueEventInterface } from '../../../challenge/interfaces/challenge-technique-event.interface';

interface Props {
    readonly techniqueEvents: readonly ChallengeTechniqueEventInterface[];
}

export const ReplayMoveQualityStrip = ({ techniqueEvents }: Props) => {
    const { theme } = use(ThemeContext);

    if (isEmptyArray(techniqueEvents)) {
        return null;
    }

    return (
        <View style={styles.container} testID={ReplayMoveQualityStripSelectors.Root}>
            {techniqueEvents.map((event, index) => {
                const segmentStyle = [styles.segment, { backgroundColor: getTechniqueTierColor(event.tier, theme) }];

                return <View key={`move-quality-${index}-${event.technique}`} style={segmentStyle} />;
            })}
        </View>
    );
};
