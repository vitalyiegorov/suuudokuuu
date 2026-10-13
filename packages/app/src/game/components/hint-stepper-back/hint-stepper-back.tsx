import { useLingui } from '@lingui/react/macro';
import { AppButton } from '@suuudokuuu/ui';
import { use } from 'react';

import { GameContext } from '../../context/game.context';
import { HintPanelSelectors } from '../hint-panel/hint-panel.selectors';
import { HintPanelStyles as styles } from '../hint-panel/hint-panel.styles';

export const HintStepperBack = () => {
    const { t } = useLingui();
    const { engine, snapshot } = use(GameContext);

    const isFirstPage = snapshot.hintPageIndex === 0;
    const buttonStyles = [styles.stepperButton, isFirstPage && styles.disabledButton];

    const handleBack = () => {
        engine.hintBack();
    };

    return (
        <AppButton
            accessibilityRole="button"
            disabled={isFirstPage}
            onPress={handleBack}
            size="compact"
            style={buttonStyles}
            testID={HintPanelSelectors.BackButton}
            text={t`‹ Back`}
            variant="ghost"
        />
    );
};
