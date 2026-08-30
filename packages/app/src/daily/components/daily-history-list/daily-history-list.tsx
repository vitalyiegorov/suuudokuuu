import { Trans, useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { getDifficultyMessage } from '../../../@generic/utils/get-difficulty-message.util';
import { settingsLanguageSelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { dailyGetCompletedDays } from '../../utils/daily-get-completed-days.util';
import { dailyGetDateText } from '../../utils/daily-get-date-text.util';

import { DailyHistoryListSelectors } from './daily-history-list.selectors';
import { DailyHistoryListStyles as styles } from './daily-history-list.styles';

interface Props {
    readonly completedDayNumbers: readonly number[];
}

export const DailyHistoryList = ({ completedDayNumbers }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const language = useAppSelector(settingsLanguageSelector);
    const completedDays = dailyGetCompletedDays(completedDayNumbers);
    const hasSolves = completedDays.length > 0;

    const eyebrowStyles = [styles.eyebrow, { color: theme.colors.text.hint }];
    const emptyStyles = [styles.empty, { color: theme.colors.text.hint }];
    const itemDateStyles = [styles.itemDate, { color: theme.colors.text.primary }];
    const difficultyStyles = [styles.difficulty, { color: theme.colors.text.hint }];

    return (
        <View style={styles.list} testID={DailyHistoryListSelectors.Root}>
            <BlackText style={eyebrowStyles}>
                <Trans>Recent solves</Trans>
            </BlackText>

            {hasSolves ? (
                completedDays.map(({ dayNumber, difficulty }) => {
                    const difficultyLabel = t(getDifficultyMessage(difficulty));

                    return (
                        <View key={dayNumber} style={styles.item} testID={`${DailyHistoryListSelectors.Item}.${dayNumber}`}>
                            <BlackText numberOfLines={1} style={itemDateStyles}>
                                {dailyGetDateText(dayNumber, language)}
                            </BlackText>

                            <BlackText style={difficultyStyles}>{difficultyLabel}</BlackText>
                        </View>
                    );
                })
            ) : (
                <BlackText style={emptyStyles} testID={DailyHistoryListSelectors.Empty}>
                    <Trans>No solves yet. Today&rsquo;s puzzle is waiting.</Trans>
                </BlackText>
            )}
        </View>
    );
};
