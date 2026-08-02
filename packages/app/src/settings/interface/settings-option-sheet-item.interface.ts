export interface SettingsOptionSheetItemInterface {
    readonly description?: string;
    readonly isSelected: boolean;
    readonly label: string;
    readonly onPress: () => void;
    readonly testID?: string;
}
