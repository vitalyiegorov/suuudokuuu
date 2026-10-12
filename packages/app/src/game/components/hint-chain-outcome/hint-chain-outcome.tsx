import { ForcingOutcomeKindEnum } from '@suuudokuuu/techniques';
import { View } from 'react-native';

import { HintChainBlock } from '../hint-chain-block/hint-chain-block';
import { HintChainBlocksStyles as styles } from '../hint-chain-blocks/hint-chain-blocks.styles';
import { HintChainContradiction } from '../hint-chain-contradiction/hint-chain-contradiction';

import type { ForcingOutcomeType } from '@suuudokuuu/techniques';

interface Props {
    readonly outcome: ForcingOutcomeType;
}

export const HintChainOutcome = ({ outcome }: Props) => {
    const arrow = '→';

    if (outcome.kind === ForcingOutcomeKindEnum.COMMON_PLACEMENT) {
        return <HintChainBlock candidate={outcome}>{arrow}</HintChainBlock>;
    }

    if (outcome.kind === ForcingOutcomeKindEnum.COMMON_ELIMINATIONS) {
        return (
            <View style={styles.chain}>
                {outcome.eliminations.map(candidate => (
                    <HintChainBlock candidate={candidate} key={`${candidate.cell.y}-${candidate.cell.x}-${candidate.value}`} operator="≠">
                        {arrow}
                    </HintChainBlock>
                ))}
            </View>
        );
    }

    return <HintChainContradiction outcome={outcome} />;
};
