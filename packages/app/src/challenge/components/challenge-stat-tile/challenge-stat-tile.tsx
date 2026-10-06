import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { use } from 'react';
import { Text, View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeStatCountBadge } from '../challenge-stat-count-badge/challenge-stat-count-badge';

import { ChallengeStatTileStyles as styles } from './challenge-stat-tile.styles';

import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly children: ReactNode;
    readonly count?: number;
    readonly label: string;
    readonly testID?: string;
    readonly tileStyle?: StyleProp<ViewStyle>;
}

export const ChallengeStatTile = ({ children, count, label, testID, tileStyle }: Props) => {
    const { theme } = use(ThemeContext);

    const tileStyles = [styles.tile, { backgroundColor: theme.colors.ink }, tileStyle];
    const labelStyle = [styles.label, { color: theme.colors.text.primary }];
    const countBadge = isDefined(count) ? <ChallengeStatCountBadge count={count} testID={`${testID}.Count`} /> : null;

    return (
        <View style={styles.column} testID={testID}>
            <View style={tileStyles}>
                {children}
                {countBadge}
            </View>
            <Text maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} numberOfLines={2} style={labelStyle}>
                {label}
            </Text>
        </View>
    );
};
