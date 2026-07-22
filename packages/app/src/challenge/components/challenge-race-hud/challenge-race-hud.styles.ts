import { StyleSheet } from 'react-native';

export const ChallengeRaceHudStyles = StyleSheet.create({
    card: {
        borderCurve: 'continuous',
        borderRadius: 22,
        gap: 12,
        padding: 14,
        width: '100%'
    },
    container: {
        marginBottom: 16,
        paddingHorizontal: 10,
        width: '100%'
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        minHeight: 34
    }
});
