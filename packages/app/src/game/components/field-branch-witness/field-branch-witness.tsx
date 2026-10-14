import { use } from 'react';
import { Circle, Rect } from 'react-native-svg';

import { ThemeContext } from '../../../theme/context/theme.context';
import { gameGetWitnessBadgeColors } from '../../utils/game-get-witness-badge-colors.util';
import { gameGetWitnessPoint } from '../../utils/game-get-witness-point.util';
import { FieldWitnessCandidate } from '../field-witness-candidate/field-witness-candidate';
import { FieldWitnessOverlaySelectors } from '../field-witness-overlay/field-witness-overlay.selectors';

import type { StepScriptBranchStepInterface } from '@suuudokuuu/field-core';

const outlineWidthRatio = 0.06;
const outlineMinimumWidth = 2;
const centerCandidateValue = 5;
const conflictRadiusRatio = 0.25;

interface Props {
    readonly step: StepScriptBranchStepInterface;
    readonly cellMargin: number;
    readonly cellSize: number;
    readonly revealedImplicationCount: number;
}

export const FieldBranchWitness = ({ cellMargin, cellSize, revealedImplicationCount, step }: Props) => {
    const { theme } = use(ThemeContext);
    const badgeColors = gameGetWitnessBadgeColors(theme);
    const { assumption } = step.branch;
    const implications = step.branch.implications.slice(0, revealedImplicationCount);
    const isOutcomeVisible = implications.length === step.branch.implications.length;
    const outlineWidth = Math.max(outlineMinimumWidth, cellSize * outlineWidthRatio);
    const outlineSize = cellSize - outlineWidth;
    const outlineOffset = outlineSize / 2;
    const outlinedCells = [
        { cell: assumption.cell, stroke: badgeColors.fill, testID: FieldWitnessOverlaySelectors.Assumption },
        ...(isOutcomeVisible ? step.outcomeCells : []).map(cell => ({
            cell,
            stroke: theme.colors.danger,
            testID: FieldWitnessOverlaySelectors.Outcome
        }))
    ];
    const outcomeCandidates = isOutcomeVisible ? step.outcomeCandidates : [];
    const conflictRadius = cellSize * conflictRadiusRatio;

    return (
        <>
            {outlinedCells.map(({ cell, stroke, testID }, index) => {
                const center = gameGetWitnessPoint(cell, centerCandidateValue, cellSize, cellMargin);
                const originX = center.x - outlineOffset;
                const originY = center.y - outlineOffset;

                return (
                    <Rect
                        fill="none"
                        height={outlineSize}
                        key={`outlined-cell-${index}`}
                        stroke={stroke}
                        strokeWidth={outlineWidth}
                        testID={testID}
                        width={outlineSize}
                        x={originX}
                        y={originY}
                    />
                );
            })}
            {implications.map((implication, index) => {
                const isNewest = index === implications.length - 1;
                const fill = isNewest ? badgeColors.fill : theme.colors.surface.raised;
                const textColor = isNewest ? badgeColors.text : theme.colors.text.primary;

                return (
                    <FieldWitnessCandidate
                        candidate={implication}
                        cellMargin={cellMargin}
                        cellSize={cellSize}
                        fill={fill}
                        key={`implication-${index}`}
                        textColor={textColor}
                    />
                );
            })}
            <FieldWitnessCandidate
                candidate={assumption}
                cellMargin={cellMargin}
                cellSize={cellSize}
                fill={badgeColors.fill}
                textColor={badgeColors.text}
            />
            {outcomeCandidates.map((candidate, index) => {
                const center = gameGetWitnessPoint(candidate.cell, candidate.value, cellSize, cellMargin);

                return (
                    <Circle
                        cx={center.x}
                        cy={center.y}
                        fill="none"
                        key={`outcome-candidate-${index}`}
                        r={conflictRadius}
                        stroke={theme.colors.danger}
                        strokeWidth={outlineWidth}
                        testID={FieldWitnessOverlaySelectors.Outcome}
                    />
                );
            })}
        </>
    );
};
