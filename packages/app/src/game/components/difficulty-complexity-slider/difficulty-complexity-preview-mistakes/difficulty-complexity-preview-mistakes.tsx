import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { DifficultyComplexitySliderStyles as styles } from '../difficulty-complexity-slider.styles';

interface Props {
    readonly description: string;
    readonly label: string;
}

export const DifficultyComplexityPreviewMistakes = ({ description, label }: Props) => {
    const { theme } = use(ThemeContext);
    const mistakeBadgeStyles = [styles.previewMistakeBadge, { backgroundColor: theme.colors.ink, borderColor: theme.colors.ink }];
    const mistakeBadgeTextStyles = [styles.previewMistakeBadgeText, { color: theme.colors.inkText }];
    const mistakeDescriptionStyles = [styles.previewMistakeDescription, { color: theme.colors.text.hint }];

    return (
        <View style={styles.previewMistakeRow}>
            <View style={mistakeBadgeStyles}>
                <BlackText style={mistakeBadgeTextStyles}>{label}</BlackText>
            </View>
            <BlackText numberOfLines={1} style={mistakeDescriptionStyles}>
                {description}
            </BlackText>
        </View>
    );
};
