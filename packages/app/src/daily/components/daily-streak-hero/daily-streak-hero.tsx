import { plural } from '@lingui/core/macro';
import LucideFlame from 'lucide-react-native/icons/flame';
import { use } from 'react';
import { View } from 'react-native';

import { isPositiveNumber } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { applyColorAlpha } from '../../../@generic/utils/apply-color-alpha.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { DailyTintAlpha } from '../../constants/daily-tint-alpha.constant';

import { DailyStreakHeroSelectors } from './daily-streak-hero.selectors';
import { DailyStreakHeroStyles as styles } from './daily-streak-hero.styles';

const FlameIconSize = 46;

interface Props {
    readonly bestStreak: number;
    readonly isTodaySolved: boolean;
    readonly streak: number;
}

export const DailyStreakHero = ({ bestStreak, isTodaySolved, streak }: Props) => {
    const { theme } = use(ThemeContext);

    const accentColor = applyColorAlpha(theme.colors.accent, 1);
    const flameFill = isTodaySolved ? accentColor : 'transparent';
    const streakText = plural(streak, { one: 'daily solve in a row', other: 'daily solves in a row' });
    const bestStreakText = plural(bestStreak, { one: 'Best streak: # day', other: 'Best streak: # days' });
    const streakStyles = [styles.streak, { color: theme.colors.text.primary }];
    const streakLabelStyles = [styles.streakLabel, { color: applyColorAlpha(theme.colors.text.primary, DailyTintAlpha.secondaryText) }];
    const bestStreakStyles = [styles.bestStreak, { color: theme.colors.text.hint }];

    return (
        <View style={styles.root} testID={DailyStreakHeroSelectors.Root}>
            <LucideFlame color={accentColor} fill={flameFill} size={FlameIconSize} />

            <BlackText style={streakStyles} testID={DailyStreakHeroSelectors.Streak}>
                {streak}
            </BlackText>

            <View style={styles.labels}>
                <BlackText style={streakLabelStyles}>{streakText}</BlackText>

                {isPositiveNumber(bestStreak) ? (
                    <BlackText style={bestStreakStyles} testID={DailyStreakHeroSelectors.BestStreak}>
                        {bestStreakText}
                    </BlackText>
                ) : null}
            </View>
        </View>
    );
};
