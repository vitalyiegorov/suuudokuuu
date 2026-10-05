import { Trans } from '@lingui/react/macro';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { applyColorAlpha } from '../../../@generic/utils/apply-color-alpha.util';
import { useSettings } from '../../../settings/query/use-settings.query';
import { ThemeContext } from '../../../theme/context/theme.context';
import { DailyTintAlpha } from '../../constants/daily-tint-alpha.constant';
import { DailyRecentSolveRow } from '../daily-recent-solve-row/daily-recent-solve-row';

import { DailyRecentSolvesSelectors } from './daily-recent-solves.selectors';
import { DailyRecentSolvesStyles as styles } from './daily-recent-solves.styles';

import type { DailyCompletedDayInterface } from '../../utils/daily-get-completed-days.util';

interface Props {
    readonly days: readonly DailyCompletedDayInterface[];
}

export const DailyRecentSolves = ({ days }: Props) => {
    const { theme } = use(ThemeContext);
    const { language } = useSettings();

    const eyebrowStyles = [styles.eyebrow, { color: theme.colors.text.hint }];
    const emptyStyles = [styles.empty, { color: theme.colors.text.hint }];
    const rows = days.map((day, index) => ({ day, hasTopDivider: index > 0 }));
    const listStyles = [styles.list, { backgroundColor: applyColorAlpha(theme.colors.text.primary, DailyTintAlpha.surface) }];

    return (
        <View style={styles.root} testID={DailyRecentSolvesSelectors.Root}>
            <BlackText style={eyebrowStyles}>
                <Trans>Recent solves</Trans>
            </BlackText>

            {days.length > 0 ? (
                <View style={listStyles}>
                    {rows.map(({ day, hasTopDivider }) => (
                        <DailyRecentSolveRow day={day} hasTopDivider={hasTopDivider} key={day.dayNumber} language={language} />
                    ))}
                </View>
            ) : (
                <BlackText style={emptyStyles} testID={DailyRecentSolvesSelectors.Empty}>
                    <Trans>No solves yet. Today&rsquo;s puzzle is waiting.</Trans>
                </BlackText>
            )}
        </View>
    );
};
