import { AppButton } from '@suuudokuuu/ui';

import type { LucideIcon } from 'lucide-react-native';

interface Props {
    readonly icon: LucideIcon;
    readonly text: string;
    readonly testID: string;
    readonly onPress: () => void;
}

export const ImportSourceChip = ({ icon, text, testID, onPress }: Props) => (
    <AppButton icon={icon} onPress={onPress} size="compact" testID={testID} text={text} variant="secondary" />
);
