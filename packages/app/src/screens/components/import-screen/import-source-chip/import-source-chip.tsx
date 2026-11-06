import { AppButton } from '@suuudokuuu/ui';

import { ImportSourceChipStyles as styles } from './import-source-chip.styles';

import type { LucideIcon } from 'lucide-react-native';

interface Props {
    readonly icon: LucideIcon;
    readonly text: string;
    readonly testID: string;
    readonly onPress: () => void;
}

export const ImportSourceChip = ({ icon, text, testID, onPress }: Props) => (
    <AppButton
        style={styles.button}
        textStyle={styles.text}
        icon={icon}
        onPress={onPress}
        size="compact"
        testID={testID}
        text={text}
        variant="secondary"
    />
);
