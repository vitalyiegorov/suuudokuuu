import { StyleSheet } from 'react-native';

export const ReplayTechniqueStyles = StyleSheet.create({
    badge: {
        borderRadius: 999,
        borderWidth: 1,
        fontSize: 10,
        fontWeight: '700',
        paddingHorizontal: 6
    },
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'center',
        minHeight: 18
    },
    text: {
        fontSize: 12,
        fontWeight: '600',
        maxWidth: 180,
        textAlign: 'center'
    }
});
