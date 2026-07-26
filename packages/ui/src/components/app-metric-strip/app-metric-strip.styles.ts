import { StyleSheet } from 'react-native-unistyles';

export const AppMetricStripStyles = StyleSheet.create(() => ({
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
    }
}));
