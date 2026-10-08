import { StepScriptStepKindEnum } from '@suuudokuuu/field-core';
import { ChainLinkEnum, ForcingImplicationKindEnum, ForcingOutcomeKindEnum } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import { TECHNIQUE_NAMES } from '../constants/technique-name.constant';

import { formatCellLabel } from './format-cell-label.util';

import type { StepScriptStepType } from '@suuudokuuu/field-core';
import type { ForcingImplicationType, ForcingOutcomeType } from '@suuudokuuu/techniques';

const renderChainNarration = (step: Extract<StepScriptStepType, { kind: StepScriptStepKindEnum.SHOW_CHAIN }>): string => {
    const candidate = step.chain[step.visibleLength - 1];
    const cell = formatCellLabel(candidate.cell);

    if (step.visibleLength === 1) {
        return `Start with candidate ${candidate.value} in ${cell}.`;
    }

    const previous = step.chain[step.visibleLength - 2];
    const previousCell = formatCellLabel(previous.cell);

    if (candidate.link === ChainLinkEnum.STRONG) {
        return `Strong link: at least one of ${previous.value} in ${previousCell} and ${candidate.value} in ${cell} must be true.`;
    }

    return `Weak link: ${previous.value} in ${previousCell} and ${candidate.value} in ${cell} cannot both be true.`;
};

const renderBranchImplication = (implication: ForcingImplicationType, visibleImplications: readonly ForcingImplicationType[]): string => {
    const cell = formatCellLabel(implication.cell);

    if (implication.kind === ForcingImplicationKindEnum.PEER_REMOVAL) {
        return `${formatCellLabel(implication.source.cell)} has ${implication.source.value}, removing ${implication.value} from peer ${cell}.`;
    }

    if (implication.kind === ForcingImplicationKindEnum.NAKED_SINGLE) {
        return `Only ${implication.value} remains possible in ${cell}, so this branch places it there.`;
    }

    if (implication.kind === ForcingImplicationKindEnum.HIDDEN_SINGLE) {
        return `Among ${implication.supportCells.map(formatCellLabel).join(', ')}, only ${cell} can take ${implication.value}, so this branch places it there.`;
    }

    if ('reasonIndex' in implication && isDefined(implication.reasonIndex) && implication.reasonIndex < visibleImplications.length) {
        return `The single at ${formatCellLabel(visibleImplications[implication.reasonIndex].cell)} leads this branch to assign ${implication.value} to ${cell}.`;
    }

    return `This branch assigns ${implication.value} to ${cell}.`;
};

const renderBranchOutcome = (outcome: ForcingOutcomeType): string => {
    if (outcome.kind === ForcingOutcomeKindEnum.EMPTY_CELL) {
        return `a contradiction follows: ${formatCellLabel(outcome.cell)} has no candidate left.`;
    }

    if (outcome.kind === ForcingOutcomeKindEnum.NO_POSITION) {
        return `a contradiction follows: ${outcome.value} has no possible cell among ${outcome.unitCells.map(formatCellLabel).join(', ')}.`;
    }

    if (outcome.kind === ForcingOutcomeKindEnum.ASSIGNMENT_CONFLICT) {
        return `a contradiction follows: ${outcome.value} can no longer be assigned to ${formatCellLabel(outcome.cell)}.`;
    }

    if (outcome.kind === ForcingOutcomeKindEnum.COMMON_PLACEMENT) {
        return `this branch reaches ${outcome.value} in ${formatCellLabel(outcome.cell)}.`;
    }

    return `this branch removes ${outcome.eliminations.map(elimination => `${elimination.value} in ${formatCellLabel(elimination.cell)}`).join(', ')}.`;
};

const renderBranchNarration = (step: Extract<StepScriptStepType, { kind: StepScriptStepKindEnum.SHOW_BRANCH }>): string => {
    const assumption = `${step.branch.assumption.value} in ${formatCellLabel(step.branch.assumption.cell)}`;

    if (step.showOutcome) {
        if (step.branchIndex === step.branchCount - 1 && step.branch.outcome.kind === ForcingOutcomeKindEnum.COMMON_PLACEMENT) {
            return `All branches reach ${step.branch.outcome.value} in ${formatCellLabel(step.branch.outcome.cell)}, so it can be placed there.`;
        }

        if (step.branchIndex === step.branchCount - 1 && step.branch.outcome.kind === ForcingOutcomeKindEnum.COMMON_ELIMINATIONS) {
            return `All branches remove ${step.branch.outcome.eliminations.map(elimination => `${elimination.value} in ${formatCellLabel(elimination.cell)}`).join(', ')}, so these candidates can be eliminated.`;
        }

        return `Assuming ${assumption}, ${renderBranchOutcome(step.branch.outcome)}`;
    }

    if (step.visibleImplicationCount === 0) {
        return `Branch ${step.branchIndex + 1} of ${step.branchCount}: suppose ${assumption}.`;
    }

    const visibleImplications = step.branch.implications.slice(0, step.visibleImplicationCount);

    return `Assuming ${assumption}, ${renderBranchImplication(visibleImplications[visibleImplications.length - 1], visibleImplications)}`;
};

export const renderTechniqueNarration = (step: StepScriptStepType): string => {
    if (step.kind === StepScriptStepKindEnum.SHOW_CHAIN) {
        return renderChainNarration(step);
    }

    if (step.kind === StepScriptStepKindEnum.SHOW_BRANCH) {
        return renderBranchNarration(step);
    }

    const techniqueName = TECHNIQUE_NAMES[step.narration.technique];
    const cellLabels = step.narration.cells.map(formatCellLabel).join(', ');
    const valueLabels = step.narration.values.join(', ');

    if (step.kind === StepScriptStepKindEnum.RevealCandidates) {
        return `${techniqueName} pattern: candidates ${valueLabels} stay live in ${cellLabels}.`;
    }

    if (step.kind === StepScriptStepKindEnum.StrikeCandidates) {
        return `The ${techniqueName} removes ${valueLabels} from ${cellLabels}.`;
    }

    return `The ${techniqueName} places ${valueLabels} in ${cellLabels}.`;
};
