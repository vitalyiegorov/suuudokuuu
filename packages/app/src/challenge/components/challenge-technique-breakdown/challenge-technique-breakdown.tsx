import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { AppSurfaceCard } from '@suuudokuuu/ui';
import { LucideSwords } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { isEmptyArray } from '@rnw-community/shared';

import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeTechniqueTierEnum } from '../../enums/challenge-technique-tier.enum';
import { getChallengeTechniqueSummary } from '../../utils/get-challenge-technique-summary.util';
import { ChallengeTechniqueBreakdownRow } from '../challenge-technique-breakdown-row/challenge-technique-breakdown-row';

import { ChallengeTechniqueBreakdownStyles as styles } from './challenge-technique-breakdown.styles';

import type { ChallengeTechniqueEventInterface } from '../../interfaces/challenge-technique-event.interface';

const MAX_VISIBLE_TECHNIQUES = 6;
const HEADER_ICON_SIZE = 19;

interface Props {
    readonly events: ChallengeTechniqueEventInterface[];
}

export const ChallengeTechniqueBreakdown = ({ events }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    if (isEmptyArray(events)) {
        return null;
    }

    const summary = getChallengeTechniqueSummary(events);
    const visibleSummary = summary.slice(0, MAX_VISIBLE_TECHNIQUES);
    const sharpCount = events.filter(
        event => event.tier === ChallengeTechniqueTierEnum.Clever || event.tier === ChallengeTechniqueTierEnum.Advanced
    ).length;
    const headlineText =
        sharpCount > 0 ? plural(sharpCount, { one: '# sharp technique', other: '# sharp techniques' }) : t`Solved with the fundamentals`;

    const labelStyle = [styles.label, { color: theme.colors.label.hint }];
    const headlineStyle = [styles.headline, { color: theme.colors.label.main }];
    const iconBoxStyle = [styles.iconBox, { backgroundColor: theme.colors.cell.highlighted }];

    return (
        <AppSurfaceCard size="compact" style={styles.container}>
            <View style={styles.header}>
                <View style={styles.textColumn}>
                    <Text allowFontScaling={false} style={labelStyle}>
                        {t`Rival's playbook`}
                    </Text>
                    <Text allowFontScaling={false} style={headlineStyle}>
                        {headlineText}
                    </Text>
                </View>
                <View style={iconBoxStyle}>
                    <LucideSwords color={theme.colors.label.main} size={HEADER_ICON_SIZE} />
                </View>
            </View>
            {visibleSummary.map((item, index) => (
                <ChallengeTechniqueBreakdownRow highlighted={index === 0} index={index} item={item} key={item.technique} />
            ))}
        </AppSurfaceCard>
    );
};
