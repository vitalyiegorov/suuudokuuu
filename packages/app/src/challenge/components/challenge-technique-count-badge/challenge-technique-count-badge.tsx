import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';

import { ChallengeTechniqueCountBadgeStyles as styles } from './challenge-technique-count-badge.styles';

interface Props {
    readonly count: number;
}

export const ChallengeTechniqueCountBadge = ({ count }: Props) => {
    const { theme } = use(ThemeContext);

    const badgeStyle = [styles.badge, { backgroundColor: theme.colors.red, borderColor: theme.colors.background }];
    const countStyle = [styles.count, { color: theme.colors.redFillText }];

    return (
        <View style={badgeStyle}>
            <Text allowFontScaling={false} style={countStyle}>
                {count}
            </Text>
        </View>
    );
};
