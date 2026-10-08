import { ChainLinkEnum, type ChainCandidateInterface } from '@suuudokuuu/techniques';
import { use } from 'react';
import Svg, { Circle, G, Line, Text } from 'react-native-svg';

import { ThemeContext } from '../../../theme/context/theme.context';
import { gameGetWitnessPoint } from '../../utils/game-get-witness-point.util';
import { FieldWitnessLinkMask } from '../field-witness-link-mask/field-witness-link-mask';
import { FieldWitnessOverlaySelectors } from '../field-witness-overlay/field-witness-overlay.selectors';

import type { CellInterface } from '@suuudokuuu/generator';

const markerRadiusRatio = 0.13;
const markerWidthRatio = 0.045;
const markerMinimumWidth = 1.5;
const digitSizeRatio = 0.21;
const digitBaselineRatio = 0.075;

interface Props {
    readonly cellMargin: number;
    readonly cellSize: number;
    readonly chain: readonly ChainCandidateInterface[];
    readonly filledCells: readonly CellInterface[];
    readonly visibleLength: number;
}

export const FieldChainWitness = ({ cellMargin, cellSize, chain, filledCells, visibleLength }: Props) => {
    const { theme } = use(ThemeContext);
    const visibleCandidates = chain.slice(0, visibleLength);
    const boardSize = cellSize * 9 + cellMargin * 2;
    const markerWidth = Math.max(markerMinimumWidth, cellSize * markerWidthRatio);
    const markerRadius = cellSize * markerRadiusRatio;
    const digitSize = cellSize * digitSizeRatio;
    const weakDash = `${markerWidth * 2},${markerWidth * markerMinimumWidth}`;

    return (
        <Svg accessible={false} height={boardSize} pointerEvents="none" testID={FieldWitnessOverlaySelectors.Chain} width={boardSize}>
            <FieldWitnessLinkMask boardSize={boardSize} cellMargin={cellMargin} cellSize={cellSize} filledCells={filledCells}>
                {visibleCandidates.slice(1).map((candidate, index) => {
                    const previous = gameGetWitnessPoint(
                        visibleCandidates[index].cell,
                        visibleCandidates[index].value,
                        cellSize,
                        cellMargin
                    );
                    const current = gameGetWitnessPoint(candidate.cell, candidate.value, cellSize, cellMargin);
                    const isStrong = candidate.link === ChainLinkEnum.STRONG;
                    const stroke = isStrong ? theme.colors.accent : theme.colors.text.hint;
                    const strokeDasharray = isStrong ? '' : weakDash;

                    return (
                        <Line
                            key={`link-${index}`}
                            stroke={stroke}
                            strokeDasharray={strokeDasharray}
                            strokeWidth={markerWidth}
                            x1={previous.x}
                            x2={current.x}
                            y1={previous.y}
                            y2={current.y}
                        />
                    );
                })}
            </FieldWitnessLinkMask>
            {visibleCandidates.map((candidate, index) => {
                const center = gameGetWitnessPoint(candidate.cell, candidate.value, cellSize, cellMargin);
                const digitBaseline = center.y + cellSize * digitBaselineRatio;

                return (
                    <G key={`candidate-${index}`}>
                        <Circle
                            cx={center.x}
                            cy={center.y}
                            fill={theme.colors.surface.raised}
                            r={markerRadius}
                            stroke={theme.colors.accent}
                            strokeWidth={markerWidth}
                        />
                        <Text fill={theme.colors.text.primary} fontSize={digitSize} textAnchor="middle" x={center.x} y={digitBaseline}>
                            {candidate.value}
                        </Text>
                    </G>
                );
            })}
        </Svg>
    );
};
