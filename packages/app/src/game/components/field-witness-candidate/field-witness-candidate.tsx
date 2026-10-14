import { use } from 'react';
import { Circle, Text } from 'react-native-svg';

import { ThemeContext } from '../../../theme/context/theme.context';
import { gameGetWitnessBadgeColors } from '../../utils/game-get-witness-badge-colors.util';
import { gameGetWitnessPoint } from '../../utils/game-get-witness-point.util';

import type { ChainCandidateInterface } from '@suuudokuuu/techniques';

const badgeRadiusRatio = 0.24;
const badgeStrokeRatio = 0.05;
const badgeStrokeMinimumWidth = 1.5;
const digitSizeRatio = 0.32;
const digitBaselineRatio = 0.35;

interface Props {
    readonly candidate: Pick<ChainCandidateInterface, 'cell' | 'value'>;
    readonly cellMargin: number;
    readonly cellSize: number;
    readonly fill: string;
    readonly textColor: string;
}

export const FieldWitnessCandidate = ({ candidate, cellMargin, cellSize, fill, textColor }: Props) => {
    const { theme } = use(ThemeContext);
    const center = gameGetWitnessPoint(candidate.cell, candidate.value, cellSize, cellMargin);
    const digitSize = cellSize * digitSizeRatio;
    const digitBaseline = center.y + digitSize * digitBaselineRatio;
    const badgeRadius = cellSize * badgeRadiusRatio;
    const badgeStroke = gameGetWitnessBadgeColors(theme).fill;
    const strokeWidth = Math.max(badgeStrokeMinimumWidth, cellSize * badgeStrokeRatio);

    return (
        <>
            <Circle cx={center.x} cy={center.y} fill={fill} r={badgeRadius} stroke={badgeStroke} strokeWidth={strokeWidth} />
            <Text fill={textColor} fontSize={digitSize} fontFamily="Inter_700Bold" textAnchor="middle" x={center.x} y={digitBaseline}>
                {candidate.value}
            </Text>
        </>
    );
};
