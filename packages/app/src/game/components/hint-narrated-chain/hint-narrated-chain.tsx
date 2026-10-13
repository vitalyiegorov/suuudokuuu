import { View } from 'react-native';

import { HintChainBlocks } from '../hint-chain-blocks/hint-chain-blocks';
import { HintChainBlocksStyles as styles } from '../hint-chain-blocks/hint-chain-blocks.styles';

import type { StepScriptBranchStepInterface, StepScriptChainStepInterface } from '@suuudokuuu/field-core';

interface Props {
    readonly step: StepScriptBranchStepInterface | StepScriptChainStepInterface;
    readonly stepIndex: number;
    readonly currentStepIndex: number;
}

export const HintNarratedChain = ({ step, stepIndex, currentStepIndex }: Props) => {
    const chainStyles = stepIndex === currentStepIndex ? null : styles.faded;

    return (
        <View style={chainStyles}>
            <HintChainBlocks step={step} />
        </View>
    );
};
