import { StyleSheet } from 'react-native-unistyles';

const CircleSize = 40;
const HaloWidth = 4;
const HaloSize = CircleSize + HaloWidth * 2;
const WeekdayLineHeight = 14;
const ColumnGap = 7;

export const DailyWeekDayStyles = StyleSheet.create(() => ({
    circle: {
        alignItems: 'center',
        borderRadius: CircleSize / 2,
        height: CircleSize,
        justifyContent: 'center',
        width: CircleSize
    },
    column: {
        alignItems: 'center',
        flex: 1,
        gap: ColumnGap
    },
    dayOfMonth: {
        fontSize: 15,
        fontVariant: ['tabular-nums'],
        fontWeight: '700',
        lineHeight: 18
    },
    dayOfMonthToday: {
        fontWeight: '800'
    },
    halo: {
        alignItems: 'center',
        borderRadius: HaloSize / 2,
        borderWidth: HaloWidth,
        height: HaloSize,
        justifyContent: 'center',
        margin: -HaloWidth,
        width: HaloSize
    },
    link: {
        height: CircleSize,
        position: 'absolute',
        top: WeekdayLineHeight + ColumnGap
    },
    linkToNext: {
        left: '50%',
        right: 0
    },
    linkToPrevious: {
        left: 0,
        right: '50%'
    },
    missed: {
        borderStyle: 'dashed',
        borderWidth: 1.5
    },
    today: {
        borderWidth: 2.5
    },
    upcoming: {
        borderWidth: 1.5
    },
    weekday: {
        fontSize: 12,
        fontWeight: '600',
        lineHeight: WeekdayLineHeight
    },
    weekdayToday: {
        fontWeight: '700'
    }
}));
