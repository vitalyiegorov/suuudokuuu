import { use } from 'react';
import { Text, View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeStatCountBadge } from '../challenge-stat-count-badge/challenge-stat-count-badge';

import { ChallengeStatTileStyles as styles } from './challenge-stat-tile.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
    readonly count?: number;
    readonly label: string;
    readonly testID?: string;
}

export const ChallengeStatTile = ({ children, count, label, testID }: Props) => {
    const { theme } = use(ThemeContext);

    const tileStyle = [styles.tile, { backgroundColor: theme.colors.black }];
    const labelStyle = [styles.label, { color: theme.colors.label.main }];
    const countBadge = isDefined(count) ? <ChallengeStatCountBadge count={count} /> : null;

    return (
        <View style={styles.column} testID={testID}>
            <View style={tileStyle}>
                {children}
                {countBadge}
            </View>
            <Text allowFontScaling={false} numberOfLines={2} style={labelStyle}>
                {label}
            </Text>
        </View>
    );
};
