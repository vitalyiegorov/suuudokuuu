import { useLingui } from '@lingui/react/macro';
import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { AppButton } from '@suuudokuuu/ui';
import LucideDelete from 'lucide-react-native/icons/delete';
import { View } from 'react-native';
import Animated, { cubicBezier } from 'react-native-reanimated';

import { animationDurationConstant, animationEaseOutCurveConstant } from '../../../../@generic/constants/animation.constant';
import { ImportCellPadButton } from '../import-cell-pad-button/import-cell-pad-button';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportCellPadStyles as styles } from './import-cell-pad.styles';

const padValues = Array.from({ length: defaultSudokuConfig.fieldSize }, (_, index) => index + 1);
const disabledOpacity = 0.42;
const dimTransition = {
    transitionDuration: animationDurationConstant,
    transitionProperty: 'opacity',
    transitionTimingFunction: cubicBezier(...animationEaseOutCurveConstant),
    width: '100%'
} as const;

interface Props {
    readonly isDisabled: boolean;
    readonly onInput: (value: number) => void;
}

export const ImportCellPad = ({ isDisabled, onInput }: Props) => {
    const { t } = useLingui();

    const handleClear = () => void onInput(defaultSudokuConfig.blankCellValue);

    const dimStyles = { ...dimTransition, opacity: isDisabled ? disabledOpacity : 1 };
    const pointerEvents = isDisabled ? 'none' : 'auto';

    return (
        <Animated.View pointerEvents={pointerEvents} style={dimStyles}>
            <View style={styles.pad}>
                {padValues.map(value => (
                    <ImportCellPadButton isDisabled={isDisabled} key={value} onInput={onInput} value={value} />
                ))}
                <AppButton
                    accessibilityLabel={t`Clear cell`}
                    disabled={isDisabled}
                    icon={LucideDelete}
                    onPress={handleClear}
                    size="compact"
                    style={styles.button}
                    testID={ImportScreenSelectors.ClearButton}
                    variant="secondary"
                />
            </View>
        </Animated.View>
    );
};
