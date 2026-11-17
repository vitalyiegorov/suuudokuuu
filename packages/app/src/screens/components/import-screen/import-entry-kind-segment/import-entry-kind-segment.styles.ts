import { StyleSheet } from 'react-native-unistyles';

export const ImportEntryKindSegmentStyles = StyleSheet.create(theme => ({
    segment: {
        alignItems: 'center',
        borderRadius: theme.radius.pill,
        flexBasis: 0,
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.xs / 2,
        _web: { cursor: 'pointer' }
    },
    surface: { alignItems: 'center', justifyContent: 'center', width: '100%', flex: 1, borderRadius: theme.radius.pill },
    thumb: { backgroundColor: theme.colors.surface.raised },
    label: { color: theme.colors.surface.subtleHint, fontSize: 15, fontWeight: '700', textAlign: 'center' },
    thumbLabel: { color: theme.colors.surface.raisedText }
}));
