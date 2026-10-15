import { DailyArchiveDay } from '../daily-archive-day/daily-archive-day';

interface Props {
    dates: readonly string[];
}

export const DailyArchiveList = ({ dates }: Props) => (
    <ul className="link-list">
        {dates.map(date => (
            <DailyArchiveDay date={date} key={date} />
        ))}
    </ul>
);
