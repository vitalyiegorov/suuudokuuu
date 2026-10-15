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
    const linkStyles = [styles.link, style];
    const label = `${gameGetCellName(candidate.cell)} ${operator} ${candidate.value}`;

    return (
        <View style={linkStyles}>
            {children ? <BlackText style={styles.arrow}>{children}</BlackText> : null}
            <View style={styles.block}>
                <BlackText style={styles.blockText}>{label}</BlackText>
            </View>
        </View>
    );
};
