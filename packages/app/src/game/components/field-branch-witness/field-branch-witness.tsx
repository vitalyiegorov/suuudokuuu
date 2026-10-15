import { use } from 'react';
import { Circle, Rect } from 'react-native-svg';

import { ThemeContext } from '../../../theme/context/theme.context';
import { HintVisibleLinkCountConstant } from '../../constant/hint-visible-link-count.constant';
import { gameGetWitnessBadgeColors } from '../../utils/game-get-witness-badge-colors.util';
import { gameGetWitnessBadges } from '../../utils/game-get-witness-badges.util';
import { gameGetWitnessPoint } from '../../utils/game-get-witness-point.util';
import { FieldWitnessCandidate } from '../field-witness-candidate/field-witness-candidate';
import { FieldWitnessOverlaySelectors } from '../field-witness-overlay/field-witness-overlay.selectors';

import type { StepScriptBranchStepInterface } from '@suuudokuuu/field-core';

const outlineWidthRatio = 0.06;
const outlineMinimumWidth = 2;
const centerCandidateValue = 5;
const conflictRadiusScale = 1.05;

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
    const implications = step.branch.implications.slice(
        Math.max(revealedImplicationCount - HintVisibleLinkCountConstant, 0),
        revealedImplicationCount
    );
    const isOutcomeVisible = revealedImplicationCount >= step.branch.implications.length;
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
    const badges = gameGetWitnessBadges([...implications, assumption, ...outcomeCandidates], cellSize, cellMargin);
    const implicationBadges = badges.slice(0, implications.length);
    const assumptionBadge = badges[implications.length];
    const outcomeBadges = badges.slice(implications.length + 1);

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
            {implicationBadges.map((badge, index) => {
                const isNewest = index === implicationBadges.length - 1;
                const fill = isNewest ? badgeColors.fill : theme.colors.surface.raised;
                const textColor = isNewest ? badgeColors.text : theme.colors.text.primary;

                return (
                    <FieldWitnessCandidate
                        badge={badge}
                        cellSize={cellSize}
                        fill={fill}
                        key={`implication-${index}`}
                        textColor={textColor}
                    />
                );
            })}
            <FieldWitnessCandidate badge={assumptionBadge} cellSize={cellSize} fill={badgeColors.fill} textColor={badgeColors.text} />
            {outcomeBadges.map((badge, index) => {
                const conflictRadius = badge.radius * conflictRadiusScale;

                return (
                    <Circle
                        cx={badge.x}
                        cy={badge.y}
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
