import { AppButton } from '@suuudokuuu/ui';
import { MaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../../theme/context/theme.context';

import { ImportSourceChipStyles as styles } from './import-source-chip.styles';

import type { LucideIcon } from 'lucide-react-native';

interface Props {
    readonly icon: LucideIcon;
    readonly text: string;
    readonly testID: string;
    readonly onPress: () => void;
}

export const ImportSourceChip = ({ icon: Icon, text, testID, onPress }: Props) => {
    const { theme } = use(ThemeContext);

    return (
        <AppButton accessibilityLabel={text} onPress={onPress} size="compact" style={styles.button} testID={testID} variant="secondary">
            <View style={styles.content}>
                <Icon color={theme.colors.surface.subtleText} size={20} />
                <Text maxFontSizeMultiplier={MaxFontSizeMultiplierConstant} style={styles.text}>
                    {text}
                </Text>
            </View>
        </AppButton>
    );
};
