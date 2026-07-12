import { StyleSheet } from 'react-native';

export const AppMetricStripStyles = StyleSheet.create({
    item: {
        alignItems: 'center',
        gap: 2,
        width: 62
    },
    label: {
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.3,
        lineHeight: 11,
        textTransform: 'uppercase'
    },
    separator: {
        height: 30,
        marginHorizontal: 3,
        width: StyleSheet.hairlineWidth
    },
    strip: {
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderCurve: 'continuous',
        borderRadius: 28,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        flexShrink: 1,
        minHeight: 52,
        paddingHorizontal: 10,
        paddingVertical: 6
    },
    value: {
        fontVariant: ['tabular-nums'],
        fontSize: 18,
        fontWeight: '900',
        lineHeight: 20,
        textAlign: 'center'
    }
});
