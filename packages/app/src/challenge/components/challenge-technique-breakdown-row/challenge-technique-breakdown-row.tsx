import { useLingui } from '@lingui/react';
import { use } from 'react';
import { Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { ThemeContext } from '../../../theme/context/theme.context';
import { getTechniqueTierColor } from '../../utils/get-technique-tier-color.util';
import { TechniqueGlyph } from '../technique-glyph/technique-glyph';

import { ChallengeTechniqueBreakdownRowStyles as styles } from './challenge-technique-breakdown-row.styles';

import type { ChallengeTechniqueSummaryItemInterface } from '../../utils/get-challenge-technique-summary.util';

const ENTER_STAGGER_MS = 60;
const ENTER_DURATION_MS = 320;
const GLYPH_SIZE = 20;

interface Props {
    readonly item: ChallengeTechniqueSummaryItemInterface;
    readonly index: number;
    readonly highlighted: boolean;
}

export const ChallengeTechniqueBreakdownRow = ({ item, index, highlighted }: Props) => {
    const { _ } = useLingui();
    const { theme } = use(ThemeContext);

    const textColor = highlighted ? theme.colors.label.inverted : theme.colors.label.main;
    const rowBackgroundColor = highlighted ? theme.colors.label.main : theme.colors.cell.highlighted;
    const glyphLitColor = highlighted ? theme.colors.label.inverted : getTechniqueTierColor(item.tier, theme);
    const glyphDimColor = highlighted ? theme.colors.white05 : theme.colors.black05;

    const rowStyle = [styles.row, { backgroundColor: rowBackgroundColor }];
    const labelStyle = [styles.label, { color: textColor }];
    const countStyle = [styles.count, { color: textColor }];
    const enterAnimation = FadeInDown.delay(index * ENTER_STAGGER_MS).duration(ENTER_DURATION_MS);

    return (
        <Animated.View entering={enterAnimation} style={rowStyle}>
            <TechniqueGlyph dimColor={glyphDimColor} litColor={glyphLitColor} size={GLYPH_SIZE} technique={item.technique} />
            <Text allowFontScaling={false} numberOfLines={1} style={labelStyle}>
                {_(techniqueLabelsConstant[item.technique])}
            </Text>
            <Text allowFontScaling={false} style={countStyle}>{`×${item.count}`}</Text>
        </Animated.View>
    );
};
