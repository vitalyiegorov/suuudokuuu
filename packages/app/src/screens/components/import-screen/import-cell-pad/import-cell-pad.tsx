import { useLingui } from '@lingui/react/macro';
import { defaultSudokuConfig } from '@suuudokuuu/generator';
import LucideDelete from 'lucide-react-native/icons/delete';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { ThemeContext } from '../../../../theme/context/theme.context';
import { ImportCellPadButton } from '../import-cell-pad-button/import-cell-pad-button';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportCellPadStyles as styles } from './import-cell-pad.styles';

import type { PressableStateCallbackType } from 'react-native';

const padValues = Array.from({ length: defaultSudokuConfig.fieldSize }, (_, index) => index + 1);
interface Props {
    readonly isDisabled: boolean;
    readonly onInput: (value: number) => void;
}

export const ImportCellPad = ({ isDisabled, onInput }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const handleClear = () => void onInput(defaultSudokuConfig.blankCellValue);

    const getButtonStyles = ({ pressed }: PressableStateCallbackType) => [styles.button, styles.lastButton, pressed && styles.pressed];

    return (
        <View style={styles.pad}>
            <View style={styles.row}>
                {padValues.slice(0, 5).map(value => (
                    <ImportCellPadButton isDisabled={isDisabled} key={value} onInput={onInput} value={value} />
                ))}
            </View>
            <View style={styles.row}>
                {padValues.slice(5).map(value => (
                    <ImportCellPadButton isDisabled={isDisabled} key={value} onInput={onInput} value={value} />
                ))}
                <Pressable
                    accessibilityLabel={t`Clear cell`}
                    disabled={isDisabled}
                    onPress={handleClear}
                    accessibilityRole="button"
                    style={getButtonStyles}
                    testID={ImportScreenSelectors.ClearButton}
                >
                    <View pointerEvents="none" style={styles.surface}>
                        <LucideDelete color={theme.colors.surface.subtleText} size={20} />
                    </View>
                </Pressable>
            </View>
        </View>
    );
};
