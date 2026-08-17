import { useLingui } from '@lingui/react';

import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { ChallengeStatTile } from '../../../challenge/components/challenge-stat-tile/challenge-stat-tile';
import { HistoryTechniqueTierGlyph } from '../history-technique-tier-glyph/history-technique-tier-glyph';

import type { TechniqueUsageInterface } from '../../interfaces/technique-usage.interface';

const GlyphSize = 34;
const GlyphGap = 4;

interface Props {
    readonly usage: TechniqueUsageInterface;
    readonly testID?: string;
}

export const HistoryTechniqueTile = ({ usage, testID }: Props) => {
    const { _ } = useLingui();

    return (
        <ChallengeStatTile count={usage.count} label={_(techniqueLabelsConstant[usage.technique])} testID={testID}>
            <HistoryTechniqueTierGlyph gap={GlyphGap} size={GlyphSize} technique={usage.technique} />
        </ChallengeStatTile>
    );
};
