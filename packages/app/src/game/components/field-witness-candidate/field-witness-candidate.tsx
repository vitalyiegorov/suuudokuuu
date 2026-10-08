import { use } from 'react';
import { Circle, G, Text } from 'react-native-svg';

import { ThemeContext } from '../../../theme/context/theme.context';
import { gameGetWitnessPoint } from '../../utils/game-get-witness-point.util';

import type { ChainCandidateInterface } from '@suuudokuuu/techniques';

const markerRadiusRatio = 0.13;
const markerWidthRatio = 0.045;
const markerMinimumWidth = 1.5;
const digitSizeRatio = 0.21;
const digitBaselineRatio = 0.075;

interface Props {
    readonly candidate: Pick<ChainCandidateInterface, 'cell' | 'value'>;
    readonly cellMargin: number;
    readonly cellSize: number;
    readonly strokeDasharray?: string;
}

export const FieldWitnessCandidate = ({ candidate, cellMargin, cellSize, strokeDasharray }: Props) => {
    const { theme } = use(ThemeContext);
    const center = gameGetWitnessPoint(candidate.cell, candidate.value, cellSize, cellMargin);
    const digitBaseline = center.y + cellSize * digitBaselineRatio;
    const markerRadius = cellSize * markerRadiusRatio;
    const markerWidth = Math.max(markerMinimumWidth, cellSize * markerWidthRatio);
    const digitSize = cellSize * digitSizeRatio;

    return (
        <G>
            <Circle
                cx={center.x}
                cy={center.y}
                fill={theme.colors.surface.raised}
                r={markerRadius}
                stroke={theme.colors.accent}
                strokeDasharray={strokeDasharray}
                strokeWidth={markerWidth}
            />
            <Text fill={theme.colors.text.primary} fontSize={digitSize} textAnchor="middle" x={center.x} y={digitBaseline}>
                {candidate.value}
            </Text>
        </G>
    );
};
