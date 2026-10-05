import { View } from 'react-native';

import { useSettings } from '../../../settings/query/use-settings.query';
import { dailyGetWeekDays } from '../../utils/daily-get-week-days.util';
import { DailyWeekDay } from '../daily-week-day/daily-week-day';

import { DailyWeekStripSelectors } from './daily-week-strip.selectors';
import { DailyWeekStripStyles as styles } from './daily-week-strip.styles';

interface Props {
    readonly completedDayNumbers: readonly number[];
    readonly todayDayNumber: number;
}

export const DailyWeekStrip = ({ completedDayNumbers, todayDayNumber }: Props) => {
    const { language } = useSettings();

    return (
        <View style={styles.strip} testID={DailyWeekStripSelectors.Root}>
            {dailyGetWeekDays(todayDayNumber, completedDayNumbers).map(day => (
                <DailyWeekDay day={day} key={day.dayNumber} language={language} />
            ))}
        </View>
    );
};
