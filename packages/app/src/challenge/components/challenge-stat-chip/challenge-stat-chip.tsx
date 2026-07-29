import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';

import { ChallengeStatChipStyles as styles } from './challenge-stat-chip.styles';

import type { LucideIcon } from 'lucide-react-native';

const IconSize = 13;

interface Props {
    readonly icon: LucideIcon;
    readonly testID: string;
    readonly text: string;
}

export const ChallengeStatChip = ({ icon: Icon, testID, text }: Props) => {
    const { theme } = use(ThemeContext);

    const chipStyle = [styles.chip, { borderColor: theme.colors.value.border }];
    const textStyle = [styles.text, { color: theme.colors.label.hint }];

    return (
        <View style={chipStyle} testID={testID}>
            <Icon color={theme.colors.label.hint} size={IconSize} />

            <Text allowFontScaling={false} style={textStyle}>
                {text}
            </Text>
        </View>
    );
};
