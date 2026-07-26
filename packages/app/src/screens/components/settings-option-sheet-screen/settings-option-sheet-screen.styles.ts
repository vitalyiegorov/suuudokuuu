import { StyleSheet } from 'react-native-unistyles';

import { settingsOptionSheetGetColors } from '../../../settings/utils/settings-option-sheet-get-colors.util';

export const SettingsOptionSheetScreenStyles = StyleSheet.create(theme => ({
    sheetBackground: {
        backgroundColor: settingsOptionSheetGetColors(theme).panelBackground
    },
    sheetContent: {
        flex: 1
    }
}));
