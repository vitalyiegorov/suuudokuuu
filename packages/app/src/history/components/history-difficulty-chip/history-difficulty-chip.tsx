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
            backgroundColor: isSelected ? theme.colors.ink : theme.colors.candidate.fill,
            borderColor: isSelected ? theme.colors.ink : theme.colors.surface.border
        }
    ];
    const labelStyles = [styles.label, { color: isSelected ? theme.colors.inkText : theme.colors.text.hint }];

    return (
        <Pressable accessibilityRole="button" onPress={onPress} style={containerStyles}>
            <BlackText numberOfLines={1} style={labelStyles}>
                {label}
            </BlackText>
        </Pressable>
    );
};
