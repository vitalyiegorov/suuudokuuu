import { StyleSheet } from 'react-native';

export const ChallengeResultHeroStyles = StyleSheet.create({
    header: {
        fontSize: 24,
        marginBottom: 0,
        textAlign: 'left'
    },
    hero: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        maxWidth: 560,
        width: '100%'
    },
    heroOutcome: {
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 1,
        gap: 12
    },
    iconFrame: {
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        height: 40,
        justifyContent: 'center',
        width: 40
    }
});
