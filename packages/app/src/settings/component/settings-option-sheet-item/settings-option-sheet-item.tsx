import { SettingsOptionSheetStyles as styles } from '../settings-option-sheet/settings-option-sheet.styles';
import { SettingsOptionSheetRow } from '../settings-option-sheet-row/settings-option-sheet-row';
import { SettingsRowFrame } from '../settings-row-frame/settings-row-frame';

interface Props {
    readonly description?: string;
    readonly hasDivider: boolean;
    readonly isSelected: boolean;
    readonly label: string;
    readonly onPress: () => void;
}

export const SettingsOptionSheetItem = ({ description, hasDivider, isSelected, label, onPress }: Props) => (
    <SettingsRowFrame dividerStyle={styles.divider} hasDivider={hasDivider} itemStyle={styles.item}>
        <SettingsOptionSheetRow description={description} isSelected={isSelected} label={label} onPress={onPress} />
    </SettingsRowFrame>
);
