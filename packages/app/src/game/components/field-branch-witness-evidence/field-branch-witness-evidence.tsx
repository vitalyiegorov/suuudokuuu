import {
    ForcingImplicationKindEnum,
    ForcingOutcomeKindEnum,
    type ForcingBranchInterface,
    type ForcingImplicationType
} from '@suuudokuuu/techniques';
import { use } from 'react';
import { Circle, G, Rect } from 'react-native-svg';

import { ThemeContext } from '../../../theme/context/theme.context';
import { gameGetWitnessPoint } from '../../utils/game-get-witness-point.util';
import { FieldWitnessOverlaySelectors } from '../field-witness-overlay/field-witness-overlay.selectors';

import type { CellInterface } from '@suuudokuuu/generator';

const outlineWidthRatio = 0.045;
const outlineMinimumWidth = 1.5;
const centerCandidateValue = 5;

interface Props {
    readonly branch: ForcingBranchInterface;
    readonly cellMargin: number;
    readonly cellSize: number;
    readonly showOutcome: boolean;
    readonly visibleImplications: readonly ForcingImplicationType[];
}

export const FieldBranchWitnessEvidence = ({ branch, cellMargin, cellSize, showOutcome, visibleImplications }: Props) => {
    const { theme } = use(ThemeContext);
    const latestImplication = visibleImplications.at(-1);
    const { outcome } = branch;
    const outlineWidth = Math.max(outlineMinimumWidth, cellSize * outlineWidthRatio);
    const outlineSize = cellSize - outlineWidth;
    const conflictRadius = cellSize / 6;
    const isSupportVisible =
        latestImplication?.kind === ForcingImplicationKindEnum.HIDDEN_SINGLE ||
        latestImplication?.kind === ForcingImplicationKindEnum.NAKED_SINGLE;
    const outcomeCells: CellInterface[] = [];
    const outcomeCandidates: Array<ForcingBranchInterface['assumption']> = [];

    if (showOutcome && outcome.kind === ForcingOutcomeKindEnum.NO_POSITION) {
        outcomeCells.push(...outcome.unitCells);
    } else if (showOutcome && outcome.kind === ForcingOutcomeKindEnum.EMPTY_CELL) {
        outcomeCells.push(outcome.cell);
    }

    if (
        showOutcome &&
        (outcome.kind === ForcingOutcomeKindEnum.ASSIGNMENT_CONFLICT || outcome.kind === ForcingOutcomeKindEnum.COMMON_PLACEMENT)
    ) {
        outcomeCandidates.push(outcome);
    } else if (showOutcome && outcome.kind === ForcingOutcomeKindEnum.COMMON_ELIMINATIONS) {
        outcomeCandidates.push(...outcome.eliminations);
    }

    const supportCells = isSupportVisible ? latestImplication.supportCells : [];
    const outlines = [
        ...supportCells.map(cell => ({ cell, stroke: theme.colors.accent, testID: FieldWitnessOverlaySelectors.Support })),
        ...outcomeCells.map(cell => ({ cell, stroke: theme.colors.danger, testID: FieldWitnessOverlaySelectors.Outcome }))
    ];
    const outcomeCandidateColor = outcome.kind === ForcingOutcomeKindEnum.COMMON_PLACEMENT ? theme.colors.accent : theme.colors.danger;

    return (
        <G>
            {outlines.map((outline, index) => {
                const center = gameGetWitnessPoint(outline.cell, centerCandidateValue, cellSize, cellMargin);
                const originX = center.x - outlineSize / 2;
                const originY = center.y - outlineSize / 2;

                return (
                    <Rect
                        fill="none"
                        height={outlineSize}
                        key={`outline-${index}`}
                        stroke={outline.stroke}
                        strokeWidth={outlineWidth}
                        testID={outline.testID}
                        width={outlineSize}
                        x={originX}
                        y={originY}
                    />
                );
            })}
            {outcomeCandidates.map((candidate, index) => {
                const center = gameGetWitnessPoint(candidate.cell, candidate.value, cellSize, cellMargin);

                return (
                    <Circle
                        cx={center.x}
                        cy={center.y}
                        fill="none"
                        key={`outcome-candidate-${index}`}
                        r={conflictRadius}
                        stroke={outcomeCandidateColor}
                        strokeWidth={outlineWidth}
                        testID={FieldWitnessOverlaySelectors.Outcome}
                    />
                );
            })}
        </G>
    );
};
