import { StyleSheet } from 'react-native';

export const ChallengeTechniqueBreakdownRowStyles = StyleSheet.create({
    count: {
        fontFamily: 'Inter_700Bold',
        fontSize: 14,
        fontVariant: ['tabular-nums']
    },
    label: {
        flex: 1,
        fontFamily: 'Inter_500Medium',
        fontSize: 14
    },
    row: {
        alignItems: 'center',
        borderRadius: 13,
        flexDirection: 'row',
        gap: 11,
        paddingHorizontal: 13,
        paddingVertical: 12
    }
});
