import { useLingui } from '@lingui/react/macro';
import { StepScriptStepKindEnum } from '@suuudokuuu/field-core';
import { ForcingOutcomeKindEnum } from '@suuudokuuu/techniques';
import { use } from 'react';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';
import { HintStepNarrationSelectors } from '../hint-step-narration/hint-step-narration.selectors';
import { HintStepNarrationStyles as styles } from '../hint-step-narration/hint-step-narration.styles';

import type { StepScriptBranchStepInterface, StepScriptChainStepInterface } from '@suuudokuuu/field-core';

interface Props {
    readonly step: StepScriptBranchStepInterface | StepScriptChainStepInterface;
    readonly narrationText: string;
    readonly revealedImplicationCount: number;
}

export const HintChainSentence = ({ step, narrationText, revealedImplicationCount }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const narrationStyles = [styles.narration, { color: theme.colors.surface.raisedText }];
    const assumption = step.kind === StepScriptStepKindEnum.SHOW_BRANCH ? step.branch.assumption : step.chain[0];
    const cell = `R${assumption.cell.y + 1}C${assumption.cell.x + 1}`;
    const { value } = assumption;
    const isContradiction =
        step.kind === StepScriptStepKindEnum.SHOW_BRANCH &&
        revealedImplicationCount >= step.branch.implications.length &&
        step.branch.outcome.kind !== ForcingOutcomeKindEnum.COMMON_PLACEMENT &&
        step.branch.outcome.kind !== ForcingOutcomeKindEnum.COMMON_ELIMINATIONS;
    const branchSentence = isContradiction
        ? t`Contradiction, so ${cell} is not ${value}.`
        : t`If ${cell} were ${value}, these cells would be forced in turn.`;
    const sentence = step.kind === StepScriptStepKindEnum.SHOW_CHAIN ? t`At least one end of this chain must be true.` : branchSentence;

    return (
        <BlackText
            accessibilityLabel={narrationText}
            accessibilityLiveRegion="polite"
            style={narrationStyles}
            testID={HintStepNarrationSelectors.Narration}
        >
            {sentence}
        </BlackText>
    );
};
