import { useLingui } from '@lingui/react';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { ThemeContext } from '../../../theme/context/theme.context';
import { HistoryTechniqueGlyph } from '../history-technique-glyph/history-technique-glyph';

import { HistoryTechniqueRowStyles as styles } from './history-technique-row.styles';

import type { TechniqueUsageInterface } from '../../interfaces/technique-usage.interface';

const GlyphSize = 26;
const GlyphGap = 3;

interface Props {
    readonly usage: TechniqueUsageInterface;
    readonly testID?: string;
}

export const HistoryTechniqueRow = ({ usage, testID }: Props) => {
    const { _ } = useLingui();
    const { theme } = use(ThemeContext);

    const techniqueLabel = _(techniqueLabelsConstant[usage.technique]);
    const labelStyles = [styles.label, { color: theme.colors.text.primary }];
    const countStyles = [styles.count, { color: theme.colors.text.hint }];

    return (
        <View style={styles.row} testID={testID}>
            <HistoryTechniqueGlyph gap={GlyphGap} size={GlyphSize} technique={usage.technique} />

            <BlackText numberOfLines={1} style={labelStyles}>
                {techniqueLabel}
            </BlackText>

            <BlackText style={countStyles}>{`×${usage.count}`}</BlackText>
        </View>
    );
};
