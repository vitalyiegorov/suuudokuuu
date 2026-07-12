import { StyleSheet } from 'react-native';

export const ReplayHeaderStyles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        borderRadius: 34,
        maxWidth: 396,
        minHeight: 68,
        paddingHorizontal: 18,
        paddingVertical: 10,
        width: '100%'
    },
    item: {
        gap: 4
    },
    label: {
        fontSize: 10,
        letterSpacing: 0.5,
        lineHeight: 12
    },
    separator: {
        height: 36,
        marginHorizontal: 2
    },
    value: {
        fontSize: 17,
        lineHeight: 20
    }
});
