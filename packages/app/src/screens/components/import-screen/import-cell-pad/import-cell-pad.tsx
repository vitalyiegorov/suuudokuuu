import { useLingui } from '@lingui/react/macro';
import { defaultSudokuConfig } from '@suuudokuuu/generator';
import LucideDelete from 'lucide-react-native/icons/delete';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { ThemeContext } from '../../../../theme/context/theme.context';
import { ImportCellPadButton } from '../import-cell-pad-button/import-cell-pad-button';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportCellPadStyles as styles } from './import-cell-pad.styles';

const padValues = Array.from({ length: defaultSudokuConfig.fieldSize }, (_, index) => index + 1);
interface Props {
    readonly isDisabled: boolean;
    readonly onInput: (value: number) => void;
}

export const ImportCellPad = ({ isDisabled, onInput }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const handleClear = () => void onInput(defaultSudokuConfig.blankCellValue);

    return (
        <View style={styles.pad}>
            {padValues.map(value => (
                <ImportCellPadButton isDisabled={isDisabled} key={value} onInput={onInput} value={value} />
            ))}
            <Pressable
                accessibilityLabel={t`Clear cell`}
                disabled={isDisabled}
                onPress={handleClear}
                accessibilityRole="button"
                style={({ pressed }) => [styles.button, pressed && styles.pressed]}
                testID={ImportScreenSelectors.ClearButton}
            >
                <View pointerEvents="none" style={styles.surface}>
                    <LucideDelete color={theme.colors.surface.subtleText} size={20} />
                </View>
            </Pressable>
        </View>
    );
};
