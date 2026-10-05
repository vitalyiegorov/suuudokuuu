import { AppSettingsRow } from '@suuudokuuu/ui';
import Check from 'lucide-react-native/icons/check';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';

import { ThemeListRowStyles as styles } from './theme-list-row.styles';

import type { OnEventFn } from '@rnw-community/shared';
import type { ReactNode } from 'react';

interface Props {
    readonly children?: ReactNode;
    readonly description?: string;
    readonly isSelected: boolean;
    readonly onPress: OnEventFn;
    readonly testID?: string;
    readonly title: string;
}

export const ThemeListRow = ({ children, description, isSelected, onPress, testID, title }: Props) => {
    const { theme } = use(ThemeContext);

    const accessibilityState = { selected: isSelected };

    const trailing = (
        <View style={styles.trailing}>
            <View style={styles.checkSlot}>
                {isSelected && <Check color={theme.colors.text.primary} height={22} strokeWidth={2.25} width={22} />}
            </View>
            {children}
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
            <AppSettingsRow description={description} title={title} trailing={trailing} />
        </Pressable>
    );
};
