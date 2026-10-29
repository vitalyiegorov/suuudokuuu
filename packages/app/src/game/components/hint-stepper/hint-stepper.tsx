import { use } from 'react';
import { View, useWindowDimensions } from 'react-native';

import { GameContext } from '../../context/game.context';
import { HintPanelApplyButton } from '../hint-panel-apply-button/hint-panel-apply-button';
import { HintPanelSelectors } from '../hint-panel/hint-panel.selectors';
import { HintPanelStyles as styles } from '../hint-panel/hint-panel.styles';
import { HintStepperBack } from '../hint-stepper-back/hint-stepper-back';
import { HintStepperNext } from '../hint-stepper-next/hint-stepper-next';
import { HintStepperProgress } from '../hint-stepper-progress/hint-stepper-progress';

export const HintStepper = () => {
    const { snapshot } = use(GameContext);
    const { fontScale } = useWindowDimensions();

    const isLastPage = snapshot.hintPageIndex >= snapshot.hintPageCount - 1;
    const isLargeText = fontScale > 1;

    return (
        <View style={styles.actions} testID={HintPanelSelectors.FOOTER}>
            {isLargeText ? <HintStepperProgress /> : null}
            <View style={styles.stepperControls}>
                <HintStepperBack />
                {isLargeText ? null : <HintStepperProgress />}
                {isLastPage ? <HintPanelApplyButton style={styles.stepperButton} /> : <HintStepperNext />}
            </View>
        </View>
    );
};
