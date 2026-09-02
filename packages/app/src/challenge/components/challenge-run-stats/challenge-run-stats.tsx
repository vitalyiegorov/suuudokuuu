import { useLingui } from '@lingui/react/macro';
import LucideCamera from 'lucide-react-native/icons/camera';
import LucideDoorOpen from 'lucide-react-native/icons/door-open';
import LucidePencil from 'lucide-react-native/icons/pencil';
import LucideShieldCheck from 'lucide-react-native/icons/shield-check';
import { use } from 'react';
import { View } from 'react-native';

import { isDefined, isEmptyArray, isPositiveNumber } from '@rnw-community/shared';

import { ThemeContext } from '../../../theme/context/theme.context';
import { MAX_TECHNIQUE_TILES, TILES_PER_ROW } from '../../constants/challenge-run-stats.constant';
import { getChallengeTechniqueSummary } from '../../utils/get-challenge-technique-summary.util';
import { ChallengeStatTile } from '../challenge-stat-tile/challenge-stat-tile';
import { ChallengeTechniqueTile } from '../challenge-technique-tile/challenge-technique-tile';

import { ChallengeRunStatsSelectors } from './challenge-run-stats.selectors';
import { ChallengeRunStatsStyles as styles } from './challenge-run-stats.styles';

import type { ChallengeRunSummaryInterface } from '../../interfaces/challenge-run-summary.interface';
import type { ReactNode } from 'react';

const ICON_SIZE = 28;

interface Props {
    readonly summary: ChallengeRunSummaryInterface;
}

export const ChallengeRunStats = ({ summary }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const { awaySeconds, exitCount, pencilCount, screenshotCount, techniqueEvents } = summary;

    const iconColor = theme.colors.inkText;
    const hasExits = isPositiveNumber(exitCount);
    const hasScreenshots = isPositiveNumber(screenshotCount);

    const cleanRunTile =
        hasExits || hasScreenshots ? null : (
            <ChallengeStatTile key="clean-run" label={t`Clean run`} testID={ChallengeRunStatsSelectors.CleanRunTile}>
                <LucideShieldCheck color={iconColor} size={ICON_SIZE} />
            </ChallengeStatTile>
        );
    const exitsTile = hasExits ? (
        <ChallengeStatTile count={exitCount} key="exits" label={t`${awaySeconds}s away`} testID={ChallengeRunStatsSelectors.ExitsTile}>
            <LucideDoorOpen color={iconColor} size={ICON_SIZE} />
        </ChallengeStatTile>
    ) : null;
    const screenshotsTile = hasScreenshots ? (
        <ChallengeStatTile
            count={screenshotCount}
            key="screenshots"
            label={t`Screenshots`}
            testID={ChallengeRunStatsSelectors.ScreenshotsTile}
        >
            <LucideCamera color={iconColor} size={ICON_SIZE} />
        </ChallengeStatTile>
    ) : null;
    const pencilTile = isDefined(pencilCount) ? (
        <ChallengeStatTile count={pencilCount} key="pencil" label={t`Pencil marks`} testID={ChallengeRunStatsSelectors.PencilTile}>
            <LucidePencil color={iconColor} size={ICON_SIZE} />
        </ChallengeStatTile>
    ) : null;
    const techniqueTiles = getChallengeTechniqueSummary(techniqueEvents)
        .slice(0, MAX_TECHNIQUE_TILES)
        .map(item => (
            <ChallengeTechniqueTile
                item={item}
                key={item.technique}
                testID={`${ChallengeRunStatsSelectors.TechniqueTile}.${item.technique}`}
            />
        ));

    const tiles = [cleanRunTile, exitsTile, screenshotsTile, pencilTile, ...techniqueTiles].filter(isDefined);
    if (isEmptyArray(tiles)) {
        return null;
    }

    const rows: ReactNode[][] = [];
    for (let index = 0; index < tiles.length; index += TILES_PER_ROW) {
        rows.push(tiles.slice(index, index + TILES_PER_ROW));
    }

    return (
        <View style={styles.grid} testID={ChallengeRunStatsSelectors.Root}>
            {rows.map((row, rowIndex) => {
                const spacers = Array.from({ length: TILES_PER_ROW - row.length }, (_unused, spacerIndex) => (
                    <View key={`spacer-${spacerIndex}`} style={styles.spacer} />
                ));

                return (
                    <View key={`run-stats-row-${rowIndex}`} style={styles.row}>
                        {row}
                        {spacers}
                    </View>
                );
            })}
        </View>
    );
};
