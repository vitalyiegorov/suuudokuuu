import { Trans, useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';
import { historyGetBestTechnique } from '../../utils/history-get-best-technique.util';
import { historyGetTechniqueUsageList } from '../../utils/history-get-technique-usage.util';
import { HistoryTechniqueHero } from '../history-technique-hero/history-technique-hero';
import { HistoryTechniqueRow } from '../history-technique-row/history-technique-row';

import { HistoryTechniquesSelectors } from './history-techniques.selectors';
import { HistoryTechniquesStyles as styles } from './history-techniques.styles';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

interface Props {
    readonly techniqueUsageCounts: Partial<Record<SolutionTechniqueEnum, number>>;
}

export const HistoryTechniques = ({ techniqueUsageCounts }: Props) => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const usageList = historyGetTechniqueUsageList(techniqueUsageCounts);
    const bestTechniqueUsage = historyGetBestTechnique(usageList);

    if (!isDefined(bestTechniqueUsage)) {
        return null;
    }

    const listStyles = [styles.list, { backgroundColor: theme.colors.candidate.fill, borderColor: theme.colors.surface.border }];
    const titleStyles = [styles.title, { color: theme.colors.text.primary }];

    return (
        <View style={styles.container} testID={HistoryTechniquesSelectors.Root}>
            <HistoryTechniqueHero label={t`Best technique`} usage={bestTechniqueUsage} />

            <View style={listStyles}>
                <BlackText style={titleStyles}>
                    <Trans>Techniques used</Trans>
                </BlackText>

                {usageList.map(usage => (
                    <HistoryTechniqueRow
                        key={usage.technique}
                        testID={`${HistoryTechniquesSelectors.Row}.${usage.technique}`}
                        usage={usage}
                    />
                ))}
            </View>
        </View>
    );
};
