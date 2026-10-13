import { use } from 'react';
import { Circle, Rect } from 'react-native-svg';

import { ThemeContext } from '../../../theme/context/theme.context';
import { gameGetWitnessPoint } from '../../utils/game-get-witness-point.util';
import { FieldWitnessCandidate } from '../field-witness-candidate/field-witness-candidate';
import { FieldWitnessOverlaySelectors } from '../field-witness-overlay/field-witness-overlay.selectors';

import type { StepScriptBranchStepInterface } from '@suuudokuuu/field-core';

const outlineWidthRatio = 0.045;
const outlineMinimumWidth = 1.5;
const centerCandidateValue = 5;
const earlierImplicationOpacity = 0.5;

interface Props {
    readonly step: StepScriptBranchStepInterface;
    readonly cellMargin: number;
    readonly cellSize: number;
    readonly revealedImplicationCount: number;
}

export const FieldBranchWitness = ({ cellMargin, cellSize, revealedImplicationCount, step }: Props) => {
    const { theme } = use(ThemeContext);
    const { assumption } = step.branch;
    const implications = step.branch.implications.slice(0, revealedImplicationCount);
    const isOutcomeVisible = implications.length === step.branch.implications.length;
    const outcomeCells = isOutcomeVisible ? step.outcomeCells : [];
    const outcomeCandidates = isOutcomeVisible ? step.outcomeCandidates : [];
    const outlineWidth = Math.max(outlineMinimumWidth, cellSize * outlineWidthRatio);
    const outlineSize = cellSize - outlineWidth;
    const outlineOffset = outlineSize / 2;
    const conflictRadius = cellSize / 6;
    const assumptionDash = `${outlineWidth * 2},${outlineWidth}`;

    return (
        <>
            {outcomeCells.map((cell, index) => {
                const center = gameGetWitnessPoint(cell, centerCandidateValue, cellSize, cellMargin);
                const originX = center.x - outlineOffset;
                const originY = center.y - outlineOffset;

                return (
                    <Rect
                        fill="none"
                        height={outlineSize}
                        key={`outcome-cell-${index}`}
                        stroke={theme.colors.danger}
                        strokeWidth={outlineWidth}
                        testID={FieldWitnessOverlaySelectors.Outcome}
                        width={outlineSize}
                        x={originX}
                        y={originY}
                    />
                );
            })}
            {implications.map((implication, index) => {
                const implicationOpacity = index === implications.length - 1 ? 1 : earlierImplicationOpacity;

                return (
                    <FieldWitnessCandidate
                        candidate={implication}
                        cellMargin={cellMargin}
                        cellSize={cellSize}
                        key={`implication-${index}`}
                        opacity={implicationOpacity}
                    />
                );
            })}
            <FieldWitnessCandidate candidate={assumption} cellMargin={cellMargin} cellSize={cellSize} strokeDasharray={assumptionDash} />
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
