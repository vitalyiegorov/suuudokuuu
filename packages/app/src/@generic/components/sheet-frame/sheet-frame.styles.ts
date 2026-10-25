import { StyleSheet } from 'react-native-unistyles';

export const SheetFrameStyles = StyleSheet.create(theme => ({
    backdrop: {
        ...StyleSheet.absoluteFill
    },
    handle: {
        alignSelf: 'center',
        borderRadius: 3,
        height: 5,
        marginTop: theme.spacing.sm,
        width: 36
    },
    panel: {
        alignSelf: 'center',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxWidth: 640,
        overflow: 'hidden',
        width: '100%'
    },
    root: {
        flex: 1,
        justifyContent: 'flex-end'
    }
}));
