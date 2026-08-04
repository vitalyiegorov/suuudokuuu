import { StyleSheet } from 'react-native-unistyles';

export const AppButtonStyles = StyleSheet.create(theme => ({
    button: {
        alignItems: 'center',
        borderCurve: 'continuous',
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        gap: theme.spacing.sm,
        justifyContent: 'center',
        overflow: 'hidden',
        _web: {
            cursor: 'pointer',
            _hover: {
                opacity: 0.85
            }
        }
    },
    compact: {
        borderRadius: 22,
        minHeight: 44,
        paddingHorizontal: 16
    },
    content: {
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 1,
        gap: theme.spacing.sm,
        justifyContent: 'center'
    },
    contentHidden: {
        opacity: 0
    },
    loaderOverlay: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
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
        fontSize: theme.typography.size.lg,
        lineHeight: 26
    },
    textRegular: {
        fontSize: 17,
        lineHeight: 22
    }
}));
