import { useLingui } from '@lingui/react';
import { use } from 'react';

import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { ThemeContext } from '../../../theme/context/theme.context';
import { getTechniqueTierColor } from '../../utils/get-technique-tier-color.util';
import { ChallengeStatTile } from '../challenge-stat-tile/challenge-stat-tile';
import { TechniqueGlyph } from '../technique-glyph/technique-glyph';

import type { ChallengeTechniqueSummaryItemInterface } from '../../utils/get-challenge-technique-summary.util';

const GLYPH_SIZE = 34;
const GLYPH_GAP = 4;

interface Props {
    readonly item: ChallengeTechniqueSummaryItemInterface;
    readonly testID?: string;
}

export const ChallengeTechniqueTile = ({ item, testID }: Props) => {
    const { _ } = useLingui();
    const { theme } = use(ThemeContext);

    return (
        <ChallengeStatTile count={item.count} label={_(techniqueLabelsConstant[item.technique])} testID={testID}>
            <TechniqueGlyph
                accentColor={theme.colors.red}
                dimColor={theme.colors.white05}
                gap={GLYPH_GAP}
                litColor={getTechniqueTierColor(item.tier, theme, 'inverted')}
                size={GLYPH_SIZE}
                technique={item.technique}
            />
        </ChallengeStatTile>
    );
};
