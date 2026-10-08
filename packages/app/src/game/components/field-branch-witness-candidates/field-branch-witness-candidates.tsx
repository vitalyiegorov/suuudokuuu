import { ForcingImplicationKindEnum, type ForcingBranchInterface, type ForcingImplicationType } from '@suuudokuuu/techniques';
import { use } from 'react';
import { Circle, G, Text } from 'react-native-svg';

import { ThemeContext } from '../../../theme/context/theme.context';
import { gameGetWitnessPoint } from '../../utils/game-get-witness-point.util';

const markerRadiusRatio = 0.13;
const markerWidthRatio = 0.045;
const markerMinimumWidth = 1.5;
const digitSizeRatio = 0.21;
const digitBaselineRatio = 0.075;

interface Props {
    readonly branch: ForcingBranchInterface;
    readonly cellMargin: number;
    readonly cellSize: number;
    readonly visibleImplications: readonly ForcingImplicationType[];
}

export const FieldBranchWitnessCandidates = (props: Props) => {
    const { branch, cellMargin, cellSize, visibleImplications } = props;
    const { theme } = use(ThemeContext);
    const markerRadius = cellSize * markerRadiusRatio;
    const markerWidth = Math.max(markerMinimumWidth, cellSize * markerWidthRatio);
    const digitSize = cellSize * digitSizeRatio;
    const assumptionDash = `${markerWidth * 2},${markerWidth}`;
    const assumption = gameGetWitnessPoint(branch.assumption.cell, branch.assumption.value, cellSize, cellMargin);
    const assumptionBaseline = assumption.y + cellSize * digitBaselineRatio;

    return (
        <G>
            {visibleImplications.map((implication, index) => {
                const center = gameGetWitnessPoint(implication.cell, implication.value, cellSize, cellMargin);
                const isRemoval = implication.kind === ForcingImplicationKindEnum.PEER_REMOVAL;
                const stroke = isRemoval ? theme.colors.danger : theme.colors.accent;
                const textDecoration = isRemoval ? 'line-through' : 'none';
                const digitBaseline = center.y + cellSize * digitBaselineRatio;

                return (
                    <G key={`implication-${index}`}>
                        <Circle
                            cx={center.x}
                            cy={center.y}
                            fill={theme.colors.surface.raised}
                            r={markerRadius}
                            stroke={stroke}
                            strokeWidth={markerWidth}
                        />
                        <Text
                            fill={theme.colors.text.primary}
                            fontSize={digitSize}
                            textAnchor="middle"
                            textDecoration={textDecoration}
                            x={center.x}
                            y={digitBaseline}
                        >
                            {implication.value}
                        </Text>
                    </G>
                );
            })}
            <Circle
                cx={assumption.x}
                cy={assumption.y}
                fill={theme.colors.surface.raised}
                r={markerRadius}
                stroke={theme.colors.accent}
                strokeDasharray={assumptionDash}
                strokeWidth={markerWidth}
            />
            <Text fill={theme.colors.text.primary} fontSize={digitSize} textAnchor="middle" x={assumption.x} y={assumptionBaseline}>
                {branch.assumption.value}
            </Text>
        </G>
    );
};
