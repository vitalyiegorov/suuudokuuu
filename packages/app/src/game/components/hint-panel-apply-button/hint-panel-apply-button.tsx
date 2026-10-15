import { useLingui } from '@lingui/react/macro';
import { AppButton } from '@suuudokuuu/ui';
import { ImpactFeedbackStyle } from 'expo-haptics';
import { use } from 'react';

import { isDefined } from '@rnw-community/shared';

import { useVibration } from '../../../@generic/hooks/use-vibration.hook';
import { GameContext } from '../../context/game.context';
import { useHintSearch } from '../../hooks/use-hint-search.hook';
import { runCurrentRunCommand } from '../../utils/run-current-run-command.util';
import { HintPanelSelectors } from '../hint-panel/hint-panel.selectors';

import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly style: StyleProp<ViewStyle>;
}

export const HintPanelApplyButton = ({ style }: Props) => {
    const { t } = useLingui();
    const { engine, snapshot } = use(GameContext);
    const [, hapticImpact] = useVibration();
    const { isSearchingHint, searchHint } = useHintSearch();

    const { stepScript } = snapshot;
    const placementValue = stepScript?.placement?.value;
    const isEliminationOnly = !isDefined(placementValue);
    const text = isEliminationOnly ? t`Apply & next` : t`Place ${placementValue}`;
    const testId = isEliminationOnly ? HintPanelSelectors.ContinueButton : HintPanelSelectors.ApplyButton;

    const handleApply = () => {
        if (!isDefined(stepScript)) {
            return;
        }

        const applyStepScript = () => {
            void runCurrentRunCommand(currentRunService => currentRunService.hint(stepScript.eliminations));
            engine.applyStepScript();
        };

        if (isEliminationOnly) {
            searchHint(applyStepScript);

            return;
        }

        hapticImpact(ImpactFeedbackStyle.Light);
        applyStepScript();
    };

    return (
        <AppButton
            accessibilityRole="button"
            isLoading={isSearchingHint}
            onPress={handleApply}
            size="compact"
            style={style}
            testID={testId}
            text={text}
        />
    );
};
