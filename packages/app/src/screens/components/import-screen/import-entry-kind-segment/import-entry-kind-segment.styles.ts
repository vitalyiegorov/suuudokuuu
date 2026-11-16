import { StyleSheet } from 'react-native-unistyles';

export const ImportEntryKindSegmentStyles = StyleSheet.create(theme => ({
    segment: {
        alignItems: 'center',
        borderRadius: theme.radius.pill,
        flexBasis: 0,
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.sm,
        _web: { cursor: 'pointer' }
    },
    thumb: { backgroundColor: theme.colors.surface.raised },
    label: { color: theme.colors.surface.subtleHint, fontSize: 15, fontWeight: '700', textAlign: 'center' },
    thumbLabel: { color: theme.colors.surface.raisedText }
}));
