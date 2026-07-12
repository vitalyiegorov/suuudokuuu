import { use } from 'react';
import { Pressable } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';

import { HistoryDifficultyChipStyles as styles } from './history-difficulty-chip.styles';

interface Props {
    readonly isSelected: boolean;
    readonly label: string;
    readonly onPress: () => void;
}

export const HistoryDifficultyChip = ({ isSelected, label, onPress }: Props) => {
    const { theme } = use(ThemeContext);

    const containerStyles = [
        styles.container,
        {
            backgroundColor: isSelected ? theme.colors.black : theme.colors.candidate.bg,
            borderColor: isSelected ? theme.colors.black : theme.colors.candidate.border
        }
    ];
    const labelStyles = [styles.label, { color: isSelected ? theme.colors.label.inverted : theme.colors.label.hint }];

    return (
        <Pressable accessibilityRole="button" onPress={onPress} style={containerStyles}>
            <BlackText numberOfLines={1} style={labelStyles}>
                {label}
            </BlackText>
        </Pressable>
    );
};
