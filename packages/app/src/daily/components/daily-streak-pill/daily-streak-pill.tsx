import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import LucideFlame from 'lucide-react-native/icons/flame';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { applyColorAlpha } from '../../../@generic/utils/apply-color-alpha.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { DailyTintAlpha } from '../../constants/daily-tint-alpha.constant';

import { DailyStreakPillSelectors } from './daily-streak-pill.selectors';
import { DailyStreakPillStyles as styles } from './daily-streak-pill.styles';

const FlameIconSize = 20;

interface Props {
    readonly isTodaySolved: boolean;
    readonly streak: number;
}

export const DailyStreakPill = ({ isTodaySolved, streak }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const accentColor = applyColorAlpha(theme.colors.accent, 1);
    const flameFill = isTodaySolved ? accentColor : 'transparent';
    const rootStyles = [styles.root, { backgroundColor: applyColorAlpha(theme.colors.text.primary, DailyTintAlpha.chip) }];
    const streakStyles = [styles.streak, { color: theme.colors.text.primary }];

    return (
        <View
            accessibilityLabel={t({ message: plural(streak, { one: '# day streak', other: '# day streak' }) })}
            accessibilityRole="text"
            accessible
            style={rootStyles}
            testID={DailyStreakPillSelectors.Root}
        >
            <LucideFlame color={accentColor} fill={flameFill} size={FlameIconSize} />

            <BlackText style={streakStyles} testID={DailyStreakPillSelectors.Streak}>
                {streak}
            </BlackText>
        </View>
    );
};
