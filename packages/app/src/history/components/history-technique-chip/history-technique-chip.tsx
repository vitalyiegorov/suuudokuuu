import { useLingui } from '@lingui/react';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { ThemeContext } from '../../../theme/context/theme.context';
import { HistoryTechniqueTierGlyph } from '../history-technique-tier-glyph/history-technique-tier-glyph';

import { HistoryTechniqueChipStyles as styles } from './history-technique-chip.styles';

import type { TechniqueUsageInterface } from '../../interfaces/technique-usage.interface';

const GlyphSize = 16;
const GlyphGap = 2;

interface Props {
    readonly usage: TechniqueUsageInterface;
    readonly testID?: string;
}

export const HistoryTechniqueChip = ({ usage, testID }: Props) => {
    const { _ } = useLingui();
    const { theme } = use(ThemeContext);

    const chipStyles = [styles.chip, { backgroundColor: theme.colors.ink }];
    const labelStyles = [styles.label, { color: theme.colors.inkText }];
    const techniqueLabel = _(techniqueLabelsConstant[usage.technique]);

    return (
        <View style={chipStyles} testID={testID}>
            <HistoryTechniqueTierGlyph gap={GlyphGap} size={GlyphSize} technique={usage.technique} />
            <BlackText numberOfLines={1} style={labelStyles}>
                {`${techniqueLabel} ×${usage.count}`}
            </BlackText>
        </View>
    );
};
