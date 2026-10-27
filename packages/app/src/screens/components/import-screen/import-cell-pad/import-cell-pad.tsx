import { useLingui } from '@lingui/react/macro';
import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { AppButton } from '@suuudokuuu/ui';
import LucideDelete from 'lucide-react-native/icons/delete';
import { View } from 'react-native';

import { ImportCellPadButton } from '../import-cell-pad-button/import-cell-pad-button';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportCellPadStyles as styles } from './import-cell-pad.styles';

const padValues = Array.from({ length: defaultSudokuConfig.fieldSize }, (_, index) => index + 1);

interface Props {
    readonly onInput: (value: number) => void;
}

export const ImportCellPad = ({ onInput }: Props) => {
    const { t } = useLingui();

    const handleClear = () => void onInput(defaultSudokuConfig.blankCellValue);

    return (
        <View style={styles.pad}>
            {padValues.map(value => (
                <ImportCellPadButton key={value} onInput={onInput} value={value} />
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
    );
};
