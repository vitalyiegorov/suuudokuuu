import { useLingui } from '@lingui/react/macro';
import { ForcingOutcomeKindEnum } from '@suuudokuuu/techniques';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { gameGetCellName } from '../../utils/game-get-cell-name.util';
import { HintChainBlocksStyles as styles } from '../hint-chain-blocks/hint-chain-blocks.styles';
import { HintStepNarrationSelectors } from '../hint-step-narration/hint-step-narration.selectors';

import type { ForcingContradictionType } from '@suuudokuuu/techniques';

interface Props {
    readonly outcome: ForcingContradictionType;
}

export const HintChainContradiction = ({ outcome }: Props) => {
    const { t } = useLingui();
    const cell = outcome.kind === ForcingOutcomeKindEnum.NO_POSITION ? '' : gameGetCellName(outcome.cell);
    const value = outcome.kind === ForcingOutcomeKindEnum.EMPTY_CELL ? null : outcome.value;
    const cellContradiction =
        outcome.kind === ForcingOutcomeKindEnum.EMPTY_CELL ? t`✕ no candidate for ${cell}` : t`✕ ${cell} cannot be ${value}`;
    const text = outcome.kind === ForcingOutcomeKindEnum.NO_POSITION ? t`✕ no place for ${value}` : cellContradiction;

    return (
        <View style={styles.contradiction} testID={HintStepNarrationSelectors.CONTRADICTION}>
            <BlackText style={styles.contradictionText}>{text}</BlackText>
        </View>
    );
};
