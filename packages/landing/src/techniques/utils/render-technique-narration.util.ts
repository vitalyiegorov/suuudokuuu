import { StepScriptStepKindEnum } from '@suuudokuuu/field-core';
import { ChainLinkEnum, ForcingOutcomeKindEnum } from '@suuudokuuu/techniques';

import { isDefined } from '@rnw-community/shared';

import { TECHNIQUE_NAMES } from '../constants/technique-name.constant';

import { formatCellLabel } from './format-cell-label.util';

import type { StepScriptBranchStepInterface, StepScriptCandidateInterface, StepScriptStepType } from '@suuudokuuu/field-core';
import type { ChainCandidateInterface } from '@suuudokuuu/techniques';

const formatCandidate = ({ cell, value }: StepScriptCandidateInterface): string => `${formatCellLabel(cell)}=${value}`;

const formatChainCandidate = ({ cell, link, value }: ChainCandidateInterface): string => {
    const linkSymbol = link === ChainLinkEnum.WEAK ? ' − ' : ' = ';

    return `${isDefined(link) ? linkSymbol : ''}(${value})${formatCellLabel(cell)}`;
};

const renderBranchNarration = ({ branch, branchIndex, branchCount }: StepScriptBranchStepInterface): string => {
    const { assumption, implications, outcome } = branch;
    const path = [assumption, ...implications].map(formatCandidate).join(' → ');
    const refutation = `So ${formatCellLabel(assumption.cell)} is not ${assumption.value}.`;
    const branchLabel = `Branch ${branchIndex + 1} of ${branchCount}: if ${path}.`;

    switch (outcome.kind) {
        case ForcingOutcomeKindEnum.EMPTY_CELL:
            return `If ${path} → ${formatCellLabel(outcome.cell)} runs out of candidates. ${refutation}`;
        case ForcingOutcomeKindEnum.NO_POSITION:
            return `If ${path} → ${outcome.value} has no place left in the outlined cells. ${refutation}`;
        case ForcingOutcomeKindEnum.ASSIGNMENT_CONFLICT:
            return `If ${path} → ${formatCellLabel(outcome.cell)} would have to be ${outcome.value}, which is no longer possible. ${refutation}`;
        case ForcingOutcomeKindEnum.COMMON_PLACEMENT:
            return `${branchLabel} This branch leads to ${formatCandidate(outcome)}.`;
        default:
            return `${branchLabel} This branch rules out ${outcome.eliminations.map(({ cell, value }) => `${formatCellLabel(cell)}≠${value}`).join(', ')}.`;
    }
};

export const renderTechniqueNarration = (step: StepScriptStepType): string => {
    const techniqueName = TECHNIQUE_NAMES[step.narration.technique];
    const cellLabels = step.narration.cells.map(formatCellLabel).join(', ');
    const valueLabels = step.narration.values.join(', ');

    if (step.kind === StepScriptStepKindEnum.SHOW_CHAIN) {
        return `Follow the chain ${step.chain.map(formatChainCandidate).join('')}. "=" is a strong link (at least one end is true) and "−" is a weak link (both ends cannot be true), so one end of the chain is always true.`;
    }

    if (step.kind === StepScriptStepKindEnum.SHOW_BRANCH) {
        return renderBranchNarration(step);
    }

    if (step.kind === StepScriptStepKindEnum.RevealCandidates) {
        return `${techniqueName} pattern: candidates ${valueLabels} stay live in ${cellLabels}.`;
    }

    if (step.kind === StepScriptStepKindEnum.StrikeCandidates) {
        return `The ${techniqueName} removes ${valueLabels} from ${cellLabels}.`;
    }

    return `The ${techniqueName} places ${valueLabels} in ${cellLabels}.`;
};
