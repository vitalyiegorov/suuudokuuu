import { AppButton } from '@suuudokuuu/ui';
import Pencil from 'lucide-react-native/icons/pencil';

import type { OnEventFn } from '@rnw-community/shared';

interface Props {
    readonly accessibilityLabel: string;
    readonly onPress: OnEventFn;
}

export const ThemeListRowEditButton = ({ accessibilityLabel, onPress }: Props) => (
    <AppButton accessibilityLabel={accessibilityLabel} icon={Pencil} onPress={onPress} size="compact" variant="secondary" />
);
