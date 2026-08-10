import { useLingui } from '@lingui/react';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { RatingBadge } from '../../../@generic/components/rating-badge/rating-badge';
import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { ThemeContext } from '../../../theme/context/theme.context';
import { HistoryTechniqueGlyph } from '../history-technique-glyph/history-technique-glyph';

import { HistoryTechniqueHeroStyles as styles } from './history-technique-hero.styles';

import type { TechniqueUsageInterface } from '../../interfaces/technique-usage.interface';

const GlyphSize = 30;
const GlyphGap = 3;

interface Props {
    readonly label: string;
    readonly usage: TechniqueUsageInterface;
}

export const HistoryTechniqueHero = ({ label, usage }: Props) => {
    const { _ } = useLingui();
    const { theme } = use(ThemeContext);

    const techniqueLabel = _(techniqueLabelsConstant[usage.technique]);
    const containerStyles = [styles.container, { backgroundColor: theme.colors.candidate.fill, borderColor: theme.colors.surface.border }];
    const labelStyles = [styles.label, { color: theme.colors.text.primary }];
    const valueStyles = [styles.value, { color: theme.colors.text.primary }];

    return (
        <View style={containerStyles}>
            <BlackText style={labelStyles}>{label}</BlackText>

            <View style={styles.row}>
                <HistoryTechniqueGlyph gap={GlyphGap} size={GlyphSize} technique={usage.technique} />

                <BlackText numberOfLines={1} style={valueStyles}>
                    {techniqueLabel}
                </BlackText>

                <RatingBadge isCeiling={false} rating={usage.seValue} />
            </View>
        </View>
    );
};
