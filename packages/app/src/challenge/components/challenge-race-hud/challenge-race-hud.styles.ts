import { StyleSheet } from 'react-native';

export const ChallengeRaceHudStyles = StyleSheet.create({
    card: {
        borderCurve: 'continuous',
        borderRadius: 20,
        gap: 9,
        padding: 12,
        width: '100%'
    },
    container: {
        marginBottom: 10,
        paddingHorizontal: 10,
        width: '100%'
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        minHeight: 30
    }
});
