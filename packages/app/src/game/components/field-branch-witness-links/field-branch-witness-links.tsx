import { ForcingImplicationKindEnum, type ForcingBranchInterface, type ForcingImplicationType } from '@suuudokuuu/techniques';
import { use } from 'react';
import { Line } from 'react-native-svg';

import { isDefined } from '@rnw-community/shared';

import { ThemeContext } from '../../../theme/context/theme.context';
import { gameGetWitnessPoint } from '../../utils/game-get-witness-point.util';

const lineWidthRatio = 0.045;
const lineMinimumWidth = 1.5;

interface Props {
    readonly branch: ForcingBranchInterface;
    readonly cellMargin: number;
    readonly cellSize: number;
    readonly visibleImplications: readonly ForcingImplicationType[];
}

export const FieldBranchWitnessLinks = ({ branch, cellMargin, cellSize, visibleImplications }: Props) => {
    const { theme } = use(ThemeContext);
    const lineWidth = Math.max(lineMinimumWidth, cellSize * lineWidthRatio);

    return visibleImplications.map((implication, index) => {
        let reason;

        if (implication.kind === ForcingImplicationKindEnum.PEER_REMOVAL) {
            reason = implication.source;
        } else if (
            implication.kind === ForcingImplicationKindEnum.ASSIGNMENT &&
            isDefined(implication.reasonIndex) &&
            implication.reasonIndex < index
        ) {
            reason = branch.implications[implication.reasonIndex];
        }

        if (!reason) {
            return null;
        }

        const source = gameGetWitnessPoint(reason.cell, reason.value, cellSize, cellMargin);
        const current = gameGetWitnessPoint(implication.cell, implication.value, cellSize, cellMargin);

        return (
            <Line
                key={`reason-${index}`}
                stroke={theme.colors.accent}
                strokeWidth={lineWidth}
                x1={source.x}
                x2={current.x}
                y1={source.y}
                y2={current.y}
            />
        );
    });
};
