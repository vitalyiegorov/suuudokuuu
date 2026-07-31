import { AppButton, AppSettingsRow } from '@suuudokuuu/ui';
import { Check, Pencil } from 'lucide-react-native';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { ThemeContext } from '../../../theme/context/theme.context';

import { ThemeListRowStyles as styles } from './theme-list-row.styles';

import type { OnEventFn } from '@rnw-community/shared';

interface Props {
    readonly description?: string;
    readonly editAccessibilityLabel: string;
    readonly isSelected: boolean;
    readonly onEdit?: OnEventFn;
    readonly onPress: OnEventFn;
    readonly testID?: string;
    readonly title: string;
}

export const ThemeListRow = ({ description, editAccessibilityLabel, isSelected, onEdit, onPress, testID, title }: Props) => {
    const { theme } = use(ThemeContext);

    const hasEditAction = isDefined(onEdit);
    const accessibilityState = { selected: isSelected };
    const rowBorderColor = isSelected ? theme.colors.text.primary : theme.colors.surface.border;
    const rowStyle = { borderColor: rowBorderColor, borderWidth: 2 };

    const trailing = (
        <View style={styles.trailing}>
            <View style={styles.checkSlot}>
                {isSelected && <Check color={theme.colors.surface.subtleText} height={22} strokeWidth={2.25} width={22} />}
            </View>
            {hasEditAction && (
                <AppButton accessibilityLabel={editAccessibilityLabel} icon={Pencil} onPress={onEdit} size="compact" variant="secondary" />
            )}
        </View>
    );

    return (
        <Pressable
            accessibilityLabel={title}
            accessibilityRole="button"
            accessibilityState={accessibilityState}
            onPress={onPress}
            style={styles.pressable}
            testID={testID}
        >
            <AppSettingsRow description={description} style={rowStyle} title={title} trailing={trailing} />
        </Pressable>
    );
};
