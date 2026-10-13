import { useLingui } from '@lingui/react/macro';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { HintChainBlocksStyles as styles } from '../hint-chain-blocks/hint-chain-blocks.styles';

import type { ChainCandidateInterface } from '@suuudokuuu/techniques';

interface Props {
    readonly candidate: Pick<ChainCandidateInterface, 'cell' | 'value'>;
    readonly operator?: '=' | '≠';
    readonly children?: string | null;
}

export const HintChainBlock = ({ candidate, operator = '=', children }: Props) => {
    const { t } = useLingui();
    const row = candidate.cell.y + 1;
    const column = candidate.cell.x + 1;
    const { value } = candidate;
    const label = t`R${row}C${column} ${operator} ${value}`;

    return (
        <View style={styles.link}>
            {children ? <BlackText style={styles.arrow}>{children}</BlackText> : null}
            <View style={styles.block}>
                <BlackText style={styles.blockText}>{label}</BlackText>
            </View>
        </View>
    );
};
