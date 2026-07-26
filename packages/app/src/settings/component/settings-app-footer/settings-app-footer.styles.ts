import { StyleSheet } from 'react-native-unistyles';

export const SettingsAppFooterStyles = StyleSheet.create(theme => ({
    action: {
        alignItems: 'center',
        borderRadius: theme.radius.pill,
        borderWidth: StyleSheet.hairlineWidth,
        minHeight: 38,
        paddingHorizontal: 16,
        paddingVertical: 9,
        _web: {
            cursor: 'pointer',
            _hover: {
                opacity: 0.85
            }
        }
    },
    actionText: {
        fontSize: 13,
        fontWeight: '800',
        lineHeight: 17
    },
    actions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        width: '100%'
    },
    container: {
        alignItems: 'center',
        gap: 18,
        paddingBottom: 6,
        paddingTop: 2,
        width: '100%'
    },
    supportButton: {
        alignItems: 'center',
        borderRadius: 22,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        minHeight: 66,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: 14,
        width: '100%',
        _web: {
            cursor: 'pointer',
            _hover: {
                opacity: 0.85
            }
        }
    },
    supportText: {
        flex: 1,
        fontSize: theme.typography.size.lg,
        fontWeight: '900',
        lineHeight: 25,
        textAlign: 'left'
    },
    version: {
        fontSize: theme.typography.size.md,
        fontWeight: '900',
        lineHeight: 21,
        textAlign: 'center'
    }
}));
