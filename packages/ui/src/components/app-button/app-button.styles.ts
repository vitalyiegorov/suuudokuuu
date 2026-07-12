import { StyleSheet } from 'react-native';

export const AppButtonStyles = StyleSheet.create({
    button: {
        alignItems: 'center',
        borderCurve: 'continuous',
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        overflow: 'hidden'
    },
    compact: {
        borderRadius: 22,
        minHeight: 44,
        paddingHorizontal: 16
    },
    large: {
        borderRadius: 30,
        minHeight: 60,
        paddingHorizontal: 22
    },
    regular: {
        borderRadius: 26,
        minHeight: 52,
        paddingHorizontal: 18
    },
    text: {
        fontWeight: '800'
    },
    textCompact: {
        fontSize: 15,
        lineHeight: 20
    },
    textLarge: {
        fontSize: 20,
        lineHeight: 26
    },
    textRegular: {
        fontSize: 17,
        lineHeight: 22
    }
});
