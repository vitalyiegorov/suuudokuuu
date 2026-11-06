import { useLingui } from '@lingui/react/macro';
import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { AppButton } from '@suuudokuuu/ui';
import LucideDelete from 'lucide-react-native/icons/delete';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useReduceMotion } from '../../../../@generic/hooks/use-reduce-motion.hook';
import { ImportCellPadButton } from '../import-cell-pad-button/import-cell-pad-button';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportCellPadStyles as styles } from './import-cell-pad.styles';

const padValues = Array.from({ length: defaultSudokuConfig.fieldSize }, (_, index) => index + 1);
interface Props {
    readonly toggleLabel: string | null;
    readonly onToggleEntry: () => void;
    readonly onInput: (value: number) => void;
}

export const ImportCellPad = ({ onInput, toggleLabel, onToggleEntry }: Props) => {
    const { t } = useLingui();

    const isMotionReduced = useReduceMotion();
    const motionProps = isMotionReduced ? {} : { entering: FadeIn, exiting: FadeOut };

    const handleClear = () => void onInput(defaultSudokuConfig.blankCellValue);

    return (
        <Animated.View {...motionProps} style={styles.wrapper}>
            <View style={styles.pad}>
                {padValues.map(value => (
                    <ImportCellPadButton isDisabled={false} key={value} onInput={onInput} value={value} />
                ))}
                <AppButton
                    accessibilityLabel={t`Clear cell`}
                    icon={LucideDelete}
                    onPress={handleClear}
                    size="compact"
                    style={styles.button}
                    testID={ImportScreenSelectors.ClearButton}
                    variant="secondary"
                />
            </View>
            {toggleLabel === null ? null : (
                <AppButton
                    onPress={onToggleEntry}
                    size="compact"
                    testID={ImportScreenSelectors.EntryToggleButton}
                    text={toggleLabel}
                    variant="secondary"
                />
            )}
        </Animated.View>
    );
};
