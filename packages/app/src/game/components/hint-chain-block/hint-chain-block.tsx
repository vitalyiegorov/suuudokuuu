import { useLingui } from '@lingui/react/macro';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { HintChainBlocksStyles as styles } from '../hint-chain-blocks/hint-chain-blocks.styles';

import type { ChainCandidateInterface } from '@suuudokuuu/techniques';
import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly candidate: Pick<ChainCandidateInterface, 'cell' | 'value'>;
    readonly operator?: '=' | '≠';
    readonly style?: StyleProp<ViewStyle>;
    readonly children?: string | null;
}

export const HintChainBlock = ({ candidate, operator = '=', style, children }: Props) => {
    const { t } = useLingui();
    const row = candidate.cell.y + 1;
    const column = candidate.cell.x + 1;
    const { value } = candidate;
    const linkStyles = [styles.link, style];
    const label = t`R${row}C${column} ${operator} ${value}`;

    return (
        <View style={linkStyles}>
            {children ? <BlackText style={styles.arrow}>{children}</BlackText> : null}
            <View style={styles.block}>
                <BlackText style={styles.blockText}>{label}</BlackText>
            </View>
        </View>
    );
};
