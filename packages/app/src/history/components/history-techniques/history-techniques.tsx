import { Trans, useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';
import { HistoryTechniqueTilesPerRow } from '../../constants/history-technique-grid.constant';
import { historyGetBestTechnique } from '../../utils/history-get-best-technique.util';
import { historyGetTechniqueUsageList } from '../../utils/history-get-technique-usage.util';
import { HistoryTechniqueHero } from '../history-technique-hero/history-technique-hero';
import { HistoryTechniqueTile } from '../history-technique-tile/history-technique-tile';

import { HistoryTechniquesSelectors } from './history-techniques.selectors';
import { HistoryTechniquesStyles as styles } from './history-techniques.styles';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import type { ReactNode } from 'react';

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

    const gridUsageList = [...usageList].sort((first, second) => second.count - first.count || second.seValue - first.seValue);
    const eyebrowStyles = [styles.eyebrow, { color: theme.colors.text.hint }];

    const rows: ReactNode[][] = [];
    for (let index = 0; index < gridUsageList.length; index += HistoryTechniqueTilesPerRow) {
        const tiles = gridUsageList
            .slice(index, index + HistoryTechniqueTilesPerRow)
            .map(usage => (
                <HistoryTechniqueTile
                    key={usage.technique}
                    testID={`${HistoryTechniquesSelectors.Tile}.${usage.technique}`}
                    usage={usage}
                />
            ));

        rows.push(tiles);
    }

    return (
        <View style={styles.container} testID={HistoryTechniquesSelectors.Root}>
            <BlackText style={eyebrowStyles}>
                <Trans>Your arsenal</Trans>
            </BlackText>

            <HistoryTechniqueHero label={t`Best technique`} testID={HistoryTechniquesSelectors.Hero} usage={bestTechniqueUsage} />

            <View style={styles.grid}>
                {rows.map((row, rowIndex) => {
                    const spacers = Array.from({ length: HistoryTechniqueTilesPerRow - row.length }, (_unused, spacerIndex) => (
                        <View key={`spacer-${spacerIndex}`} style={styles.spacer} />
                    ));

                    return (
                        <View key={`technique-row-${rowIndex}`} style={styles.row}>
                            {row}
                            {spacers}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};
