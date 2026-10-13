import { Trans } from '@lingui/react/macro';
import { StepScriptStepKindEnum } from '@suuudokuuu/field-core';
import { ChainLinkEnum } from '@suuudokuuu/techniques';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { HintChainBlock } from '../hint-chain-block/hint-chain-block';
import { HintChainOutcome } from '../hint-chain-outcome/hint-chain-outcome';
import { HintStepNarrationSelectors } from '../hint-step-narration/hint-step-narration.selectors';
import { HintStepNarrationStyles as narrationStyles } from '../hint-step-narration/hint-step-narration.styles';

import { HintChainBlocksStyles as styles } from './hint-chain-blocks.styles';

import type { StepScriptBranchStepInterface, StepScriptChainStepInterface } from '@suuudokuuu/field-core';
import type { ChainCandidateInterface } from '@suuudokuuu/techniques';

const visibleLinkCount = 4;
const branchArrow = '→';
const truncatedChainMarker = '…';
const chainLinkSymbols: Record<ChainLinkEnum, string> = { [ChainLinkEnum.STRONG]: '=', [ChainLinkEnum.WEAK]: '−' };

interface Props {
    readonly step: StepScriptBranchStepInterface | StepScriptChainStepInterface;
    readonly revealedImplicationCount: number;
}

export const HintChainBlocks = ({ step, revealedImplicationCount }: Props) => {
    const candidates: readonly ChainCandidateInterface[] =
        step.kind === StepScriptStepKindEnum.SHOW_CHAIN ? step.chain : [step.branch.assumption, ...step.branch.implications];
    const linkCount = candidates.length - 1;
    const revealedLinkCount = Math.min(revealedImplicationCount, linkCount);
    const firstVisibleIndex = Math.max(revealedLinkCount - visibleLinkCount, 0);
    const visibleCandidates = candidates.slice(firstVisibleIndex, revealedLinkCount + 1);
    const isLinkProgressVisible = linkCount > 0;
    const isOutcomeVisible = step.kind === StepScriptStepKindEnum.SHOW_BRANCH && revealedLinkCount === linkCount;

    return (
        <View style={styles.container} testID={HintStepNarrationSelectors.CHAIN_BLOCKS}>
            {isLinkProgressVisible ? (
                <BlackText style={narrationStyles.linkProgress} testID={HintStepNarrationSelectors.LINK_PROGRESS}>
                    <Trans>
                        Link {revealedLinkCount} of {linkCount}
                    </Trans>
                </BlackText>
            ) : null}
            <View style={styles.chain}>
                {visibleCandidates.map((candidate, index) => {
                    const candidateIndex = firstVisibleIndex + index;
                    const linkSymbol = isDefined(candidate.link) ? chainLinkSymbols[candidate.link] : branchArrow;
                    const firstLinkSymbol = candidateIndex === 0 ? null : truncatedChainMarker;
                    const blockStyle = candidateIndex === revealedLinkCount ? null : styles.faded;

                    return (
                        <HintChainBlock
                            candidate={candidate}
                            key={`${candidate.cell.y}-${candidate.cell.x}-${candidate.value}-${candidateIndex}`}
                            style={blockStyle}
                        >
                            {index === 0 ? firstLinkSymbol : linkSymbol}
                        </HintChainBlock>
                    );
                })}
                {isOutcomeVisible ? <HintChainOutcome outcome={step.branch.outcome} /> : null}
            </View>
        </View>
    );
};
