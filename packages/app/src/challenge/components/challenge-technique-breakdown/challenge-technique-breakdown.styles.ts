import { StyleSheet } from 'react-native';

export const ChallengeTechniqueBreakdownStyles = StyleSheet.create({
    container: {
        gap: 7,
        width: '100%'
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6
    },
    headline: {
        fontFamily: 'Inter_700Bold',
        fontSize: 18,
        letterSpacing: -0.4,
        marginTop: 2
    },
    iconBox: {
        alignItems: 'center',
        borderRadius: 12,
        height: 40,
        justifyContent: 'center',
        width: 40
    },
    label: {
        fontFamily: 'Inter_700Bold',
        fontSize: 11,
        letterSpacing: 1.2,
        opacity: 0.68,
        textTransform: 'uppercase'
    },
    textColumn: {
        flex: 1
    }
});
