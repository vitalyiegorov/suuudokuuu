import { StyleSheet } from 'react-native-unistyles';

import { ImportCompactFrameHeightConstant } from './constants/import-compact-frame-height.constant';

export const ImportScreenStyles = StyleSheet.create((theme, rt) => ({
    content: { alignSelf: 'center', maxWidth: '100%' },
    sourcesContent: { paddingVertical: theme.spacing.md, flexGrow: 1, justifyContent: 'center' },
    scroll: { flexGrow: 1, flexBasis: 0, flexShrink: 1, minHeight: 0 },
    boardScroll: { flexGrow: 0, flexShrink: 1, minHeight: 0 },
    statusSlot: {
        alignSelf: 'center',
        flexShrink: 0,
        gap: theme.spacing.xs,
        maxWidth: '100%',
        paddingTop: rt.screen.height < ImportCompactFrameHeightConstant ? theme.spacing.xs : theme.spacing.sm * 2
    },
    sourceStatus: { alignItems: 'center', gap: theme.spacing.xs }
}));
