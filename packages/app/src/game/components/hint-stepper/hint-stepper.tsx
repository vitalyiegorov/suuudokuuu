import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { GameContext } from '../../context/game.context';
import { HintPanelApplyButton } from '../hint-panel-apply-button/hint-panel-apply-button';
import { HintPanelSelectors } from '../hint-panel/hint-panel.selectors';
import { HintPanelStyles as styles } from '../hint-panel/hint-panel.styles';
import { HintStepperBack } from '../hint-stepper-back/hint-stepper-back';
import { HintStepperNext } from '../hint-stepper-next/hint-stepper-next';

interface Props {
    readonly children: string;
}

export const HintStepper = ({ children }: Props) => {
    const { snapshot } = use(GameContext);
    const isLastPage = snapshot.hintPageIndex >= snapshot.hintPageCount - 1;

    return (
        <View style={styles.actions} testID={HintPanelSelectors.FOOTER}>
            <HintStepperBack />
            <BlackText
                accessibilityLabel={children}
                accessibilityLiveRegion="polite"
                numberOfLines={2}
                style={styles.stepperLabel}
                testID={HintPanelSelectors.Progress}
            >
                {children}
            </BlackText>
            {isLastPage ? <HintPanelApplyButton style={styles.stepperButton} /> : <HintStepperNext />}
        </View>
    );
};
