import { useLingui } from '@lingui/react';
import { use } from 'react';
import { Text, View } from 'react-native';

import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { ThemeContext } from '../../../theme/context/theme.context';
import { getTechniqueTierColor } from '../../utils/get-technique-tier-color.util';
import { ChallengeTechniqueArsenalStyles as styles } from '../challenge-technique-arsenal/challenge-technique-arsenal.styles';
import { TechniqueGlyph } from '../technique-glyph/technique-glyph';

import type { ChallengeTechniqueSummaryItemInterface } from '../../utils/get-challenge-technique-summary.util';

const GLYPH_SIZE = 26;
const GLYPH_GAP = 3;

interface Props {
    readonly item: ChallengeTechniqueSummaryItemInterface;
    readonly highlighted: boolean;
    readonly testID?: string;
}

export const ChallengeTechniqueArsenalCard = ({ item, highlighted, testID }: Props) => {
    const { _ } = useLingui();
    const { theme } = use(ThemeContext);

    const glyphLitColor = highlighted ? theme.colors.label.inverted : getTechniqueTierColor(item.tier, theme);
    const glyphDimColor = theme.colors.black05;

    const cardStyle = [
        styles.card,
        {
            backgroundColor: highlighted ? theme.colors.black : theme.colors.white,
            borderColor: highlighted ? theme.colors.black : theme.colors.value.border
        }
    ];
    const countStyle = [
        styles.count,
        {
            backgroundColor: highlighted ? theme.colors.label.inverted : theme.colors.cell.highlighted,
            color: highlighted ? theme.colors.black : theme.colors.label.main
        }
    ];
    const glyphBoxStyle = [styles.glyphBox, { backgroundColor: highlighted ? theme.colors.white05 : theme.colors.cell.highlighted }];
    const nameStyle = [styles.name, { color: highlighted ? theme.colors.label.inverted : theme.colors.label.main }];

    return (
        <View style={cardStyle} testID={testID}>
            <Text allowFontScaling={false} style={countStyle}>{`×${item.count}`}</Text>
            <View style={glyphBoxStyle}>
                <TechniqueGlyph
                    dimColor={glyphDimColor}
                    gap={GLYPH_GAP}
                    litColor={glyphLitColor}
                    size={GLYPH_SIZE}
                    technique={item.technique}
                />
            </View>
            <Text allowFontScaling={false} numberOfLines={2} style={nameStyle}>
                {_(techniqueLabelsConstant[item.technique])}
            </Text>
        </View>
    );
};
