import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { gameGetCellName } from '../../utils/game-get-cell-name.util';
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
    const blockStyles = [styles.block, style];
    const label = `${gameGetCellName(candidate.cell)} ${operator} ${candidate.value}`;

    return (
        <View style={styles.link}>
            {children ? <BlackText style={styles.arrow}>{children}</BlackText> : null}
            <View style={blockStyles}>
                <BlackText style={styles.blockText}>{label}</BlackText>
            </View>
        </View>
    );
};
