import { StyleSheet } from 'react-native-unistyles';

export const AppMetricStripStyles = StyleSheet.create(theme => ({
    separator: {
        backgroundColor: theme.colors.surface.border,
        height: 28,
        marginHorizontal: 3,
        width: StyleSheet.hairlineWidth
    },
    strip: {
        backgroundColor: theme.colors.background,
        borderColor: 'transparent',
        alignItems: 'center',
        alignSelf: 'flex-start',
        borderCurve: 'continuous',
        borderRadius: 28,
        borderWidth: 1,
        flexDirection: 'row',
        flexShrink: 1,
        minHeight: 52,
        paddingHorizontal: 10,
        paddingVertical: 6
    }
}));
