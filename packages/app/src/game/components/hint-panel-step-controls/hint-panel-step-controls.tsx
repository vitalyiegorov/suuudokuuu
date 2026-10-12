import { View } from 'react-native';

import { HintPanelApplyButton } from '../hint-panel-apply-button/hint-panel-apply-button';
import { HintPanelRevealButton } from '../hint-panel-reveal-button/hint-panel-reveal-button';
import { HintPanelSelectors } from '../hint-panel/hint-panel.selectors';
import { HintPanelStyles as styles } from '../hint-panel/hint-panel.styles';

export const HintPanelStepControls = () => (
    <View style={styles.actions} testID={HintPanelSelectors.FOOTER}>
        <HintPanelRevealButton />
        <HintPanelApplyButton />
    </View>
);
