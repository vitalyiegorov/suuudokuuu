import LucideChevronLeft from 'lucide-react-native/icons/chevron-left';
import LucideChevronRight from 'lucide-react-native/icons/chevron-right';
import { use } from 'react';
import { View } from 'react-native';

import { isPositiveNumber } from '@rnw-community/shared';

import { AppIconButton } from '../../../../@generic/components/app-icon-button/app-icon-button';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { ReplayShareAction } from '../../replay-share-action/replay-share-action';
import { ReplayControlsSelectors } from '../replay-controls.selectors';
import { ReplayControlsStyles as styles } from '../replay-controls.styles';

import type { EmptyFn } from '@rnw-community/shared';
import type { CurrentRunType } from '@suuudokuuu/progress';

interface Props {
    readonly currentStep: number;
    readonly gameState: CurrentRunType;
    readonly onNextStep: EmptyFn;
    readonly onPrevStep: EmptyFn;
    readonly totalSteps: number;
}

export const ReplayStepNavigation = ({ currentStep, gameState, onNextStep, onPrevStep, totalSteps }: Props) => {
    const { theme } = use(ThemeContext);

    const canGoBack = isPositiveNumber(currentStep);
    const canGoForward = currentStep < totalSteps;
    const previousIconColor = canGoBack ? theme.colors.surface.raisedText : theme.colors.text.hint;
    const nextIconColor = canGoForward ? theme.colors.surface.raisedText : theme.colors.text.hint;
    const previousButtonStyles = [styles.navButton, !canGoBack && styles.disabledButton];
    const nextButtonStyles = [styles.navButton, !canGoForward && styles.disabledButton];

    return (
        <View style={styles.controlsRow}>
            <AppIconButton
                disabled={!canGoBack}
                onPress={onPrevStep}
                style={previousButtonStyles}
                testID={ReplayControlsSelectors.PreviousButton}
                variant="inverted"
            >
                <LucideChevronLeft color={previousIconColor} size={26} />
            </AppIconButton>

            <ReplayShareAction gameState={gameState} />

            <AppIconButton
                disabled={!canGoForward}
                onPress={onNextStep}
                style={nextButtonStyles}
                testID={ReplayControlsSelectors.NextButton}
                variant="inverted"
            >
                <LucideChevronRight color={nextIconColor} size={26} />
            </AppIconButton>
        </View>
    );
};
