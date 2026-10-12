import { StyleSheet } from 'react-native-unistyles';

import { appButtonGetTextColor } from './utils/app-button-get-text-color.util';

import type { UnistylesThemeInterface } from '../../theme/interface/unistyles-theme.interface';

export const AppButtonStyles = StyleSheet.create((theme: UnistylesThemeInterface) => ({
    button: {
        alignItems: 'center',
        backgroundColor: theme.colors.ink,
        borderColor: theme.colors.ink,
        borderCurve: 'continuous',
        borderWidth: 1,
        flexDirection: 'row',
        gap: theme.spacing.sm,
        justifyContent: 'center',
        overflow: 'hidden',
        variants: {
            size: {
                compact: { borderRadius: 22, minHeight: 44, paddingHorizontal: 16 },
                regular: { borderRadius: 26, minHeight: 52, paddingHorizontal: 18 },
                large: { borderRadius: 30, minHeight: 60, paddingHorizontal: 22 }
            },
            variant: {
                primary: {},
                secondary: { backgroundColor: theme.colors.surface.subtle, borderColor: theme.colors.surface.border },
                ghost: { backgroundColor: theme.colors.background, borderColor: theme.colors.surface.border },
                inverted: { backgroundColor: theme.colors.surface.raised, borderColor: theme.colors.surface.border },
                glass: { backgroundColor: 'transparent', borderColor: 'transparent' },
                dangerFilled: { backgroundColor: theme.colors.danger, borderColor: theme.colors.danger },
                boardSelected: { backgroundColor: theme.colors.board.selected, borderColor: theme.colors.board.selected }
            }
        },
        _web: {
            cursor: 'pointer',
            _hover: { opacity: 0.85 }
        }
    },
    content: {
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 1,
        gap: theme.spacing.sm,
        justifyContent: 'center'
    },
    contentHidden: { opacity: 0 },
    loaderOverlay: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
    },
    pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
    text: {
        color: appButtonGetTextColor(theme, 'primary'),
        fontWeight: '800',
        variants: {
            size: {
                compact: { fontSize: 15, lineHeight: 20 },
                regular: { fontSize: 17, lineHeight: 22 },
                large: { fontSize: theme.typography.size.lg, lineHeight: 26 }
            },
            variant: {
                primary: {},
                secondary: { color: appButtonGetTextColor(theme, 'secondary') },
                ghost: { color: appButtonGetTextColor(theme, 'ghost') },
                inverted: { color: appButtonGetTextColor(theme, 'inverted') },
                glass: {},
                dangerFilled: { color: appButtonGetTextColor(theme, 'dangerFilled') },
                boardSelected: { color: appButtonGetTextColor(theme, 'boardSelected') }
            }
        }
    }
}));
