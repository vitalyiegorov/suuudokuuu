import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';

import { ChallengeStatCountBadgeStyles as styles } from './challenge-stat-count-badge.styles';

interface Props {
    readonly count: number;
    readonly testID?: string;
}

export const ChallengeStatCountBadge = ({ count, testID }: Props) => {
    const { theme } = use(ThemeContext);

    const badgeStyle = [styles.badge, { backgroundColor: theme.colors.red, borderColor: theme.colors.background }];
    const countStyle = [styles.count, { color: theme.colors.redFillText }];

    return (
        <View style={badgeStyle} testID={testID}>
            <Text allowFontScaling={false} style={countStyle}>
                {count}
            </Text>
        </View>
    );
};
