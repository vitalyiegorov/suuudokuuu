import { StyleSheet } from 'react-native-unistyles';

const PillHeight = 36;
const TitleLineHeight = 38;

export const DailyStreakPillStyles = StyleSheet.create(theme => ({
    root: {
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius.pill,
        flexDirection: 'row',
        flexShrink: 0,
        gap: 6,
        height: PillHeight,
        marginTop: (TitleLineHeight - PillHeight) / 2,
        paddingLeft: 10,
        paddingRight: 14
    },
    streak: {
        fontSize: 17,
        fontVariant: ['tabular-nums'],
        fontWeight: '800',
        lineHeight: 22,
        textAlign: 'left'
    }
}));
