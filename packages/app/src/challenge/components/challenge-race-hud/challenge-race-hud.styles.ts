import { StyleSheet } from 'react-native';

export const ChallengeRaceHudStyles = StyleSheet.create({
    card: {
        borderCurve: 'continuous',
        borderRadius: 24,
        gap: 14,
        padding: 16,
        width: '100%'
    },
    container: {
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
