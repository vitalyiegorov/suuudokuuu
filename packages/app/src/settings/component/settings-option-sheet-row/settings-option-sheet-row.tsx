import Check from 'lucide-react-native/icons/check';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';
import { settingsOptionSheetGetColors } from '../../utils/settings-option-sheet-get-colors.util';
import { SettingsOptionSheetSelectors } from '../settings-option-sheet/settings-option-sheet.selectors';

import { SettingsOptionSheetRowStyles as styles } from './settings-option-sheet-row.styles';

interface Props {
    readonly description?: string;
    readonly isSelected: boolean;
    readonly label: string;
    readonly onPress: () => void;
    readonly testID?: string;
}

export const SettingsOptionSheetRow = ({
    description = '',
    isSelected,
    label,
    onPress,
    testID = SettingsOptionSheetSelectors.Option
}: Props) => {
    const { theme } = use(ThemeContext);

    const sheetColors = settingsOptionSheetGetColors(theme);
    const containerStyles = [styles.container, { backgroundColor: sheetColors.panelBackground }];
    const titleStyles = [styles.title, isSelected ? styles.selectedTitle : null];
    const descriptionStyles = [styles.description, { color: sheetColors.descriptionColor }];
    const checkColor = sheetColors.panelText;
    const check = isSelected ? <Check color={checkColor} height={22} strokeWidth={2.25} width={22} /> : null;
    const accessibilityState = { selected: isSelected };
    const accessibilityLabel = isNotEmptyString(description) ? `${label}, ${description}` : label;

    return (
        <Pressable
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
            accessibilityState={accessibilityState}
            onPress={onPress}
            style={containerStyles}
            testID={testID}
        >
            <View style={styles.content}>
                <BlackText numberOfLines={1} style={titleStyles}>
                    {label}
                </BlackText>
                {isNotEmptyString(description) ? (
                    <BlackText numberOfLines={1} style={descriptionStyles}>
                        {description}
                    </BlackText>
                ) : null}
            </View>
            {check}
        </Pressable>
    );
};
