import { useLingui } from '@lingui/react';
import { use } from 'react';
import { Text, View } from 'react-native';

import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { ThemeContext } from '../../../theme/context/theme.context';
import { getTechniqueTierColor } from '../../utils/get-technique-tier-color.util';
import { ChallengeTechniqueCountBadge } from '../challenge-technique-count-badge/challenge-technique-count-badge';
import { TechniqueGlyph } from '../technique-glyph/technique-glyph';

import { ChallengeTechniqueArsenalCardStyles as styles } from './challenge-technique-arsenal-card.styles';

import type { ChallengeTechniqueSummaryItemInterface } from '../../utils/get-challenge-technique-summary.util';

const GLYPH_SIZE = 34;
const GLYPH_GAP = 4;

interface Props {
    readonly item: ChallengeTechniqueSummaryItemInterface;
    readonly testID?: string;
}

export const ChallengeTechniqueArsenalCard = ({ item, testID }: Props) => {
    const { _ } = useLingui();
    const { theme } = use(ThemeContext);

    const tileStyle = [styles.tile, { backgroundColor: theme.colors.black }];
    const nameStyle = [styles.name, { color: theme.colors.label.main }];

    return (
        <View style={styles.column} testID={testID}>
            <View style={tileStyle}>
                <TechniqueGlyph
                    dimColor={theme.colors.white05}
                    gap={GLYPH_GAP}
                    litColor={getTechniqueTierColor(item.tier, theme, 'inverted')}
                    size={GLYPH_SIZE}
                    technique={item.technique}
                />
                <ChallengeTechniqueCountBadge count={item.count} />
            </View>
            <Text allowFontScaling={false} numberOfLines={2} style={nameStyle}>
                {_(techniqueLabelsConstant[item.technique])}
            </Text>
        </View>
    );
};
