import { use } from 'react';
import { ScrollView, View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';
import { settingsOptionSheetGetColors } from '../../utils/settings-option-sheet-get-colors.util';
import { SettingsOptionSheetItem } from '../settings-option-sheet-item/settings-option-sheet-item';

import { SettingsOptionSheetSelectors } from './settings-option-sheet.selectors';
import { SettingsOptionSheetStyles as styles } from './settings-option-sheet.styles';

import type { SettingsOptionSheetItemInterface } from '../../interface/settings-option-sheet-item.interface';

interface Props {
    readonly description: string;
    readonly items: readonly SettingsOptionSheetItemInterface[];
    readonly title: string;
}

export const SettingsOptionSheet = ({ description, items, title }: Props) => {
    const { theme } = use(ThemeContext);

    const sheetColors = settingsOptionSheetGetColors(theme);
    const groupStyles = [
        styles.group,
        {
            backgroundColor: sheetColors.panelBackground
        }
    ];
    const descriptionStyles = [styles.description, { color: sheetColors.descriptionColor }];

    return (
        <>
            <View collapsable={false} style={styles.header}>
                <BlackText style={styles.title} testID={SettingsOptionSheetSelectors.Title}>
                    {title}
                </BlackText>
                <BlackText style={descriptionStyles} testID={SettingsOptionSheetSelectors.Description}>
                    {description}
                </BlackText>
            </View>

            <ScrollView
                contentContainerStyle={styles.listContent}
                contentInsetAdjustmentBehavior="never"
                showsVerticalScrollIndicator={false}
                style={styles.list}
                testID={SettingsOptionSheetSelectors.Root}
            >
                <View style={groupStyles}>
                    {items.map((item, index) => {
                        const hasDivider = index < items.length - 1;

                        return (
                            <SettingsOptionSheetItem
                                description={item.description}
                                hasDivider={hasDivider}
                                isSelected={item.isSelected}
                                key={item.label}
                                label={item.label}
                                onPress={item.onPress}
                                testID={item.testID}
                            />
                        );
                    })}
                </View>
            </ScrollView>
        </>
    );
};
