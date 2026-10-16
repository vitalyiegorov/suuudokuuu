import { AppSettingsRow } from '@suuudokuuu/ui';
import { Pressable } from 'react-native';

import { SettingsActionRowStyles as styles } from './settings-action-row.styles';

interface Props {
    readonly description: string;
    readonly onPress: () => void;
    readonly testID: string;
    readonly title: string;
}

export const SettingsActionRow = ({ description, onPress, testID, title }: Props) => {
    const accessibilityLabel = `${title}, ${description}`;

    return (
        <Pressable
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
            onPress={onPress}
            style={styles.pressable}
            testID={testID}
        >
            <AppSettingsRow description={description} title={title} />
        </Pressable>
    );
};
