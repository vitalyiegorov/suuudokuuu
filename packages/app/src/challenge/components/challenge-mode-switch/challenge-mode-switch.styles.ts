import { StyleSheet } from 'react-native-unistyles';

export const ChallengeModeSwitchStyles = StyleSheet.create(theme => ({
    chip: {
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius.pill,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 5,
        paddingHorizontal: 9,
        paddingVertical: 4
    },
    label: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 0.4,
        lineHeight: 13,
        textTransform: 'uppercase'
    }
}));
