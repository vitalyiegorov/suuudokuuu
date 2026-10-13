import { StepScriptStepKindEnum } from '@suuudokuuu/field-core';
import { ChainLinkEnum } from '@suuudokuuu/techniques';
import { View } from 'react-native';

import { HintChainBlock } from '../hint-chain-block/hint-chain-block';
import { HintChainOutcome } from '../hint-chain-outcome/hint-chain-outcome';

import { HintChainBlocksStyles as styles } from './hint-chain-blocks.styles';

import type { StepScriptBranchStepInterface, StepScriptChainStepInterface } from '@suuudokuuu/field-core';

interface Props {
    readonly step: StepScriptBranchStepInterface | StepScriptChainStepInterface;
}

export const HintChainBlocks = ({ step }: Props) => {
    if (step.kind === StepScriptStepKindEnum.SHOW_CHAIN) {
        return (
            <View style={styles.chain}>
                {step.chain.map((candidate, index) => {
                    const linkSymbol = candidate.link === ChainLinkEnum.WEAK ? '−' : '=';
                    const link = index === 0 ? null : linkSymbol;

                    return (
                        <HintChainBlock candidate={candidate} key={`${candidate.cell.y}-${candidate.cell.x}-${candidate.value}-${index}`}>
                            {link}
                        </HintChainBlock>
                    );
                })}
            </View>
        );
    }

    const { assumption, implications, outcome } = step.branch;

    return (
        <View style={styles.chain}>
            {[assumption, ...implications].map((candidate, index) => {
                const arrow = index === 0 ? null : '→';

                return (
                    <HintChainBlock candidate={candidate} key={`${candidate.cell.y}-${candidate.cell.x}-${candidate.value}-${index}`}>
                        {arrow}
                    </HintChainBlock>
                );
            })}
            <HintChainOutcome outcome={outcome} />
        </View>
    );
};
