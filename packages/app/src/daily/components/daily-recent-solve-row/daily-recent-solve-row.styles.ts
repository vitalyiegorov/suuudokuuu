import { StyleSheet } from 'react-native-unistyles';

const CheckBadgeSize = 22;
const RowHorizontalPadding = 16;

export const DailyRecentSolveRowStyles = StyleSheet.create(theme => ({
    checkBadge: {
        alignItems: 'center',
        borderRadius: CheckBadgeSize / 2,
        height: CheckBadgeSize,
        justifyContent: 'center',
        width: CheckBadgeSize
    },
    date: {
        fontSize: 15.5,
        fontWeight: '600',
        lineHeight: 19,
        textAlign: 'left'
    },
    details: {
        flex: 1,
        gap: 2
    },
    difficulty: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 6
    },
    difficultyText: {
        fontSize: 12.5,
        fontWeight: '500',
        lineHeight: 15,
        textAlign: 'left'
    },
    divider: {
        end: 0,
        height: 1,
        position: 'absolute',
        start: RowHorizontalPadding,
        top: 0
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.md,
        minHeight: 56,
        paddingHorizontal: RowHorizontalPadding,
        paddingVertical: theme.spacing.sm
    }
}));
