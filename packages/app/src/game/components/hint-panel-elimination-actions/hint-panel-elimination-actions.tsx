import { useLingui } from '@lingui/react/macro';
import { findHintStepScript, findRevealStepScript } from '@suuudokuuu/field-core';
import { AppButton } from '@suuudokuuu/ui';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { HintPanelSelectors } from '../hint-panel/hint-panel.selectors';
import { HintPanelStyles as styles } from '../hint-panel/hint-panel.styles';

import type { FieldEngine } from '@suuudokuuu/field-core';

interface Props {
    readonly engine: FieldEngine;
    readonly onApply: () => void;
}

export const HintPanelEliminationActions = ({ engine, onApply }: Props) => {
    const { t } = useLingui();

    const handleContinue = () => {
        onApply();

        const nextScript = findHintStepScript(engine.Sudoku, engine.getSnapshot().eliminatedCandidates);

        if (isDefined(nextScript)) {
            engine.startStepScript(nextScript);
        }
    };

    const handleReveal = () => {
        const revealScript = findRevealStepScript(engine.Sudoku);

        if (isDefined(revealScript)) {
            engine.startStepScript(revealScript);
        }
    };

    return (
        <View style={styles.actions}>
            <AppButton
                accessibilityLabel={t`Continue to next hint`}
                onPress={handleContinue}
                size="compact"
                testID={HintPanelSelectors.ContinueButton}
                text={t`Continue`}
            />
            <AppButton
                accessibilityLabel={t`Reveal a digit`}
                onPress={handleReveal}
                size="compact"
                testID={HintPanelSelectors.RevealButton}
                text={t`Reveal`}
                variant="ghost"
            />
        </View>
    );
};
